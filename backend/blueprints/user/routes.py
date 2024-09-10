from flask import Blueprint, Response, jsonify
from flask_jwt_extended import current_user, jwt_required

from blueprints.user.models import UserModel
from run_services import user_service

users_blueprint = Blueprint("users", __name__)


@users_blueprint.route("/all", methods=["GET"])
def get_all_users() -> Response:
    return jsonify(user_service.get_all_list())


@users_blueprint.route("/", methods=["GET"])
@jwt_required()
def get_user() -> Response:
    user: UserModel = current_user
    return jsonify(user.get_accessible_by_user())
