import os

from flask_babel import gettext
from marshmallow import Schema, ValidationError, fields
from werkzeug.datastructures import FileStorage

from config.env_vars import MAX_CONTENT_LENGTH
from schemas.pagination import BasePaginationSchema

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png"}

ALLOWED_EXTENSIONS_STR = ",".join(ALLOWED_EXTENSIONS)
ALLOWED_MIMETYPES_STR = ",".join(ALLOWED_MIME_TYPES)


def get_file():
    return fields.Field(
        required=True,
        validate=[validate_file_size, validate_file_extension, validate_mime_type],
        description=gettext(
            "File of type %(ext)s up to %(length)s B", ext=ALLOWED_EXTENSIONS_STR, length=MAX_CONTENT_LENGTH
        ),
        error_messages={"required": gettext(u"File is required")},
    )


def validate_file_size(file: FileStorage):
    if file.content_length > MAX_CONTENT_LENGTH:
        raise ValidationError(gettext(u"File size must not exceed %(length)s B", length=MAX_CONTENT_LENGTH))


def validate_file_extension(file: FileStorage):
    if file.filename is None:
        raise ValidationError(gettext(u"No file name detected"))

    _, ext = os.path.splitext(file.filename)

    if ext is None or ext.lower() not in ALLOWED_EXTENSIONS:
        raise ValidationError(gettext(u"Invalid file extension. Only %(ext)s are allowed", ext=ALLOWED_EXTENSIONS_STR))


def validate_mime_type(file: FileStorage):
    if file.mimetype is None:
        raise ValidationError(gettext(u"No MIME type detected. Please upload a valid file"))

    if file.mimetype not in ALLOWED_MIME_TYPES:
        raise ValidationError(
            gettext(u"Invalid MIME type. Only %(formats)s are allowed", formats=ALLOWED_MIMETYPES_STR)
        )


class FileInfoEditSchema(Schema):
    filename = fields.Str(
        required=True,
        error_messages={"required": gettext(u"Filename is required"), "invalid": gettext(u"Invalid filename format")},
    )


class FileInfoSchema(FileInfoEditSchema):
    id = fields.Str(
        required=True,
        error_messages={"required": gettext(u"File ID is required"), "invalid": gettext(u"Invalid file ID format")},
    )
    mime_type = fields.Str(
        required=True,
        error_messages={"required": gettext(u"MIME type is required"), "invalid": gettext(u"Invalid MIME type format")},
    )
    file_size = fields.Int(
        required=True,
        error_messages={
            "required": gettext(u"File size is required"),
            "invalid": gettext(u"File size must be an integer"),
        },
    )
    uploaded_at = fields.DateTime(
        required=True,
        error_messages={"required": gettext(u"Upload date is required"), "invalid": gettext(u"Invalid date format")},
    )
    last_update_at = fields.DateTime(
        required=True,
        error_messages={
            "required": gettext(u"Last update date is required"),
            "invalid": gettext(u"Invalid date format"),
        },
    )
    owner_id = fields.Str(
        required=True,
        error_messages={"required": gettext(u"Owner ID is required"), "invalid": gettext(u"Invalid owner ID format")},
    )
    thumbnail = fields.Str(error_messages={"invalid": gettext(u"Invalid thumbnail format")})


class FileInputDataSchema(Schema):
    file = get_file()


class FilePaginationSchema(BasePaginationSchema):
    collection = fields.List(
        fields.Nested(FileInfoSchema),
        required=True,
        error_messages={
            "required": gettext(u"File collection is required"),
            "invalid": gettext(u"Invalid format for file collection"),
        },
    )


class FileOutputDataSchema(Schema):
    file = fields.Str(
        required=True,
        error_messages={"required": gettext(u"File path is required"), "invalid": gettext(u"Invalid file path format")},
    )
    mime_type = fields.Str(
        required=True,
        error_messages={"required": gettext(u"MIME type is required"), "invalid": gettext(u"Invalid MIME type format")},
    )
    name = fields.Str(
        required=True,
        error_messages={"required": gettext(u"File name is required"), "invalid": gettext(u"Invalid file name format")},
    )


class AIMicroserviceSchema(Schema):
    original_file = get_file()
    mask_file = fields.Field(
        required=False,
        validate=[validate_file_size, validate_file_extension, validate_mime_type],
        description=gettext(
            "File of type %(ext)s up to %(length)s B", ext=ALLOWED_EXTENSIONS_STR, length=MAX_CONTENT_LENGTH
        ),
        error_messages={"invalid": gettext(u"Invalid mask file format")},
    )
