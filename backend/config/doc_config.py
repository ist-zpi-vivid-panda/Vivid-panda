from apispec import APISpec
from flask import Flask
from flask_apispec import FlaskApiSpec

from config.env_vars import SWAGGER_UI_URL, SWAGGER_URL


def get_security() -> list:
    return [{"BearerAuth": []}]


def create_doc_config(app: Flask, api_spec: APISpec) -> FlaskApiSpec:
    app.config["APISPEC_SPEC"] = api_spec
    app.config["APISPEC_SWAGGER_URL"] = SWAGGER_URL
    app.config["APISPEC_SWAGGER_UI_URL"] = SWAGGER_UI_URL

    docs = FlaskApiSpec(app)
    docs.spec.components.security_scheme("BearerAuth", {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"})

    docs.register_existing_resources()

    return docs
