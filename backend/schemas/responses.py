from flask_babel import gettext
from marshmallow import Schema, fields


class ErrorSchema(Schema):
    error = fields.Str(
        required=True,
        error_messages={
            "required": gettext(u"Error message is required"),
            "invalid": gettext(u"Invalid error message format"),
        },
    )


class ValidationErrorSchema(Schema):
    validation_errors = fields.Dict(
        fields.Str(),
        fields.List(fields.Str()),
        required=True,
        error_messages={
            "required": gettext(u"Validation errors are required"),
            "invalid": gettext(u"Invalid format for validation errors"),
        },
    )


class SuccessSchema(Schema):
    success = fields.Bool(
        required=True,
        error_messages={
            "required": gettext(u"Success status is required"),
            "invalid": gettext(u"Success status must be a boolean value"),
        },
    )
