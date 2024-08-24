from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_marshmallow import Marshmallow
from oauthlib.oauth2 import WebApplicationClient

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

    CORS(app)

    app.secret_key = APP_SECRET
    app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = JWT_ACCESS_TOKEN_EXPIRES

    marshmallow.init_app(app)
    jwt.init_app(app)

    from blueprints.core.routes import core

    app.register_blueprint(core, url_prefix="/")

    from blueprints.auth.routes import auth

    app.register_blueprint(auth, url_prefix="/auth")

    from blueprints.validation.routes import validation

    app.register_blueprint(validation, url_prefix="/validation")

    from blueprints.files.routes import files

    app.register_blueprint(files, url_prefix="/files")

    return app
