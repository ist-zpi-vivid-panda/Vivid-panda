from marshmallow import Schema, fields
from marshmallow_enum import EnumField

from blueprints.user.models import AccountDataProvider
from schemas.generic import get_email_field


class UserModelSchema(Schema):
    id = fields.Str(required=True)
    email = get_email_field()
    username = fields.Str()
    provider = EnumField(AccountDataProvider, by_value=True)


class UserProfilePictureSchema(Schema):
    data = fields.Str()
