from marshmallow import Schema, fields


class ErrorSchema(Schema):
    error = fields.Str(required=True)


class ValidationErrorSchema(Schema):
    validation_errors = fields.Dict(fields.Str(), fields.List(fields.Str()), required=True)


class SuccessSchema(Schema):
    success = fields.Bool(required=True)
