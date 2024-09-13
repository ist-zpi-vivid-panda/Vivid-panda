from typing import Tuple

from flask import Blueprint, Response, jsonify, render_template
from flask_jwt_extended import get_jwt_identity, jwt_required

from blueprints.user.models import UserModel

core_blueprint = Blueprint("core", __name__, template_folder="templates")


@core_blueprint.route("/protected", methods=["GET"])
@jwt_required()
def protected() -> Tuple[Response, int] | Response:
    current_user: UserModel | None = get_jwt_identity()
    return jsonify(logged_in_as=current_user)


@core_blueprint.route("/")
def login() -> str:
    return render_template("logging_page.html")


@core_blueprint.route("/register")
def register() -> str:
    return render_template("register.html")


@core_blueprint.route("/forgot-password")
def forgot_password():
    return render_template("forgot_password.html")


# path params
@core_blueprint.route("/add/<int:number1>/<int:number2>")
def add(number1: int, number2: int):
    return f"{number1} + {number2} = {number1 + number2}"


# string query params
@core_blueprint.route("/handle_url_params")
def handle_url_params():
    return ""
