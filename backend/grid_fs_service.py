import base64
import io
from typing import Any, Dict, Tuple, List

import gridfs
from bson import ObjectId
from flask import Request
from gridfs import GridOut
from marshmallow import ValidationError
from PIL import Image
from werkzeug.datastructures.file_storage import FileStorage

from app import grid_fs
from schemas.file import FileInputDataSchema
from utils.request_utils import error_dict


SUPPORTED_FILE_FORMATS: List[str] = ['JPEG', 'PNG']
SUPPORTED_COLOR_SPACES: List[str] = ['RGB', 'RGBA']

DEFAULT_FILE_FORMAT: str = 'PNG'
DEFAULT_COLORSPACE: str = 'RGB'


def get_file_grid_fs(file_id: str) -> GridOut | None:
    try:
        return grid_fs.get(ObjectId(file_id))
    except gridfs.errors.NoFile:
        return None


def update_file_on_grid_fs(file: FileStorage, file_id: str) -> str | None:
    if get_file_grid_fs(file_id) is None:
        return None

    delete_file_from_grid_fs(file_id)

    return put_file_on_grid_fs(file)


def put_file_on_grid_fs(file: FileStorage) -> str | None:
    return str(grid_fs.put(file, filename=file.filename, content_type=file.content_type))


def delete_file_from_grid_fs(file_id: str):
    return grid_fs.delete(ObjectId(file_id))


def get_image_thumbnail(file_id: str) -> str:
    grid_out = get_file_grid_fs(file_id)

    if grid_out is None:
        return ""

    try:
        image_bytes = grid_out.read()

        img = Image.open(io.BytesIO(image_bytes))

        if img.mode not in SUPPORTED_COLOR_SPACES:
            img = img.convert(DEFAULT_COLORSPACE)

        img.thumbnail((150, 150))

        thumb_io = io.BytesIO()

        save_format = img.format if img.format in SUPPORTED_FILE_FORMATS else DEFAULT_FILE_FORMAT
        img.save(thumb_io, format=save_format)
        thumb_io.seek(0)

        return base64.b64encode(thumb_io.getvalue()).decode()

    except (Exception,):
        return ""


def validate_file_data(request: Request) -> Tuple[dict, int] | FileStorage:
    if "file" not in request.files:
        return error_dict("No file part"), 400

    file = request.files["file"]

    if file.filename is None:
        return error_dict("No selected file"), 400

    try:
        FileInputDataSchema().load({"file": file})

    except ValidationError as err:
        return error_dict(str(err.messages)), 400

    return file


def add_thumbnail(obj_dict: Dict[str, Any], grid_fs_id: str) -> Dict[str, Any]:
    thumbnail = get_image_thumbnail(grid_fs_id)
    obj_dict["thumbnail"] = thumbnail
    return obj_dict
