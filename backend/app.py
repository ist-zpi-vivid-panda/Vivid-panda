import gridfs
from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from flask import Flask
from flask_babel import Babel
from flask_mailman import Mail
from flask_marshmallow import Marshmallow
from oauthlib.oauth2 import WebApplicationClient

from config.babel_config import create_babel_config
from config.cors_config import create_cors_config
from config.database import create_db_connection
from config.doc_config import create_doc_config
from config.env_vars import (
    APP_SECRET,
    GOOGLE_CLIENT_ID,
    MAX_CONTENT_LENGTH,
    MONGO_DB_NAME,
    TEMPLATE_FOLDER,
)
from config.mail_config import MailConfig
from config.validation_config import create_validation_config

marshmallow = Marshmallow()
oauth_client = WebApplicationClient(GOOGLE_CLIENT_ID)
database = create_db_connection(MONGO_DB_NAME)
grid_fs = gridfs.GridFS(database)
mail = Mail()
babel = Babel(configure_jinja=False)
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

    from config.jwt_config import create_jwt_config

    create_babel_config(app, babel)
    create_cors_config(app)
    create_jwt_config(app)
    marshmallow.init_app(app)
    MailConfig(app, mail)

    from blueprints.ai.routes import ai_blueprint
    from blueprints.auth.routes import auth_blueprint
    from blueprints.files.routes import files_blueprint
    from blueprints.user.routes import users_blueprint

    app.register_blueprint(ai_blueprint, url_prefix="/ai")
    app.register_blueprint(auth_blueprint, url_prefix="/auth")
    # app.register_blueprint(core_blueprint, url_prefix="/core")
    app.register_blueprint(files_blueprint, url_prefix="/files")
    app.register_blueprint(users_blueprint, url_prefix="/users")

    # Swagger
    create_doc_config(app, api_spec)
    create_validation_config(app)

    return app
