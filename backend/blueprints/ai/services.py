from typing import Dict

import requests
from flask_babel import gettext
from marshmallow import ValidationError
from PIL import Image
from werkzeug.datastructures import FileStorage

from config.env_vars import AI_MICROSERVICE_API_KEY, AI_MICROSERVICE_API_URL
from utils.ai_functions_utils import AiFunction, StyleTransfer
from utils.enum_utils import is_valid_enum_value

_MIN_IMAGE_SIZE = 10

_MAX_IMAGE_SIZE = 10_000
_MAX_IMAGE_SIZE_UP_SCALING = 2_500


def _is_valid_image(file_storage: FileStorage, max_size, min_size) -> bool:
    try:
        with Image.open(file_storage) as img:
            width, height = img.size
            file_storage.seek(0)

            return min_size < width < max_size and min_size < height < max_size

    except (Exception,):
        return False  # Return False if the file is not a valid image


def _validate_image(
    image: FileStorage, ai_func: AiFunction, max_size=_MAX_IMAGE_SIZE, min_size=_MIN_IMAGE_SIZE
) -> None:
    if not _is_valid_image(image, max_size, min_size):
        raise ValidationError(
            gettext(
                "Image size for %(ai_func)s must be between %(min_size)s and %(max_size)s pixels",
                ai_func=ai_func.value,
                min_size=min_size,
                max_size=max_size,
            )
        )


def _make_request(
    ai_func: AiFunction,
    files: Dict[str, FileStorage],
    data: Dict[str, str] | None = None,
) -> requests.Response:
    headers = {"Authorization": f"Bearer {AI_MICROSERVICE_API_KEY}"}

    return requests.post(f"{AI_MICROSERVICE_API_URL}{ai_func.value}", headers=headers, files=files, data=data)


def handle_colorize_image(original_file: FileStorage) -> requests.Response | None:
    ai_func = AiFunction.COLORIZE_IMAGE

    _validate_image(original_file, ai_func)

    files = {"image": original_file}

    return _make_request(ai_func, files=files)


def handle_delete_object(original_file: FileStorage, mask_file: FileStorage | None) -> requests.Response | None:
    if not mask_file:
        return None

    ai_func = AiFunction.DELETE_OBJECT

    _validate_image(original_file, ai_func)

    files = {"image": original_file, "mask": mask_file}

    return _make_request(ai_func, files=files)


def handle_add_object(
    original_file: FileStorage, mask_file: FileStorage | None, prompt: str | None
) -> requests.Response | None:
    if not mask_file or not prompt:
        return None

    ai_func = AiFunction.ADD_OBJECT

    _validate_image(original_file, ai_func)
    _validate_image(mask_file, ai_func)

    files = {"image": original_file, "mask": mask_file}
    data = {"prompt": prompt}

    return _make_request(AiFunction.ADD_OBJECT, files=files, data=data)


def handle_transfer_style(original_file: FileStorage, prompt: str | None) -> requests.Response | None:
    if not prompt or not is_valid_enum_value(StyleTransfer, prompt):
        return None

    ai_func = AiFunction.TRANSFER_STYLE

    _validate_image(original_file, ai_func)

    files = {"image": original_file}
    data = {"style": prompt}

    return _make_request(AiFunction.TRANSFER_STYLE, files=files, data=data)


def handle_upscale(original_file: FileStorage) -> requests.Response | None:
    files = {"image": original_file}

    ai_func = AiFunction.UPSCALE

    _validate_image(original_file, ai_func, max_size=_MAX_IMAGE_SIZE_UP_SCALING)

    return _make_request(AiFunction.UPSCALE, files=files)
