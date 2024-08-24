from flask import Blueprint, jsonify
from marshmallow_jsonschema import JSONSchema

from schemas import LoginSchema, RegisterSchema

validation = Blueprint("validation", __name__)

json_schema = JSONSchema()

validation_json_schema = {
    "openapi": "3.0.0",
    "info": {
        "title": "Vivid Panda API",
        "version": "0.0.1",
    },
    "paths": {},
    "components": {
        "schemas": {
            "LoginSchema": json_schema.dump(LoginSchema()),
            "RegisterSchema": json_schema.dump(RegisterSchema()),
        },
    },
}


@validation.route("/", methods=["GET"])
def get_validation_json_schema():
    return jsonify(validation_json_schema)
