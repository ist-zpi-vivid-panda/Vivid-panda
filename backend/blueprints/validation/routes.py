from apispec import APISpec
from apispec.ext.marshmallow import MarshmallowPlugin
from flask import Blueprint, jsonify

from schemas import LoginSchema, RegisterSchema

validation_blueprint = Blueprint("validation", __name__)

spec = APISpec(
    title="Vivid-Panda API",
    version="1.0.0",
    openapi_version="3.0.0",
    plugins=[MarshmallowPlugin()],
)

spec.components.schema("LoginSchema", schema=LoginSchema)
spec.components.schema("RegisterSchema", schema=RegisterSchema)


@validation_blueprint.route("/", methods=["GET"])
def get_validation_json_schema():
    return jsonify(spec.to_dict())
