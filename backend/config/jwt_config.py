from datetime import timedelta
from typing import Tuple

from flask import Flask, Response, jsonify
from flask_jwt_extended import JWTManager

from blueprints.user.models import UserModel
from config.env_vars import JWT_ACCESS_TOKEN_EXPIRES, JWT_REFRESH_TOKEN_EXPIRES, JWT_SECRET_KEY
from run_services import user_service
from utils.request_utils import error_dict


def create_jwt_config(app: Flask) -> JWTManager:
    app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(seconds=JWT_ACCESS_TOKEN_EXPIRES)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(seconds=JWT_REFRESH_TOKEN_EXPIRES)

    jwt = JWTManager()
    __config_jwt(jwt)

    jwt.init_app(app)

    return jwt


def __config_jwt(jwt: JWTManager) -> None:
    @jwt.user_identity_loader
    def user_identity_lookup(user: UserModel) -> str:
        return user.email.lower()

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data) -> UserModel | None:
        email: str | None = jwt_data["sub"]
        if email is None:
            return None

        return user_service.get_by_email(email)

    @jwt.needs_fresh_token_loader
    def token_not_fresh_callback(jwt_header, jwt_payload) -> Tuple[Response, int]:
        return (
            jsonify(error_dict("The token is not fresh")),
            401,
        )

    @jwt.expired_token_loader
    def expired_token_callback(header, payload) -> Tuple[Response, int]:
        token_type = payload["type"]
        return (
            jsonify(error_dict("The {} token has expired".format(token_type))),
            401,
        )

    @jwt.invalid_token_loader
    def invalid_token_callback(error) -> Tuple[Response, int]:
        return (
            jsonify(error_dict("Signature verification failed")),
            401,
        )

    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        return (
            jsonify(error_dict("Missing token")),
            401,
        )
