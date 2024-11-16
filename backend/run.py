import os

from flask import send_from_directory
from flask_babel import force_locale, gettext

from app import api_spec, create_app
from config.env_vars import APP_HOST, APP_PORT, DEBUG
from utils.request_utils import USED_SCHEMAS

app = create_app()


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, "static"), "favicon.ico", mimetype="image/vnd.microsoft.icon"
    )


def get_translations_for_field(field, locales):
    translations = {}
    for locale in locales:
        with force_locale(locale):
            translations[locale] = {key: gettext(message) for key, message in field.error_messages.items()}
    return translations


def enhance_schemas_with_translations():
    locales = app.config["BABEL_SUPPORTED_LOCALES"]

    for schema_name, schema in api_spec.components.schemas.items():
        if "properties" not in schema:
            break

        for field_name, field_props in schema["properties"].items():
            for marshmallow_schema in USED_SCHEMAS:
                if not marshmallow_schema:
                    break

                field = marshmallow_schema.declared_fields.get(field_name)

                if field and hasattr(field, "error_messages"):
                    field_props["errorMessages"] = get_translations_for_field(field, locales)


with app.app_context():
    enhance_schemas_with_translations()

if __name__ == "__main__":
    app.run(host=APP_HOST, port=APP_PORT, debug=DEBUG)
