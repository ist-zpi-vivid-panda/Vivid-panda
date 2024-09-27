import os

from marshmallow import Schema, ValidationError, fields
from werkzeug.datastructures import FileStorage

from config.env_vars import MAX_CONTENT_LENGTH
from schemas.pagination import BasePaginationSchema

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def validate_file_size(file: FileStorage):
    if file.content_length > MAX_CONTENT_LENGTH:
        raise ValidationError(f"File size must not exceed ${MAX_CONTENT_LENGTH}B.")


def validate_file_extension(file: FileStorage):
    _, ext = os.path.splitext(file.filename)

    if ext.lower() not in ALLOWED_EXTENSIONS:
        raise ValidationError(f"Invalid file extension. Only ${ALLOWED_EXTENSIONS} are allowed.")


class FileInfoEditSchema(Schema):
    filename = fields.Str(required=True)


class FileInfoSchema(FileInfoEditSchema):
    id = fields.Str(required=True)
    mime_type = fields.Str(required=True)
    file_size = fields.Int(required=True)
    uploaded_at = fields.DateTime(required=True)
    last_update_at = fields.DateTime(required=True)
    owner_id = fields.Str(required=True)
    thumbnail = fields.Str()


class FileDataSchema(Schema):
    file = fields.Field(required=True, validate=[validate_file_size, validate_file_extension])


class FilePaginationSchema(BasePaginationSchema):
    collection = fields.List(fields.Nested(FileInfoSchema), required=True)
