from typing import Tuple

from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from flask import Blueprint, Response, jsonify

from schemas.auth import LoginSchema, RegisterSchema, ResetPasswordSchema, SendEmailRequestSchema
from schemas.file import FileDataSchema, FileInfoSchema

validation_blueprint = Blueprint("validation", __name__)

spec = APISpec(
    title="Vivid-Panda API",
    version="1.0.0",
    openapi_version="3.0.0",
    plugins=[MarshmallowPlugin()],
)

# auth
spec.components.schema("LoginSchema", schema=LoginSchema)
spec.components.schema("RegisterSchema", schema=RegisterSchema)
spec.components.schema("SendEmailRequestSchema", schema=SendEmailRequestSchema)
spec.components.schema("ResetPasswordSchema", schema=ResetPasswordSchema)

# files
spec.components.schema("FileInfoSchema", schema=FileInfoSchema)
spec.components.schema("FileDataSchema", schema=FileDataSchema)


@validation_blueprint.route("/", methods=["GET"])
def get_validation_json_schema() -> Tuple[Response, int] | Response:
    return jsonify(spec.to_dict())
