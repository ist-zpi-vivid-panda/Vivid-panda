from apispec import APISpec
from flask import Flask
from flask_apispec import FlaskApiSpec

from config.env_vars import SWAGGER_UI_URL, SWAGGER_URL
from schemas.auth import LoginSchema, RegisterSchema, ResetPasswordSchema, SendEmailRequestSchema
from schemas.file import FileDataSchema, FileInfoEditSchema


def get_security() -> list:
    return [{"BearerAuth": []}]


class DocConfig:
    def __new__(cls, app: Flask, api_spec: APISpec) -> FlaskApiSpec:
        app.config["APISPEC_SPEC"] = api_spec
        app.config["APISPEC_SWAGGER_URL"] = SWAGGER_URL
        app.config["APISPEC_SWAGGER_UI_URL"] = SWAGGER_UI_URL

        # TEMPORARY
        # auth
        api_spec.components.schema("LoginSchema", schema=LoginSchema)
        api_spec.components.schema("RegisterSchema", schema=RegisterSchema)
        api_spec.components.schema("SendEmailRequestSchema", schema=SendEmailRequestSchema)
        api_spec.components.schema("ResetPasswordSchema", schema=ResetPasswordSchema)

        # files
        api_spec.components.schema("FileInfoEditSchema", schema=FileInfoEditSchema)
        api_spec.components.schema("FileDataSchema", schema=FileDataSchema)

        docs = FlaskApiSpec(app)
        docs.spec.components.security_scheme("BearerAuth", {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"})

        docs.register_existing_resources()

        return docs
