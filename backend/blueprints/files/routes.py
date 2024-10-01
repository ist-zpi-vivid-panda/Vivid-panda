from datetime import datetime
from typing import Tuple

from flask import Blueprint, Response, jsonify, request, send_file
from flask_jwt_extended import jwt_required
from werkzeug.datastructures import FileStorage

from blueprints.files.models import FileInfoModel
from blueprints.user.models import UserModel
from run_services import file_service
from schemas.file import FileInfoSchema
from utils.request_utils import user_required

files_blueprint = Blueprint("files", __name__)


@files_blueprint.route("/", methods=["GET"])
@jwt_required()
@user_required
def get_files(user: UserModel) -> Tuple[Response, int] | Response:
    page: int = request.args.get("page", 1, type=int)
    per_page: int = request.args.get("per_page", 10, type=int)

    files = file_service.get_paginated_by_owner_id(user.uid, page, per_page)

    return jsonify(files.__dict__)


@files_blueprint.route("/<file_id>", methods=["GET"])
@jwt_required()
@user_required
def get_file(file_id: int, user: UserModel) -> Tuple[Response, int] | Response:
    file: FileInfoModel | None = file_service.get_by_id(file_id)

    if file is None or file.owner_id != user.uid:
        return jsonify({"error": "File doesn't exist"}), 400

    return jsonify(file.get_dto())


@files_blueprint.route("/", methods=["POST"])
@jwt_required()
@user_required
def post_file(user: UserModel) -> Tuple[Response, int] | Response:
    file_data_or_response = file_service.validate_file_data(request)

    if not isinstance(file_data_or_response, FileStorage):
        return file_data_or_response

    file_id_grid_fs = file_service.put_file_on_grid_fs(file_data_or_response)

    if file_id_grid_fs is None:
        return jsonify({"error": "File not saved"}), 400

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
        return jsonify({"error": "File info not saved"}), 400

    file_info.file_id = file_id

    return jsonify(file_info.get_dto())


@files_blueprint.route("/<file_id>", methods=["DELETE"])
@jwt_required()
@user_required
def delete_file(file_id: int, user: UserModel) -> Tuple[Response, int] | Response:
    file: FileInfoModel | None = file_service.get_by_id(file_id)

    if file is None or (file is not None and file.owner_id != user.uid):
        return jsonify({"error": "File doesn't exist"}), 400

    is_file_info_deleted = file_service.delete(file)
    if not is_file_info_deleted:
        return jsonify({"error": "File wasn't deleted"}), 400

    file_service.delete_file_from_grid_fs(file_id)

    return jsonify(success=True)


@files_blueprint.route("/<file_id>", methods=["PUT"])
@jwt_required()
@user_required
def update_file_info(file_id: int, user: UserModel) -> Tuple[Response, int] | Response:
    file_info_schema = FileInfoSchema()
    errors = file_info_schema.validate(request.json)
    if errors:
        return jsonify({"errors": errors}), 400

    file: FileInfoModel | None = file_service.get_by_id(file_id)

    if file is None or file.owner_id != user.uid:
        return jsonify({"error": "File doesn't exist"}), 400

    file.filename = request.json["filename"]

    updated_file_info: FileInfoModel | None = file_service.update_file_info(file)

    if updated_file_info is None:
        return jsonify({"error": "File not updated"}), 400

    return jsonify(updated_file_info.get_dto())


@files_blueprint.route("/data/<file_id>", methods=["PUT"])
@jwt_required()
@user_required
def update_file_data(file_id: int, user: UserModel) -> Tuple[Response, int] | Response:
    file: FileInfoModel | None = file_service.get_by_id(file_id)

    if file is None or file.owner_id != user.uid:
        return jsonify({"error": "File doesn't exist"}), 400

    new_file_data_or_response = file_service.validate_file_data(request)

    if not isinstance(new_file_data_or_response, FileStorage):
        return new_file_data_or_response

    new_file_id_grid_fs = file_service.update_file_on_grid_fs(new_file_data_or_response, file_id)

    file.grid_fs_id = new_file_id_grid_fs

    if new_file_id_grid_fs is None:
        return jsonify({"error": "File not updated"}), 400

    updated_file_info: FileInfoModel | None = file_service.update_file_info(file)

    if updated_file_info is None:
        return jsonify({"error": "File not updated"}), 400

    return jsonify(success=True)


@files_blueprint.route("/download/<file_id>", methods=["GET"])
@jwt_required()
@user_required
def get_file_to_download(user: UserModel, file_id: str) -> Tuple[Response, int] | Response:
    file_info = file_service.get_by_id(file_id)

    if file_info is None:
        return jsonify({"error": "File not found"}), 404

    file_data = file_service.get_file_grid_fs(file_info)

    if file_data is None:
        return jsonify({"error": "File not found in GridFS"}), 404

    response = send_file(
        file_data,
        mimetype=file_info.mime_type,
        as_attachment=True,
        attachment_filename=file_info.filename
    )

    return response
