from flask_marshmallow import Schema
from marshmallow import fields, validate

# at least 8 characters, one uppercase, one lowercase, one digit
PASSWORD_REGEX = r"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class RegisterSchema(Schema):
    email = fields.Email(required=True)
    username = fields.Str()
    password = fields.Str(
        required=True,
        validate=[validate.Regexp(PASSWORD_REGEX)],
    )


class SendEmailRequestSchema(Schema):
    email = fields.Email(required=True)


class ResetPasswordSchema(Schema):
    password = fields.Str(
        required=True,
        validate=[validate.Regexp(PASSWORD_REGEX)],
    )
    password_repeated = fields.Str(
        required=True,
        validate=[validate.Regexp(PASSWORD_REGEX)],
    )
