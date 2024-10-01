from flask import Flask, jsonify
from marshmallow import ValidationError
from webargs.flaskparser import parser

from utils.request_utils import validation_errors_dict


class ValidationConfig:
    def __new__(cls, app: Flask) -> None:
        @app.errorhandler(ValidationError)
        def handle_validation_error(err):
            return jsonify(validation_errors_dict(err.messages)), 400

        @parser.error_handler
        def handle_webargs_error(err, req, schema, *, error_status_code, error_headers):
            raise ValidationError(err.messages)
