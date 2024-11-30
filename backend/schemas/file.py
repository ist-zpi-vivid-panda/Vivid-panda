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
        validate=[validate_file_size, validate_mime_type],
        description=gettext(
            "File of type %(ext)s up to %(length)s B", ext=ALLOWED_EXTENSIONS_STR, length=MAX_CONTENT_LENGTH
        ),
        error_messages={"required": gettext("File is required")},
    )


def validate_file_size(file: FileStorage):
    if file.content_length > MAX_CONTENT_LENGTH:
        raise ValidationError(gettext("File size must not exceed %(length)s B", length=MAX_CONTENT_LENGTH))

# extension can be changed !
# def validate_file_extension(file: FileStorage):
#     if file.filename is None:
#         raise ValidationError(gettext("No file name detected"))
#
#     _, ext = os.path.splitext(file.filename)
#
#     if ext is None or ext.lower() not in ALLOWED_EXTENSIONS:
#         raise ValidationError(gettext("Invalid file extension. Only %(ext)s are allowed", ext=ALLOWED_EXTENSIONS_STR))


def validate_mime_type(file: FileStorage):
    if file.mimetype is None:
        raise ValidationError(gettext("No MIME type detected. Please upload a valid file"))

    if file.mimetype not in ALLOWED_MIME_TYPES:
        raise ValidationError(gettext("Invalid MIME type. Only %(formats)s are allowed", formats=ALLOWED_MIMETYPES_STR))


class FileInfoEditSchema(Schema):
    filename = fields.Str(
        required=True,
        error_messages={"required": gettext("Filename is required"), "invalid": gettext("Invalid filename format")},
    )


class FileInfoSchema(FileInfoEditSchema):
    id = fields.Str(
        required=True,
        error_messages={"required": gettext("File ID is required"), "invalid": gettext("Invalid file ID format")},
    )
    mime_type = fields.Str(
        required=True,
        error_messages={"required": gettext("MIME type is required"), "invalid": gettext("Invalid MIME type format")},
    )
    file_size = fields.Int(
        required=True,
        error_messages={
            "required": gettext("File size is required"),
            "invalid": gettext("File size must be an integer"),
        },
    )
    uploaded_at = fields.DateTime(
        required=True,
        error_messages={"required": gettext("Upload date is required"), "invalid": gettext("Invalid date format")},
    )
    last_update_at = fields.DateTime(
        required=True,
        error_messages={
            "required": gettext("Last update date is required"),
            "invalid": gettext("Invalid date format"),
        },
    )
    owner_id = fields.Str(
        required=True,
        error_messages={"required": gettext("Owner ID is required"), "invalid": gettext("Invalid owner ID format")},
    )
    thumbnail = fields.Str(error_messages={"invalid": gettext("Invalid thumbnail format")})


class FileInputDataSchema(Schema):
    file = get_file()


class FilePaginationSchema(BasePaginationSchema):
    collection = fields.List(
        fields.Nested(FileInfoSchema),
        required=True,
        error_messages={
            "required": gettext("File collection is required"),
            "invalid": gettext("Invalid format for file collection"),
        },
    )


class FileOutputDataSchema(Schema):
    file = fields.Str(
        required=True,
        error_messages={"required": gettext("File path is required"), "invalid": gettext("Invalid file path format")},
    )
    mime_type = fields.Str(
        required=True,
        error_messages={"required": gettext("MIME type is required"), "invalid": gettext("Invalid MIME type format")},
    )
    name = fields.Str(
        required=True,
        error_messages={"required": gettext("File name is required"), "invalid": gettext("Invalid file name format")},
    )


class AIMicroserviceSchema(Schema):
    original_file = get_file()
    mask_file = fields.Field(
        required=False,
        validate=[validate_file_size, validate_mime_type],
        description=gettext(
            "File of type %(ext)s up to %(length)s B", ext=ALLOWED_EXTENSIONS_STR, length=MAX_CONTENT_LENGTH
        ),
        error_messages={"invalid": gettext("Invalid mask file format")},
    )
