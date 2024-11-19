import io
from datetime import datetime
from typing import Tuple

from flask import Blueprint, Response, jsonify, request, send_file
from flask_babel import gettext
from werkzeug.datastructures import FileStorage

import grid_fs_service
from blueprints.files.models import FileInfoModel
from blueprints.files.services import count_user_files, get_total_file_size_in_mb
from blueprints.user.models import UserModel
from grid_fs_service import (
    add_thumbnail,
    delete_file_from_grid_fs,
    put_file_on_grid_fs,
    update_file_on_grid_fs,
)
from run_services import file_service
from schemas.file import (
    FileInfoEditSchema,
    FileInfoSchema,
    FileInputDataSchema,
    FileOutputDataSchema,
    FilePaginationSchema,
)
from schemas.responses import ErrorSchema, SuccessSchema
from utils.request_utils import doc_endpoint, error_dict, success_dict

files_blueprint = Blueprint("files", __name__)
tags = ["Files"]
MAX_NUMBER_OF_FILES = 5
MAX_MB_OF_FILES = 20


@files_blueprint.route("/", methods=["GET"])
@doc_endpoint(
    description="Retrieve files with pagination",
    tags=tags,
    response_schemas=[(FilePaginationSchema, 200)],
)
def get_files(user: UserModel) -> Tuple[Response, int] | Response:
    page: int = request.args.get("page", 1, type=int)
    per_page: int = request.args.get("per_page", 10, type=int)

    if user.uid is None:
        return jsonify(error_dict(gettext("Incorrect user"))), 400

    files = file_service.get_paginated_by_owner_id(user.uid, page, per_page)

    return jsonify(files.__dict__)


@files_blueprint.route("/<file_id>", methods=["GET"])
@doc_endpoint(
    description="Retrieve file details by file ID",
    tags=tags,
    response_schemas=[(FileInfoEditSchema, 200), (ErrorSchema, 400)],
)
def get_file(file_id: str, user: UserModel) -> Tuple[Response, int] | Response:
    file: FileInfoModel | None = file_service.get_by_id(file_id)

    if file is None or file.owner_id != user.uid:
        return jsonify(error_dict(gettext("File doesn't exist"))), 400

    return jsonify(file.get_dto())


@files_blueprint.route("/", methods=["POST"])
@doc_endpoint(
    description="Add new file",
    tags=tags,
    response_schemas=[(FileInfoSchema, 200), (ErrorSchema, 400)],
    input_schema=FileInputDataSchema,
    location="files",
)
def post_file(user: UserModel, file: FileStorage) -> Tuple[dict, int] | dict:
    if user.uid is None:
        return error_dict("Incorrect user"), 401

    number_of_user_files = count_user_files(user.uid)

    file_id_grid_fs = put_file_on_grid_fs(file)

    # Ensure that `file_from_grid.length` is accessed properly to get the file size in bytes
    if file_id_grid_fs is None or user.uid is None or file.filename is None:
        return error_dict(gettext("File not saved")), 400

    file_from_grid = grid_fs_service.get_file_grid_fs(file_id_grid_fs)

    file_size = getattr(file_from_grid, "length", None)
    if file_size is None:
        delete_file_from_grid_fs(file_id_grid_fs)
        return error_dict(gettext("Unable to retrieve file size")), 400

    file_info = FileInfoModel(
        file_id=None,
        filename=file.filename,
        mime_type=file.content_type,
        file_size=file_size,
        uploaded_at=datetime.now(),
        last_update_at=datetime.now(),
        owner_id=user.uid,
        grid_fs_id=file_id_grid_fs,
    )

    mb_of_user_files = get_total_file_size_in_mb(user.uid)

    if number_of_user_files >= MAX_NUMBER_OF_FILES or mb_of_user_files >= MAX_MB_OF_FILES:
        delete_file_from_grid_fs(file_id_grid_fs)
        return error_dict(
            gettext(
                "Maximum number of files you can upload is %(max_files)s or %(max_mb)s MB",
                max_files=MAX_NUMBER_OF_FILES,
                max_mb=MAX_MB_OF_FILES,
            )
        ), 400

    file_id = file_service.insert(file_info)
    if file_id is None:
        delete_file_from_grid_fs(file_id_grid_fs)
        return error_dict(gettext("File info not saved")), 400

    file_info.file_id = file_id
    return add_thumbnail(obj_dict=file_info.get_dto(), grid_fs_id=file_id_grid_fs)


