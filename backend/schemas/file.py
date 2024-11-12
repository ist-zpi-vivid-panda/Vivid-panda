import os

from marshmallow import Schema, ValidationError, fields
from werkzeug.datastructures import FileStorage

from config.env_vars import MAX_CONTENT_LENGTH
from schemas.pagination import BasePaginationSchema

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}

ALLOWED_MIME_TYPES = {"image/jpeg", "image/png"}


def get_file():
    return fields.Field(
        required=True,
        validate=[validate_file_size, validate_file_extension, validate_mime_type],
        description=f"File of type {ALLOWED_EXTENSIONS} up to {MAX_CONTENT_LENGTH}B",
    )


def validate_file_size(file: FileStorage):
    if file.content_length > MAX_CONTENT_LENGTH:
        raise ValidationError(f"File size must not exceed ${MAX_CONTENT_LENGTH}B.")


def validate_file_extension(file: FileStorage):
    if file.filename is None:
        return ""

    _, ext = os.path.splitext(file.filename)

    if ext is None or ext.lower() not in ALLOWED_EXTENSIONS:
        raise ValidationError(f"Invalid file extension. Only ${','.join(ALLOWED_EXTENSIONS)} are allowed.")


def validate_mime_type(file: FileStorage):
    if file.mimetype is None:
        raise ValidationError("No MIME type detected. Please upload a valid file.")

    if file.mimetype not in ALLOWED_MIME_TYPES:
        raise ValidationError(
            f"Invalid MIME type. Only {', '.join(ALLOWED_MIME_TYPES)} are allowed."
        )


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


class FileInputDataSchema(Schema):
    file = get_file()


class FilePaginationSchema(BasePaginationSchema):
    collection = fields.List(fields.Nested(FileInfoSchema), required=True)


class FileOutputDataSchema(Schema):
    file = fields.Str(
        required=True,
    )
    mime_type = fields.Str(
        required=True,
    )
    name = fields.Str(
        required=True,
    )


class AIMicroserviceSchema(Schema):
    original_file = get_file()
    mask_file = fields.Field(
        required=False,
        validate=[validate_file_size, validate_file_extension, validate_mime_type],
        description=f"File of type {ALLOWED_EXTENSIONS} up to {MAX_CONTENT_LENGTH}B",
    )

