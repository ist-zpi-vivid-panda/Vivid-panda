from datetime import datetime
from typing import Tuple

from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from blueprints.files.models import FileInfoModel
from blueprints.user.models import UserModel
from run_services import file_service
from utils.request_utils import user_required

files_blueprint = Blueprint("files", __name__)


@files_blueprint.route("/", methods=["GET"])
@jwt_required()
@user_required
def get_files() -> Tuple[Response, int] | Response:
    page: int = request.args.get("page", 1, type=int)
    per_page: int = request.args.get("per_page", 10, type=int)

    user: UserModel | None = get_jwt_identity()

    # if user is None:
    #     return jsonify({"error": "Incorrect user"}), 401

    files = file_service.get_paginated_by_owner_id(user.uid, page, per_page)

    return jsonify(files)


@files_blueprint.route("/<file_id>", methods=["GET"])
@jwt_required()
@user_required
def get_file(file_id: int) -> Tuple[Response, int] | Response:
    user: UserModel = get_jwt_identity()

    file: FileInfoModel | None = file_service.get_by_id(file_id)

    if file is None or (file is not None and file.owner_id != user.uid):
        return jsonify({"error": "File doesn't exist"}), 400

    return jsonify(file)


@files_blueprint.route("/", methods=["POST"])
@jwt_required()
@user_required
def post_file() -> Tuple[Response, int] | Response:
    user: UserModel = get_jwt_identity()

    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]

    if file.filename:
        return jsonify({"error": "No selected file"}), 400

    file_id_grid_fs = file_service.put_file_on_grid_fs(file)

    if file_id_grid_fs is None:
        return jsonify({"error": "File not saved"}), 400

    file_info = FileInfoModel(
        file_id=file_id_grid_fs,
        filename=file.filename,
        mime_type=file.content_type,
        file_size=file.content_length,
        uploaded_at=datetime.now(),
        owner_id=user.uid,
    )

    return jsonify(file_info)


@files_blueprint.route("/<file_id>", methods=["DELETE"])
@jwt_required()
@user_required
def delete_file(file_id: int) -> Tuple[Response, int] | Response:
    user: UserModel = get_jwt_identity()

    file: FileInfoModel | None = file_service.get_by_id(file_id)

    if file is None or (file is not None and file.owner_id != user.uid):
        return jsonify({"error": "File doesn't exist"}), 400

    is_file_info_deleted = file_service.delete(file)
    if not is_file_info_deleted:
        return jsonify({"error": "File wasn't deleted"}), 400

    file_service.delete_file_from_grid_fs(file_id)

    return jsonify(success=True)
