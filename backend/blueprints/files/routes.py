from datetime import datetime
from typing import Tuple

from flask import Blueprint, Response, jsonify, request
from werkzeug.datastructures import FileStorage

from blueprints.files.models import FileInfoModel
from blueprints.user.models import UserModel
from grid_fs_service import (
    add_thumbnail,
    delete_file_from_grid_fs,
    put_file_on_grid_fs,
    update_file_on_grid_fs,
    validate_file_data,
)
from run_services import file_service
from schemas.file import FileInfoEditSchema, FileInfoSchema, FilePaginationSchema
from schemas.responses import ErrorSchema, SuccessSchema
from utils.request_utils import error_dict, secure_endpoint, validation_errors_dict

tags = ["Files"]

files_blueprint = Blueprint("files", __name__)


@files_blueprint.route("/", methods=["GET"])
@secure_endpoint(
    description="Retrieve files with pagination",
    tags=tags,
    response_schemas=[(FilePaginationSchema, 200), (ErrorSchema, 401)],
)
def get_files(user: UserModel) -> Tuple[Response, int] | Response:
    page: int = request.args.get("page", 1, type=int)
    per_page: int = request.args.get("per_page", 10, type=int)

    files = file_service.get_paginated_by_owner_id(user.uid, page, per_page)

    return jsonify(files.__dict__)


@files_blueprint.route("/<file_id>", methods=["GET"])
@secure_endpoint(
    description="Retrieve file details by file ID",
    tags=tags,
    response_schemas=[(FileInfoEditSchema, 200), (ErrorSchema, 400), (ErrorSchema, 401)],
)
def get_file(file_id: int, user: UserModel) -> Tuple[Response, int] | Response:
    file: FileInfoModel | None = file_service.get_by_id(file_id)

    if file is None or file.owner_id != user.uid:
        return jsonify(error_dict("File doesn't exist")), 400

    return jsonify(file.get_dto())


@files_blueprint.route("/", methods=["POST"])
@secure_endpoint(
    description="Add new file",
    tags=tags,
    response_schemas=[(FileInfoSchema, 200), (ErrorSchema, 400), (ErrorSchema, 401)],
)
def post_file(user: UserModel) -> Tuple[Response, int] | Response:
    file_data_or_response = validate_file_data(request)

    if not isinstance(file_data_or_response, FileStorage):
        return file_data_or_response

    file_id_grid_fs = put_file_on_grid_fs(file_data_or_response)

    if file_id_grid_fs is None:
        return jsonify(error_dict("File not saved")), 400

    file_info = FileInfoModel(
        file_id=None,
        filename=file_data_or_response.filename,
        mime_type=file_data_or_response.content_type,
        file_size=file_data_or_response.content_length,
        uploaded_at=datetime.now(),
        last_update_at=datetime.now(),
        owner_id=user.uid,
        grid_fs_id=file_id_grid_fs,
    )

    file_id = file_service.insert(file_info)

    if file_id is None:
        return jsonify(error_dict("File info not saved")), 400

    file_info.file_id = file_id

    return jsonify(add_thumbnail(obj_dict=file_info.get_dto(), grid_fs_id=file_id_grid_fs))


@files_blueprint.route("/<file_id>", methods=["DELETE"])
@secure_endpoint(
    description="Delete existing file",
    tags=tags,
    response_schemas=[(SuccessSchema, 200), (ErrorSchema, 400), (ErrorSchema, 401)],
)
def delete_file(file_id: str, user: UserModel) -> Tuple[Response, int] | Response:
    file: FileInfoModel | None = file_service.get_by_id(file_id)

    if file is None or (file is not None and file.owner_id != user.uid):
        return jsonify(error_dict("File doesn't exist")), 400

    is_file_info_deleted = file_service.delete(file)
    if not is_file_info_deleted:
        return jsonify(error_dict("File wasn't deleted")), 400

    delete_file_from_grid_fs(file_id)

    return jsonify(success=True)


@files_blueprint.route("/<file_id>", methods=["PATCH"])
@secure_endpoint(
    description="Edit existing file",
    tags=tags,
    response_schemas=[(SuccessSchema, 200), (ErrorSchema, 400), (ErrorSchema, 401)],
)
def update_file_info(file_id: int, user: UserModel) -> Tuple[Response, int] | Response:
    file_info_schema = FileInfoEditSchema()
    errors = file_info_schema.validate(request.json)
    if errors:
        return jsonify(validation_errors_dict(errors)), 400

    file: FileInfoModel | None = file_service.get_by_id(file_id)

    if file is None or file.owner_id != user.uid:
        return jsonify(error_dict("File doesn't exist")), 400

    file.filename = request.json["filename"]

    updated_file_info: FileInfoModel | None = file_service.update(file)

    if updated_file_info is None:
        return jsonify(error_dict("File not updated")), 400

    return jsonify(success=True)


@files_blueprint.route("/data/<file_id>", methods=["PATCH"])
@secure_endpoint(
    description="Switch file data for a given file",
    tags=tags,
    response_schemas=[(SuccessSchema, 200), (ErrorSchema, 400), (ErrorSchema, 401)],
)
def update_file_data(file_id: str, user: UserModel) -> Tuple[Response, int] | Response:
    file: FileInfoModel | None = file_service.get_by_id(file_id)

    if file is None or file.owner_id != user.uid:
        return jsonify(error_dict("File doesn't exist")), 400

    new_file_data_or_response = validate_file_data(request)

    if not isinstance(new_file_data_or_response, FileStorage):
        return new_file_data_or_response

    new_file_id_grid_fs = update_file_on_grid_fs(new_file_data_or_response, file_id)

    file.grid_fs_id = new_file_id_grid_fs

    if new_file_id_grid_fs is None:
        return jsonify(error_dict("File not updated")), 400

    updated_file_info: FileInfoModel | None = file_service.update_file_info(file)

    if updated_file_info is None:
        return jsonify(error_dict("File not updated")), 400

    return jsonify(success=True)
