from flask_marshmallow import Schema
from marshmallow import fields, validate

password_regex = r"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class RegisterSchema(Schema):
    email = fields.Email(required=True)
    username = fields.Str()
    password = fields.Str(
        required=True,
        # at least 8 characters, one uppercase, one lowercase, one digit
        validate=[validate.Regexp(password_regex)],
    )


class FileUploadSchema(Schema):
    file = fields.Raw(type="file")
    owner_id = fields.Str(required=True)


class SendEmailRequestSchema(Schema):
    email = fields.Email(required=True)


class ResetPasswordSchema(Schema):
    password = fields.Str(
        required=True,
        # at least 8 characters, one uppercase, one lowercase, one digit
        validate=[validate.Regexp(password_regex)],
    )
    password_repeated = fields.Str(
        required=True,
        # at least 8 characters, one uppercase, one lowercase, one digit
        validate=[validate.Regexp(password_regex)],
    )
