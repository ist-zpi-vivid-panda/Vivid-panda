from typing import Any, Tuple

import requests
from flask import Blueprint, Response, json, jsonify, redirect, request, url_for
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
    jwt_required,
)
from werkzeug.security import check_password_hash, generate_password_hash

from app import oauth_client
from blueprints.auth.services import send_reset_password_email, validate_reset_password_token
from blueprints.user.models import AccountDataProvider, UserModel
from config.env_vars import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_DISCOVERY_URL
from run_services import user_service
from schemas.auth import LoginSchema, RegisterSchema, ResetPasswordSchema, SendEmailRequestSchema
from utils.request_utils import error_dict, validation_errors_dict

# Short-lived tokens mean that we do not need a blocklist
# and the fact that we use JWT in headers means that there is no need for a logout endpoint.
# If the app was higher security we would simply implement a blocklist or use cookies with proper CORS policy.
auth_blueprint = Blueprint("auth", __name__)


def get_google_provider_cfg() -> Any:
    return requests.get(GOOGLE_DISCOVERY_URL).json()


def create_access_token_for_user(user: UserModel) -> str:
    return create_access_token(identity=user, fresh=True)


def create_tokens(user: UserModel) -> Response:
    access_token = create_access_token_for_user(user)
    refresh_token = create_refresh_token(identity=user)

    return jsonify({"access_token": access_token, "refresh_token": refresh_token})


@auth_blueprint.route("/register", methods=["POST"])
def register() -> Tuple[Response, int] | Response:
    register_schema = RegisterSchema()
    errors = register_schema.validate(request.json)
    if errors:
        return jsonify(validation_errors_dict(errors)), 400

    email: str = request.json.get("email")
    username: str = request.json.get("username", None)
    # password is sent through HTTPS thus this is safe
    password: str = request.json.get("password")

    user = UserModel(None, email, username, generate_password_hash(password), AccountDataProvider.LOCAL, None)
    result = user_service.insert(user)

    if result is None:
        return jsonify(error_dict("Email already registered")), 400

    return create_tokens(user)


@auth_blueprint.route("/login", methods=["POST"])
def login() -> Tuple[Response, int] | Response:
    login_schema = LoginSchema()
    errors = login_schema.validate(request.json)
    if errors:
        return jsonify(validation_errors_dict(errors)), 400

    email = request.json["email"]
    password = request.json["password"]

    user = user_service.get_by_email(email)
    if user is None or not check_password_hash(user.password_hash, password):
        return jsonify(error_dict("Invalid username or password")), 401

    if user.provider != AccountDataProvider.LOCAL:
        return jsonify(error_dict("Account already exists for another provider")), 400

    return create_tokens(user)


@auth_blueprint.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)  # only refresh tokens can access this
def refresh() -> Tuple[Response, int] | Response:
    user: UserModel | None = get_jwt_identity()
    if user is None:
        return jsonify(success=False), 401

    access_token = create_access_token_for_user(user)
    return jsonify(access_token)


@auth_blueprint.route("/request_reset_password", methods=["POST"])
def request_reset_password() -> Tuple[Response, int] | Response:
    send_email_password_schema = SendEmailRequestSchema()
    errors = send_email_password_schema.validate(request.json)
    if errors:
        return jsonify(validation_errors_dict(errors)), 400

    email = request.json.get("email")

    user = user_service.get_by_email(email)

    if user is None:
        return jsonify(error_dict("User does not exists")), 400

    if user.provider != AccountDataProvider.LOCAL:
        return jsonify(error_dict("Cannot reset password for this account provider")), 400

    send_reset_password_email(user)

    return jsonify(success=True)


@auth_blueprint.route("/reset_password", methods=["POST"])
def reset_password() -> Tuple[Response, int] | Response:
    token = request.args.get("token")
    user_id = request.args.get("user_id")

    if (user := validate_reset_password_token(token, user_id)) is None:
        return jsonify(error_dict("Token expired")), 400

    reset_password_schema = ResetPasswordSchema()
    errors = reset_password_schema.validate(request.json)
    if errors:
        return jsonify(validation_errors_dict(errors)), 400

    password = request.json["password"]
    password_repeated = request.json["password_repeated"]

    if not password == password_repeated:
        return jsonify(error_dict("Passwords are not the same")), 400

    if user is None or check_password_hash(user.password_hash, password):
        return jsonify(error_dict("Passwords cannot be the same as previous password")), 400

    user.password_hash = generate_password_hash(password)
    user_service.update(user)

    return jsonify(success=True)


@auth_blueprint.route("/google", methods=["GET"])
def auth_with_google() -> Tuple[Response, int] | Response:
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    request_uri = oauth_client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=url_for("callback", _external=True),
        scope=["openid", "email", "profile"],
    )

    return redirect(request_uri)


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
        return (
            jsonify(error_dict("User email not available or not verified by Google")),
            400,
        )

    email = userinfo["email"]
    username = userinfo["given_name"]

    user = user_service.get_by_email(email)
    if user is None:
        user = UserModel(None, email, username, "", AccountDataProvider.GOOGLE, None)
        user_service.insert(user)
    elif user.provider != AccountDataProvider.GOOGLE:
        return jsonify(error_dict("Account already exists for another provider")), 400

    return create_tokens(user)
