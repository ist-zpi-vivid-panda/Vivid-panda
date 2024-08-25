from flask import Flask
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from oauthlib.oauth2 import WebApplicationClient

from custom_cors import register_cors
from database import Connection
from env_vars import (
    APP_SECRET,
    GOOGLE_CLIENT_ID,
    JWT_ACCESS_TOKEN_EXPIRES,
    JWT_SECRET_KEY,
    MONGO_DB_NAME,
    TEMPLATE_FOLDER,
)

marshmallow = Marshmallow()
jwt = JWTManager()
oauth_client = WebApplicationClient(GOOGLE_CLIENT_ID)
database = Connection(MONGO_DB_NAME)


def create_app() -> Flask:
    app = Flask(__name__, template_folder=TEMPLATE_FOLDER)

    app.secret_key = APP_SECRET
    app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = JWT_ACCESS_TOKEN_EXPIRES

    marshmallow.init_app(app)
    jwt.init_app(app)
    register_cors(app)

    from jwt_config import config_jwt

    config_jwt(jwt)

    from blueprints.core.routes import core_blueprint
    from blueprints.files.routes import files_blueprint
    from blueprints.auth.routes import auth_blueprint
    from blueprints.validation.routes import validation_blueprint
    from blueprints.user.routes import users_blueprint

    app.register_blueprint(core_blueprint, url_prefix="/core")
    app.register_blueprint(auth_blueprint, url_prefix="/auth")
    app.register_blueprint(validation_blueprint, url_prefix="/validation")
    app.register_blueprint(files_blueprint, url_prefix="/files")
    app.register_blueprint(users_blueprint, url_prefix="/users")

    return app
