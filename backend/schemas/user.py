from flask_babel import gettext
from marshmallow import Schema, fields
from marshmallow_enum import EnumField

from blueprints.user.models import AccountDataProvider
from schemas.generic import get_email_field

PROVIDERS = ", ".join([provider.name for provider in AccountDataProvider])


class UserModelSchema(Schema):
    id = fields.Str(
        required=True,
        error_messages={"required": gettext("User ID is required"), "invalid": gettext("Invalid User ID format")},
    )
    email = get_email_field()
    username = fields.Str(error_messages={"invalid": gettext("Invalid username format")})
    provider = EnumField(
        AccountDataProvider,
        by_value=True,
        error_messages={
            "invalid": gettext(
                "Invalid provider. Accepted values are: %(provider)s",
                provider=PROVIDERS,
            )
        },
    )


class UserProfilePictureSchema(Schema):
    data = fields.Str(error_messages={"invalid": gettext("Invalid profile picture data format")})
