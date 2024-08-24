from flask_marshmallow import Schema
from marshmallow import fields, validate


class LoginSchema(Schema):
    email = fields.Email(required=True)
    password = fields.Str(required=True)


class RegisterSchema(Schema):
    email = fields.Email(required=True)
    username = fields.Str()
    password = fields.Str(
        required=True,
        # at least 8 characters, one uppercase, one lowercase, one digit
        validate=[validate.Regexp(r"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$")],
    )


class FileUploadSchema(Schema):
    file = fields.Raw(type="file")
    owner_id = fields.Str(required=True)
