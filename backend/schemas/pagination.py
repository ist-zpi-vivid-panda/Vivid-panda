from flask_babel import gettext
from marshmallow import Schema, fields


class BasePaginationSchema(Schema):
    collection = fields.List(
        fields.Raw(),
        required=True,
        error_messages={
            "required": gettext(u"Collection is required"),
            "invalid": gettext(u"Invalid format for collection"),
        },
    )
    page = fields.Int(
        required=True,
        error_messages={
            "required": gettext(u"Page number is required"),
            "invalid": gettext(u"Page number must be an integer"),
        },
    )
    total_pages = fields.Int(
        required=True,
        error_messages={
            "required": gettext(u"Total pages are required"),
            "invalid": gettext(u"Total pages must be an integer"),
        },
    )
    total_items = fields.Int(
        required=True,
        error_messages={
            "required": gettext(u"Total items count is required"),
            "invalid": gettext(u"Total items must be an integer"),
        },
    )
