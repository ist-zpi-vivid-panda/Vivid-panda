import requests
from werkzeug.datastructures import FileStorage

from config.env_vars import AI_MICROSERVICE_API_URL
from utils.ai_functions_utils import AiFunctions, StyleTransfer
from utils.enum_utils import is_valid_enum_value


def handle_colorize_image(original_file: FileStorage) -> requests.Response | None:
    files = {"image": original_file}
    return requests.post(f"{AI_MICROSERVICE_API_URL}{AiFunctions.COLORIZE_IMAGE.value}", files=files)


def handle_delete_object(original_file: FileStorage, mask_file: FileStorage | None) -> requests.Response | None:
    if mask_file:
        files = {"image": original_file, "mask": mask_file}
        return requests.post(f"{AI_MICROSERVICE_API_URL}{AiFunctions.DELETE_OBJECT.value}", files=files)
    return None


def handle_add_object(
    original_file: FileStorage, mask_file: FileStorage | None, prompt: str | None
) -> requests.Response | None:
    if mask_file and prompt:
        files = {"image": original_file, "mask": mask_file}
        data = {"prompt": prompt}
        return requests.post(f"{AI_MICROSERVICE_API_URL}{AiFunctions.ADD_OBJECT.value}", files=files, data=data)

    return None


def handle_transfer_style(original_file: FileStorage, prompt: str | None) -> requests.Response | None:
    if prompt and is_valid_enum_value(StyleTransfer, prompt):
        files = {"image": original_file}
        data = {"style": prompt}
        return requests.post(f"{AI_MICROSERVICE_API_URL}{AiFunctions.TRANSFER_STYLE.value}", files=files, data=data)
    return None


def handle_upscale(original_file: FileStorage) -> requests.Response | None:
    files = {"image": original_file}
    return requests.post(f"{AI_MICROSERVICE_API_URL}{AiFunctions.UPSCALE.value}", files=files)
