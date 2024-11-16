from typing import Tuple

from flask import Blueprint, Response, jsonify
from flask_babel import gettext
from werkzeug.datastructures.file_storage import FileStorage

from blueprints.user.models import UserModel
from grid_fs_service import get_file_grid_fs, put_file_on_grid_fs, update_file_on_grid_fs
from schemas.file import FileInputDataSchema
from schemas.responses import ErrorSchema, SuccessSchema
from schemas.user import UserModelSchema, UserProfilePictureSchema
from utils.request_utils import doc_endpoint, error_dict, success_dict

users_blueprint = Blueprint("users", __name__)

tags = ["Users"]


@users_blueprint.route("/", methods=["GET"])
@doc_endpoint(
    description="Get current user data",
    tags=tags,
    response_schemas=[(UserModelSchema, 200)],
)
def get_user(user: UserModel) -> Tuple[Response, int] | Response:
    return jsonify(user.get_dto())


@users_blueprint.route("/profile-picture", methods=["GET"])
@doc_endpoint(
    description="Get current user profile picture",
    tags=tags,
    response_schemas=[(UserProfilePictureSchema, 200)],
)
def get_user_profile_picture(user: UserModel) -> Tuple[Response, int] | Response:
    return jsonify(
        {
            "data": get_file_grid_fs(user.profile_picture_grid_fs_id)
            if user.profile_picture_grid_fs_id is not None
            else None
        }
    )


@users_blueprint.route("/profile-picture", methods=["POST"])
@doc_endpoint(
    description="Get current user profile picture",
    tags=tags,
    input_schema=FileInputDataSchema,
    response_schemas=[(SuccessSchema, 200), (ErrorSchema, 400)],
    location="files",
)
def upsert_user_profile_picture(user: UserModel, file: FileStorage) -> Tuple[dict, int] | dict:
    file_id_grid_fs = (
        put_file_on_grid_fs(file)
        if user.profile_picture_grid_fs_id is None
        else update_file_on_grid_fs(file, user.profile_picture_grid_fs_id)
    )

    if file_id_grid_fs is None:
        return error_dict(gettext(u"File not saved")), 400

    return success_dict(True)
