from flask import Flask, jsonify
from flask_babel import gettext
from marshmallow import ValidationError
from webargs.flaskparser import parser


def create_validation_config(app: Flask) -> None:
    def translate_errors(errors):
        return {field: [gettext(message) for message in messages] for field, messages in errors.items()}

    @app.errorhandler(ValidationError)
    def handle_validation_error(err: ValidationError):
        translated_errors = translate_errors(err.messages)
        return jsonify(translated_errors), 400

    @parser.error_handler
    def handle_webargs_error(err, req, schema, *, error_status_code, error_headers):
        raise ValidationError(err.messages)
