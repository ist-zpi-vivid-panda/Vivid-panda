import os

from marshmallow import Schema, ValidationError, fields
from werkzeug.datastructures import FileStorage

from config.env_vars import MAX_CONTENT_LENGTH

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def validate_file_size(file: FileStorage):
    if file.content_length > MAX_CONTENT_LENGTH:
        raise ValidationError(f"File size must not exceed ${MAX_CONTENT_LENGTH}B.")


def validate_file_extension(file: FileStorage):
    _, ext = os.path.splitext(file.filename)

    if ext.lower() not in ALLOWED_EXTENSIONS:
        raise ValidationError(f"Invalid file extension. Only ${ALLOWED_EXTENSIONS} are allowed.")


class FileInfoSchema(Schema):
    filename = fields.Str(required=True)


class FileDataSchema(Schema):
    file = fields.Field(required=True, validate=[validate_file_size, validate_file_extension])
