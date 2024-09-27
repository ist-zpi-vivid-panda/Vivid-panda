import gridfs
from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from flask import Flask
from flask_mailman import Mail
from flask_marshmallow import Marshmallow
from oauthlib.oauth2 import WebApplicationClient

from config.cors_config import CorsConfig
from config.database import Connection
from config.doc_config import DocConfig
from config.env_vars import (
    APP_SECRET,
    GOOGLE_CLIENT_ID,
    MAX_CONTENT_LENGTH,
    MONGO_DB_NAME,
    TEMPLATE_FOLDER,
)
from config.mail_config import MailConfig

marshmallow = Marshmallow()
oauth_client = WebApplicationClient(GOOGLE_CLIENT_ID)
database = Connection(MONGO_DB_NAME)
grid_fs = gridfs.GridFS(database)
mail = Mail()
api_spec = APISpec(
    title="Vivid-Panda API",
    version="1.0.0",
    openapi_version="3.0.0",
    plugins=[MarshmallowPlugin()],
)


def create_app() -> Flask:
    app = Flask(__name__, template_folder=TEMPLATE_FOLDER)

    app.secret_key = APP_SECRET

    app.config["MAX_CONTENT_LENGTH"] = MAX_CONTENT_LENGTH

    app.url_map.strict_slashes = False

    from config.jwt_config import JWTConfig

    CorsConfig(app)
    JWTConfig(app)
    marshmallow.init_app(app)
    MailConfig(app, mail)

    from blueprints.auth.routes import auth_blueprint
    from blueprints.core.routes import core_blueprint
    from blueprints.files.routes import files_blueprint
    from blueprints.user.routes import users_blueprint

    app.register_blueprint(core_blueprint, url_prefix="/core")
    app.register_blueprint(auth_blueprint, url_prefix="/auth")
    app.register_blueprint(files_blueprint, url_prefix="/files")
    app.register_blueprint(users_blueprint, url_prefix="/users")

    # Swagger
    DocConfig(app, api_spec)

    return app
