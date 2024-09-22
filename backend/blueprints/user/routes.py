from typing import Tuple

from flask import Blueprint, Response, jsonify, request
from flask_jwt_extended import jwt_required
from werkzeug.datastructures.file_storage import FileStorage

from blueprints.user.models import UserModel
from grid_fs_service import get_file_grid_fs, put_file_on_grid_fs, update_file_on_grid_fs, validate_file_data
from run_services import user_service
from utils.request_utils import error_dict, user_required

users_blueprint = Blueprint("users", __name__)


@users_blueprint.route("/all", methods=["GET"])
def get_all_users() -> Tuple[Response, int] | Response:
    return jsonify(user_service.get_all_list())


@users_blueprint.route("/", methods=["GET"])
@jwt_required()
@user_required
def get_user(user: UserModel) -> Tuple[Response, int] | Response:
    return jsonify(user.get_dto())


@users_blueprint.route("/profile-picture", methods=["GET"])
@jwt_required()
@user_required
def get_user_profile_picture(user: UserModel) -> Tuple[Response, int] | Response:
    return jsonify(
        {"data": get_file_grid_fs(user.profile_picture_grid_fs_id) if user.profile_picture_grid_fs_id else None}
    )


@users_blueprint.route("/profile-picture", methods=["POST"])
@jwt_required()
@user_required
def upsert_user_profile_picture(user: UserModel) -> Tuple[Response, int] | Response:
    file_data_or_response = validate_file_data(request)

    if not isinstance(file_data_or_response, FileStorage):
        return file_data_or_response

    file_id_grid_fs = (
        put_file_on_grid_fs(file_data_or_response)
        if user.profile_picture_grid_fs_id is None
        else update_file_on_grid_fs(file_data_or_response, user.profile_picture_grid_fs_id)
    )

    if file_id_grid_fs is None:
        return jsonify(error_dict("File not saved")), 400

    return jsonify(success=True)
