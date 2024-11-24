from typing import Tuple

from flask import Blueprint, request
from flask_apispec import marshal_with
from flask_babel import gettext
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
)
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from werkzeug.security import check_password_hash, generate_password_hash

from blueprints.auth.services import send_reset_password_email, validate_reset_password_token
from blueprints.user.models import AccountDataProvider, UserModel
from config.env_vars import GOOGLE_CLIENT_ID
from run_services import user_service
from schemas.auth import (
    AccessTokenSchema,
    GoogleAuth,
    LoginSchema,
    RegisterSchema,
    ResetPasswordSchema,
    SendEmailRequestSchema,
    TokensSchema,
)
from schemas.responses import ErrorSchema, SuccessSchema
from utils.request_utils import doc_endpoint, error_dict, success_dict, user_required

# Short-lived tokens mean that we do not need a blocklist
# and the fact that we use JWT in headers means that there is no need for a logout endpoint.
# If the app was higher security we would simply implement a blocklist or use cookies with proper CORS policy.
auth_blueprint = Blueprint("auth", __name__)

tags = ["Authentication"]


def create_access_token_for_user(user: UserModel) -> str:
    return create_access_token(identity=user, fresh=True)


def create_tokens(user: UserModel) -> dict:
    access_token = create_access_token_for_user(user)
    refresh_token = create_refresh_token(identity=user)

    return {"access_token": access_token, "refresh_token": refresh_token}


@auth_blueprint.route("/register", methods=["POST"])
@doc_endpoint(
    description="Register user",
    tags=tags,
    input_schema=RegisterSchema,
    response_schemas=[(TokensSchema, 200), (ErrorSchema, 400)],
    secure=False,
)
def register(email: str, username: str | None, password: str) -> Tuple[dict, int] | dict:
    user = UserModel(None, email, username, generate_password_hash(password), AccountDataProvider.LOCAL, None)
    result = user_service.insert(user)

    if result is None:
        return error_dict(gettext("Email already registered")), 400

    return create_tokens(user)


@auth_blueprint.route("/login", methods=["POST"])
@doc_endpoint(
    description="Login user",
    tags=tags,
    input_schema=LoginSchema,
    response_schemas=[(TokensSchema, 200), (ErrorSchema, 400), (ErrorSchema, 401)],
    secure=False,
)
def login(email: str, password: str) -> Tuple[dict, int] | dict:
    user = user_service.get_by_email(email)
    if user is None or not check_password_hash(user.password_hash, password):
        return error_dict(gettext("Invalid username or password")), 401

    if user.provider != AccountDataProvider.LOCAL:
        return error_dict(gettext("Account already exists for another provider")), 400

    return create_tokens(user)


@auth_blueprint.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)  # only refresh tokens can access this
@user_required
@marshal_with(schema=ErrorSchema, code=401)
@doc_endpoint(
    description="Refresh access token",
    tags=tags,
    response_schemas=[(TokensSchema, 200), (AccessTokenSchema, 200)],
    secure=False,  # add security other way
)
def refresh(user: UserModel) -> Tuple[dict, int] | dict:
    access_token = create_access_token_for_user(user)
    return {"access_token": access_token}


@auth_blueprint.route("/request_reset_password", methods=["POST"])
@doc_endpoint(
    description="Request password reset email",
    tags=tags,
    input_schema=SendEmailRequestSchema,
    response_schemas=[(SuccessSchema, 200), (ErrorSchema, 400)],
    secure=False,
)
def request_reset_password(email: str) -> Tuple[dict, int] | dict:
    user = user_service.get_by_email(email)

    if user is None:
        return error_dict(gettext("User does not exists")), 400

    if user.provider != AccountDataProvider.LOCAL:
        return error_dict(gettext("Cannot reset password for this account provider")), 400

    send_reset_password_email(user)

    return success_dict(True)


@auth_blueprint.route("/reset_password", methods=["POST"])
@doc_endpoint(
    description="Reset password",
    tags=tags,
    input_schema=ResetPasswordSchema,
    response_schemas=[(SuccessSchema, 200), (ErrorSchema, 400)],
    secure=False,
)
def reset_password(password: str, password_repeated: str) -> Tuple[dict, int] | dict:
    token = request.args.get("token")
    user_id = request.args.get("user_id")

    if token is None or user_id is None:
        return error_dict(gettext("Missing data")), 400

    if (user := validate_reset_password_token(token, user_id)) is None:
        return error_dict(gettext("Token expired")), 400

    if not password == password_repeated:
        return error_dict(gettext("Passwords are not the same")), 400

    if user is None or check_password_hash(user.password_hash, password):
        return error_dict(gettext("Passwords cannot be the same as previous password")), 400

    user.password_hash = generate_password_hash(password)
    user_service.update(user)

    return success_dict(True)


@auth_blueprint.route("/google-callback", methods=["POST"])
@doc_endpoint(
    description="Google callback endpoint",
    tags=tags,
    input_schema=GoogleAuth,
    response_schemas=[(TokensSchema, 200), (ErrorSchema, 400)],
    secure=False,
)
def callback_google(code: str | None) -> Tuple[dict, int] | dict:
    if not code:
        return error_dict(gettext("Invalid Google token"))

    try:
        id_info = id_token.verify_oauth2_token(code, Request(), GOOGLE_CLIENT_ID, clock_skew_in_seconds=100)

        user_email = id_info.get("email")
        user_username = id_info.get("given_name")

        if not user_email:
            return error_dict(gettext("User email not available or not verified by Google")), 400

        user = user_service.get_by_email(user_email)

        if user is None:
            user = UserModel(None, user_email, user_username, "", AccountDataProvider.GOOGLE, None)
            user_service.insert(user)
        elif user.provider != AccountDataProvider.GOOGLE:
            return error_dict(gettext("Account already exists for another provider")), 400

        return create_tokens(user)

    except ValueError:
        return error_dict(gettext("Invalid Google token")), 400
