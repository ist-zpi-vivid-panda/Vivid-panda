from typing import Tuple

from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from flask import Blueprint, Response, jsonify

from schemas import LoginSchema, RegisterSchema, ResetPasswordSchema, SendEmailRequestSchema

validation_blueprint = Blueprint("validation", __name__)

spec = APISpec(
    title="Vivid-Panda API",
    version="1.0.0",
    openapi_version="3.0.0",
    plugins=[MarshmallowPlugin()],
)

spec.components.schema("LoginSchema", schema=LoginSchema)
spec.components.schema("RegisterSchema", schema=RegisterSchema)
spec.components.schema("SendEmailRequestSchema", schema=SendEmailRequestSchema)
spec.components.schema("ResetPasswordSchema", schema=ResetPasswordSchema)


@validation_blueprint.route("/", methods=["GET"])
def get_validation_json_schema() -> Tuple[Response, int] | Response:
    return jsonify(spec.to_dict())
