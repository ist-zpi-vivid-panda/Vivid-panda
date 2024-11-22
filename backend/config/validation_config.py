from flask import Flask, jsonify
from flask_babel import gettext
from marshmallow import ValidationError
from webargs.flaskparser import parser

from utils.request_utils import error_dict


def create_validation_config(app: Flask) -> None:
    def translate_error_messages(messages):
        if isinstance(messages, dict):
            return {key: translate_error_messages(value) for key, value in messages.items()}

        if isinstance(messages, list):
            return [gettext(message) for message in messages]

        return messages

    @app.errorhandler(ValidationError)
    def handle_validation_error(error: ValidationError):
        translated_messages = translate_error_messages(error.messages)

        return jsonify(error_dict(translated_messages)), 400

    @parser.error_handler
    def handle_webargs_error(err, req, schema, *, error_status_code, error_headers):
        raise ValidationError(err.messages)
