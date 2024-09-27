from marshmallow import Schema, fields


class BasePaginationSchema(Schema):
    collection = fields.List(fields.Raw(), required=True)
    page = fields.Int(required=True)
    total_pages = fields.Int(required=True)
    total_items = fields.Int(required=True)
