from flask_marshmallow import Schema
from marshmallow import fields, validate
from marshmallow.fields import String

# at least 8 characters, one uppercase, one lowercase, one digit
PASSWORD_REGEX = r"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"

EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"


def get_password_field() -> String:
    return fields.Str(
        required=True,
        validate=[validate.Regexp(PASSWORD_REGEX)],
    )


# not using fields.Email due to the fact that Ajv and Marshmallow utilize different standards for its validation
def get_email_field() -> String:
    return fields.Str(
        required=True,
        validate=[validate.Regexp(EMAIL_REGEX)],
    )


class LoginSchema(Schema):
    email = get_email_field()
    password = fields.Str(required=True)


class RegisterSchema(Schema):
    email = get_email_field()
    username = fields.Str()
    password = get_password_field()


class SendEmailRequestSchema(Schema):
    email = get_email_field()


class ResetPasswordSchema(Schema):
    password = get_password_field()
    password_repeated = get_password_field()
