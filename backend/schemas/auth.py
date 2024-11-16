from flask_babel import gettext
from flask_marshmallow import Schema
from marshmallow import fields

from schemas.generic import get_email_field, get_password_field


class LoginSchema(Schema):
    email = get_email_field()
    password = fields.Str(required=True, error_messages={"required": gettext(u"Password is required")})


class RegisterSchema(Schema):
    email = get_email_field()
    username = fields.Str(required=False, missing=None, error_messages={"required": gettext(u"Username is required")})
    password = get_password_field()


class SendEmailRequestSchema(Schema):
    email = get_email_field()


class ResetPasswordSchema(Schema):
    password = get_password_field()
    password_repeated = get_password_field()


class AccessTokenSchema(Schema):
    access_token = fields.Str(required=True, error_messages={"required": gettext(u"Access token is required")})


class TokensSchema(AccessTokenSchema):
    refresh_token = fields.Str(required=True, error_messages={"required": gettext(u"Refresh token is required")})