@files_blueprint.route("/<file_id>", methods=["DELETE"])
@doc_endpoint(
    description="Delete existing file",
    tags=tags,
    response_schemas=[(SuccessSchema, 200), (ErrorSchema, 400)],
)
def delete_file(file_id: str, user: UserModel) -> Tuple[Response, int] | Response:
    file: FileInfoModel | None = file_service.get_by_id(file_id)
    if file is None or file.owner_id != user.uid:
        return jsonify(error_dict(gettext("File doesn't exist"))), 400

    delete_file_from_grid_fs(file.grid_fs_id)

    is_file_info_deleted = file_service.delete(file)
    if not is_file_info_deleted:
        return jsonify(error_dict(gettext("File wasn't deleted"))), 400

    return jsonify(success_dict(True))


@files_blueprint.route("/<file_id>", methods=["PATCH"])
@doc_endpoint(
    description="Edit existing file",
    tags=tags,
    input_schema=FileInfoEditSchema,
    response_schemas=[
        (SuccessSchema, 200),
        (ErrorSchema, 400),
    ],
)
def update_file_info(file_id: str, user: UserModel, filename: str) -> Tuple[dict, int] | dict:
    file: FileInfoModel | None = file_service.get_by_id(file_id)

    if file is None or file.owner_id != user.uid:
        return error_dict(gettext("File doesn't exist")), 400

    file.filename = filename

    updated_file_info_id: str | None = file_service.update(file)

    if updated_file_info_id is None:
        return error_dict(gettext("File not updated")), 400

    return success_dict(True)


@files_blueprint.route("/data/<file_id>", methods=["PATCH"])
@doc_endpoint(
    description="Switch file data for a given file",
    tags=tags,
    input_schema=FileInputDataSchema,
    response_schemas=[(SuccessSchema, 200), (ErrorSchema, 400)],
    location="files",
)
def update_file_data(file_id: str, user: UserModel, file: FileStorage) -> Tuple[dict, int] | dict:
    file_info: FileInfoModel | None = file_service.get_by_id(file_id)
    if file_info is None or file_info.owner_id != user.uid:
        return error_dict(gettext("File doesn't exist")), 400

    new_file_id_grid_fs = update_file_on_grid_fs(file, file_info.grid_fs_id)

    if new_file_id_grid_fs is None:
        return error_dict(gettext("Couldn't update file")), 400

    file_info.grid_fs_id = new_file_id_grid_fs

    if new_file_id_grid_fs is None:
        return error_dict(gettext("File not updated")), 400

    updated_file_info: str | None = file_service.update(file_info)

    if updated_file_info is None:
        return error_dict(gettext("File not updated")), 400

    return success_dict(True)


@files_blueprint.route("/data/download/<file_id>", methods=["GET"])
@doc_endpoint(
    description="Download data",
    tags=tags,
    response_schemas=[(FileOutputDataSchema, 200), (ErrorSchema, 400)],
)
def get_file_data(file_id: str, user: UserModel) -> Tuple[Response, int] | Response:
    file: FileInfoModel | None = file_service.get_by_id(file_id)

    if file is None or file.owner_id != user.uid:
        return jsonify(error_dict(gettext("File data doesn't exist"))), 400

    file_from_grid = grid_fs_service.get_file_grid_fs(file.grid_fs_id)

    if file_from_grid is None:
        return jsonify(error_dict(gettext("File doesn't exist"))), 400

    return send_file(
        io.BytesIO(file_from_grid.read()),
        mimetype=file_from_grid.content_type if file_from_grid.content_type is not None else "application/octet-stream",
        download_name=file_from_grid.filename,
    )
