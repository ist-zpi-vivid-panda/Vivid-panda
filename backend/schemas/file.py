import os

from marshmallow import Schema, ValidationError, fields
from werkzeug.datastructures import FileStorage

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}


def validate_file_size(file: FileStorage):
    if file.content_length > MAX_FILE_SIZE:
        raise ValidationError("File size must not exceed 10MB.")


def validate_file_extension(file: FileStorage):
    _, ext = os.path.splitext(file.filename)
    print(ext)
    if ext.lower() not in ALLOWED_EXTENSIONS:
        raise ValidationError(f"Invalid file extension. Only ${ALLOWED_EXTENSIONS} are allowed.")


class FileInfoSchema(Schema):
    filename = fields.Str(required=True)


class FileDataSchema(Schema):
    file = fields.Field(required=True, validate=[validate_file_size, validate_file_extension])
