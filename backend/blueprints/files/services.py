from typing import Any, Mapping, Tuple, Dict, io

import gridfs
from bson.objectid import ObjectId
from flask import Request, Response, jsonify
from gridfs import GridOut
from marshmallow import ValidationError
from pymongo.collection import Collection
from werkzeug.datastructures.file_storage import FileStorage

from app import database, grid_fs
from blueprints.files.models import FileInfoModel
from schemas.file import FileDataSchema
from utils.service_utils import BaseCRUDService, Pagination

from PIL import Image

try:
    file_info_collection = database["file_info"]
    file_info_collection.create_index(["owner_id", 1])

except Exception as e:
    print(f"Error: {e}")


class FileInfoService(BaseCRUDService):
    def get_collection(self) -> Collection[Mapping[str, Any]]:
        return file_info_collection

    def get_by_identifier(self, file: FileInfoModel) -> FileInfoModel | None:
        return super().get_one_by({"_id": file.file_id})

    def map_from_db(self, data) -> FileInfoModel:
        return FileInfoModel(
            file_id=str(data["_id"]),
            filename=data["filename"],
            mime_type=data["mime_type"],
            file_size=data["file_size"],
            uploaded_at=data["uploaded_at"],
            owner_id=data["owner_id"],
            last_update_at=data["last_update_at"],
            grid_fs_id=str(data["grid_fs_id"]),
        )

    def get_id(self, file: FileInfoModel) -> str:
        return file.file_id

    def get_paginated_by_owner_id(self, owner_id: str, page: int, per_page: int) -> Pagination:
        resulting_page = super().get_all_by_paginated({"owner_id": ObjectId(owner_id)}, page, per_page)

        def add_thumbnail(file: Dict[str, Any], file_id: str) -> Dict[str, Any]:
            thumbnail = FileInfoService.get_image_thumbnail(file_id)
            file["thumbnail"] = thumbnail
            return file

        resulting_page.collection = [add_thumbnail(file=file, file_id=file['_id']) for file in resulting_page.collection]

        return resulting_page

    @staticmethod
    def get_file_grid_fs(file_id: str) -> GridOut | None:
        try:
            return grid_fs.get(ObjectId(file_id))
        except gridfs.errors.NoFile:
            return None

    @staticmethod
    def update_file_on_grid_fs(file: FileStorage, file_id: str) -> str | None:
        if FileInfoService.get_file_grid_fs(file_id) is None:
            return None

        grid_fs.delete(ObjectId(file_id))

        return FileInfoService.put_file_on_grid_fs(file)

    @staticmethod
    def put_file_on_grid_fs(file: FileStorage) -> str | None:
        return grid_fs.put(file, filename=file.filename, content_type=file.content_type)

    @staticmethod
    def delete_file_from_grid_fs(file_id: str):
        return grid_fs.delete(file_id)

    @staticmethod
    def validate_file_data(request: Request) -> Tuple[Response, int] | FileStorage:
        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]

        if file.filename is None:
            return jsonify({"error": "No selected file"}), 400

        try:
            FileDataSchema().load({"file": file})

        except ValidationError as err:
            return jsonify({"errors": err.messages}), 400

        return file

    @staticmethod
    def get_image_thumbnail(file_id: str) -> str:
        grid_out = FileInfoService.get_file_grid_fs(file_id)

        image_bytes = grid_out.read()
        img = Image.open(io.BytesIO(image_bytes))

        img.thumbnail((150, 150))
        thumb_io = io.BytesIO()
        img.save(thumb_io, format="JPEG")
        thumb_io.seek(0)

        return thumb_io.getvalue().decode("base64")
