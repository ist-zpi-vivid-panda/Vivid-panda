from flask_babel import gettext
from marshmallow import fields, validate
from marshmallow.fields import String

# at least 8 characters, one uppercase, one lowercase, one digit
PASSWORD_REGEX = r"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$"

EMAIL_REGEX = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"


def get_password_field() -> String:
    return fields.Str(
        required=True,
        validate=[
            validate.Regexp(
                PASSWORD_REGEX,
                error=gettext(
                    "Password must be at least 8 characters long, "
                    "with at least one uppercase letter, "
                    "one lowercase letter, and one digit"
                ),
            )
        ],
        error_messages={
            "required": gettext("Password is required"),
            "pattern": gettext(
                "Password must be at least 8 characters long, "
                "with at least one uppercase letter, "
                "one lowercase letter, and one digit"
            ),
        },
    )


# not using fields.Email due to the fact that Ajv and Marshmallow utilize different standards for its validation
def get_email_field() -> String:
    return fields.Str(
        required=True,
        validate=[validate.Regexp(EMAIL_REGEX, error=gettext("Invalid email address format"))],
        error_messages={
            "required": gettext("Email is required"),
            "pattern": gettext("Invalid email address format"),
        },
    )
