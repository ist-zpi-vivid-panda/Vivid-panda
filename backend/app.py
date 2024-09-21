import gridfs
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mailman import Mail
from flask_marshmallow import Marshmallow
from oauthlib.oauth2 import WebApplicationClient

from config.database import Connection
from config.env_vars import (
    APP_SECRET,
    FRONTEND_URL,
    GOOGLE_CLIENT_ID,
    JWT_ACCESS_TOKEN_EXPIRES,
    JWT_SECRET_KEY,
    MAIL_DEFAULT_SENDER,
    MAIL_PASSWORD,
    MAIL_PORT,
    MAIL_SERVER,
    MAIL_USE_SSL,
    MAIL_USE_TLS,
    MAIL_USERNAME,
    MAX_CONTENT_LENGTH,
    MONGO_DB_NAME,
    TEMPLATE_FOLDER,
)

marshmallow = Marshmallow()
jwt = JWTManager()
oauth_client = WebApplicationClient(GOOGLE_CLIENT_ID)
database = Connection(MONGO_DB_NAME)
grid_fs = gridfs.GridFS(database)
mail = Mail()


def create_app() -> Flask:
    app = Flask(__name__, template_folder=TEMPLATE_FOLDER)

    app.secret_key = APP_SECRET

    app.config["JWT_SECRET_KEY"] = JWT_SECRET_KEY
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = JWT_ACCESS_TOKEN_EXPIRES

    app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH

    app.config["MAIL_SERVER"] = MAIL_SERVER
    app.config["MAIL_PORT"] = MAIL_PORT
    app.config["MAIL_USE_TLS"] = MAIL_USE_TLS
    app.config["MAIL_USE_SSL"] = MAIL_USE_SSL
    app.config["MAIL_USERNAME"] = MAIL_USERNAME
    app.config["MAIL_PASSWORD"] = MAIL_PASSWORD
    app.config["MAIL_DEFAULT_SENDER"] = MAIL_DEFAULT_SENDER

    app.url_map.strict_slashes = False

    CORS(
        app,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        supports_credentials=True,
        origins=FRONTEND_URL,
        allow_headers=["Content-Type", "Authorization"],
    )
    marshmallow.init_app(app)
    jwt.init_app(app)
    # register_cors(app)
    mail.init_app(app)

    from config.jwt_config import config_jwt

    config_jwt(jwt)

    from blueprints.auth.routes import auth_blueprint
    from blueprints.core.routes import core_blueprint
    from blueprints.files.routes import files_blueprint
    from blueprints.user.routes import users_blueprint
    from blueprints.validation.routes import validation_blueprint

    app.register_blueprint(core_blueprint, url_prefix="/core")
    app.register_blueprint(auth_blueprint, url_prefix="/auth")
    app.register_blueprint(validation_blueprint, url_prefix="/validation")
    app.register_blueprint(files_blueprint, url_prefix="/files")
    app.register_blueprint(users_blueprint, url_prefix="/users")

    return app
