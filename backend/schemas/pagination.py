from flask_babel import gettext
from marshmallow import Schema, fields


class BasePaginationSchema(Schema):
    collection = fields.List(
        fields.Raw(),
        required=True,
        error_messages={
            "required": gettext("Collection is required"),
            "invalid": gettext("Invalid format for collection"),
        },
    )
    page = fields.Int(
        required=True,
        error_messages={
            "required": gettext("Page number is required"),
            "invalid": gettext("Page number must be an integer"),
        },
    )
    total_pages = fields.Int(
        required=True,
        error_messages={
            "required": gettext("Total pages are required"),
            "invalid": gettext("Total pages must be an integer"),
        },
    )
    total_items = fields.Int(
        required=True,
        error_messages={
            "required": gettext("Total items count is required"),
            "invalid": gettext("Total items must be an integer"),
        },
    )
