from typing import Any, Tuple

import requests
from flask import Blueprint, Response, json, jsonify, request, url_for
from flask_apispec import marshal_with
from flask_babel import gettext
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    jwt_required,
)
from werkzeug.security import check_password_hash, generate_password_hash

from app import oauth_client
from blueprints.auth.services import send_reset_password_email, validate_reset_password_token
from blueprints.user.models import AccountDataProvider, UserModel
from config.env_vars import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_DISCOVERY_URL
from run_services import user_service
from schemas.auth import (
    AccessTokenSchema,
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


def get_google_provider_cfg() -> Any:
    return requests.get(GOOGLE_DISCOVERY_URL).json()


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
    response_schemas=[(AccessTokenSchema, 200)],
    secure=False,  # add security other way
)
def refresh(user: UserModel) -> Tuple[Response, int] | Response:
    access_token = create_access_token_for_user(user)
    return jsonify({"access_token": access_token})


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


@auth_blueprint.route("/google", methods=["GET"])
def auth_with_google() -> Tuple[Response, int] | Response:
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    request_uri = oauth_client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=url_for("callback", _external=True),
        scope=["openid", "email", "profile"],
    )

    return jsonify(request_uri)


@auth_blueprint.route("/google/callback", methods=["GET"])
def callback_google() -> Tuple[Response, int] | Response:
    code = request.args.get("code")

    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    token_url, headers, body = oauth_client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=request.base_url,
        code=code,
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    oauth_client.parse_request_body_response(json.dumps(token_response.json()))

    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = oauth_client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    userinfo = userinfo_response.json()
    if not userinfo.get("email_verified"):
        return jsonify(
            error_dict(gettext("User email not available or not verified by Google")),
            400,
        )

    email = userinfo["email"]
    username = userinfo["given_name"]

    user = user_service.get_by_email(email)
    if user is None:
        user = UserModel(None, email, username, "", AccountDataProvider.GOOGLE, None)
        user_service.insert(user)
    elif user.provider != AccountDataProvider.GOOGLE:
        return jsonify(error_dict(gettext("Account already exists for another provider"))), 400

    return jsonify(create_tokens(user))
