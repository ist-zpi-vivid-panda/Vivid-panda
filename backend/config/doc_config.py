from typing import List

from apispec import APISpec
from flask import Flask
from flask_apispec import FlaskApiSpec
from flask_babel import force_locale, gettext
from marshmallow import Schema

from config.env_vars import SWAGGER_UI_URL, SWAGGER_URL
from schemas.file import FileInfoSchema

# add schemas that are not directly included as an input but for example are nested
# the ones that are used in endpoints will be added automatically
USED_SCHEMAS: List[Schema] = [FileInfoSchema()]


def get_security() -> list:
    return [{"BearerAuth": []}]


def get_translations_for_field(field, locales):
    translations = {}

    for locale in locales:
        with force_locale(locale):
            translations[locale] = {key: gettext(message) for key, message in field.error_messages.items()}

    return translations


def enhance_schemas_with_translations(app: Flask, api_spec: APISpec):
    locales = app.config["BABEL_SUPPORTED_LOCALES"]

    for schema_name, schema in api_spec.components.schemas.items():
        if "properties" not in schema:
            continue

        for field_name, field_props in schema["properties"].items():
            for marshmallow_schema in USED_SCHEMAS:
                full_schema_name = marshmallow_schema.__class__.__name__

                # realise that schemas that are not input schemas
                # (i.e. most of them that aren't automatically added)
                # don't need their field errors mapped
                if not marshmallow_schema or full_schema_name != schema_name + "Schema":
                    continue

                field = marshmallow_schema.declared_fields.get(field_name)

                if field and hasattr(field, "error_messages"):
                    field_props["errorMessage"] = get_translations_for_field(field, locales)


def create_doc_config(app: Flask, api_spec: APISpec) -> FlaskApiSpec:
    app.config["APISPEC_SPEC"] = api_spec
    app.config["APISPEC_SWAGGER_URL"] = SWAGGER_URL
    app.config["APISPEC_SWAGGER_UI_URL"] = SWAGGER_UI_URL

    docs = FlaskApiSpec(app)
    docs.spec.components.security_scheme("BearerAuth", {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"})

    docs.register_existing_resources()

    with app.app_context():
        enhance_schemas_with_translations(app, api_spec)

    return docs
