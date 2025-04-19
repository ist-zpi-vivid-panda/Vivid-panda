from typing import Tuple

from flask import Response, jsonify
from flask_jwt_extended import JWTManager

from blueprints.user.models import UserModel
from run_services import user_service


def config_jwt(jwt: JWTManager):
    @jwt.user_identity_loader
    def user_identity_lookup(user: UserModel) -> str:
        return user.email

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data) -> UserModel | None:
        email = jwt_data["sub"]
        return user_service.get_by_email(email)

    @jwt.needs_fresh_token_loader
    def token_not_fresh_callback(jwt_header, jwt_payload) -> Tuple[Response, int]:
        return (
            jsonify(
                {
                    "message": "The token is not fresh.",
                    "error": "fresh_token_required",
                }
            ),
            401,
        )

    @jwt.expired_token_loader
    def expired_token_callback(expired_token) -> Tuple[Response, int]:
        token_type = expired_token["type"]
        return (
            jsonify(
                {
                    "error": "token_expired",
                    "message": "The {} token has expired".format(token_type),
                }
            ),
            401,
        )

    @jwt.invalid_token_loader
    def invalid_token_callback(error) -> Tuple[Response, int]:
        return (
            jsonify(
                {
                    "message": "Signature verification failed.",
                    "error": "invalid_token",
                }
            ),
            401,
        )

    @jwt.unauthorized_loader
    def unauthorized_callback(error):
        return (
            jsonify(
                {
                    "message": "Missing token.",
                    "error": "missing_token",
                }
            ),
            401,
        )
