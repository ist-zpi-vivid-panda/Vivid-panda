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
from blueprints.user.models import AccountDataProvider, UserModel
from env_vars import GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
from run_services import user_service
from schemas import LoginSchema, RegisterSchema
from utils import get_google_provider_cfg

# Short-lived tokens mean that we do not need a blocklist
# and the fact that we use JWT in headers means that there is no need for a logout endpoint.
# If the app was higher security we would simply implement a blocklist or use cookies with proper CORS policy.
auth_blueprint = Blueprint("auth", __name__)


def create_access_token_for_user(user: UserModel) -> str:
    return create_access_token(identity=user, fresh=True)


def create_tokens(user: UserModel) -> Response:
    access_token = create_access_token_for_user(user)
    refresh_token = create_refresh_token(identity=user)

    return jsonify({"access_token": access_token, "refresh_token": refresh_token})


@auth_blueprint.route("/register", methods=["POST"])
def register():
    register_schema = RegisterSchema()
    errors = register_schema.validate(request.json)
    if errors:
        return jsonify({"errors": errors}), 400

    email = request.json.get("email")
    username = request.json.get("username", None)
    # password is sent through HTTPS thus this is safe
    password = request.json.get("password")

    user = UserModel(
        None,
        email,
        username,
        generate_password_hash(password),
        AccountDataProvider.LOCAL,
    )
    result = user_service.insert(user)

    if result is None:
        return jsonify({"error": "Email already registered"}), 400

    return create_tokens(user)


@auth_blueprint.route("/login", methods=["POST"])
def login():
    login_schema = LoginSchema()
    errors = login_schema.validate(request.json)
    if errors:
        return jsonify({"errors": errors}), 400

    email = request.json["email"]
    password = request.json["password"]

    user = user_service.get_by_email(email)
    if user is None or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid username or password"}), 401

    if user.provider != AccountDataProvider.LOCAL:
        return jsonify({"error": "Account already exists for another provider"}), 400

    return create_tokens(user)


@auth_blueprint.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)  # only refresh tokens can access this
def refresh():
    user = get_jwt_identity()
    access_token = create_access_token_for_user(user)
    return jsonify(access_token)


@auth_blueprint.route("/google", methods=["GET"])
def auth_with_google():
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    request_uri = oauth_client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=url_for("callback", _external=True),
        scope=["openid", "email", "profile"],
    )

    return redirect(request_uri)


@auth_blueprint.route("/google/callback", methods=["GET"])
def callback_google():
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
            jsonify({"error": "User email not available or not verified by Google"}),
            400,
        )

    email = userinfo["email"]
    username = userinfo["given_name"]

    user = user_service.get_by_email(email)
    if user is None:
        user = UserModel(None, email, username, "", AccountDataProvider.GOOGLE)
        user_service.insert(user)
    elif user.provider != AccountDataProvider.GOOGLE:
        return jsonify({"error": "Account already exists for another provider"}), 400

    return create_tokens(user)
