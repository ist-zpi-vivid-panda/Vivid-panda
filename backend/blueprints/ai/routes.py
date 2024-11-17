from typing import Tuple

import requests
from flask import Blueprint, request
from werkzeug.datastructures import FileStorage

from ai_functions.ai_function_enum import AI_functions
from blueprints.user.models import UserModel
from config.env_vars import AI_MICROSERVICE_API_URL
from schemas.file import (
    AIMicroserviceSchema,
    FileOutputDataSchema,
)
from schemas.responses import ErrorSchema
from utils.request_utils import doc_endpoint, success_dict

ai_blueprint = Blueprint("ai", __name__)
tags = ["AI"]


@ai_blueprint.route("/<ai_function>", methods=["POST"])
@doc_endpoint(
    description="Call AI microservice to use its option",
    tags=tags,
    input_schema=AIMicroserviceSchema,
    response_schemas=[(FileOutputDataSchema, 200), (ErrorSchema, 400)],
    location="files",
)
def call_ai_function(
    user: UserModel,
    original_file: FileStorage,
    mask_file: FileStorage,
    ai_function: str | None,
) -> Tuple[dict, int] | dict:
    prompt: str | None = request.args.get("prompt", None, type=str)

    if ai_function is None:
        return success_dict(False), 404

    uppercase_ai_function: str = ai_function.upper()

    if uppercase_ai_function == AI_functions.COLORIZE_IMAGE.name:
        files = {"image": original_file}
        response = requests.post(f"{AI_MICROSERVICE_API_URL}{AI_functions.COLORIZE_IMAGE.value[0]}", files=files)
        if response.status_code == 200:
            return files
        else:
            return success_dict(True)

    if uppercase_ai_function == AI_functions.DELETE_OBJECT.name:
        files = {
            "image": original_file,
            "mask": mask_file,
        }
        response = requests.post(f"{AI_MICROSERVICE_API_URL}{AI_functions.DELETE_OBJECT.value[0]}", files=files)
        if response.status_code == 200:
            return files
        else:
            return success_dict(True)

    if uppercase_ai_function == AI_functions.ADD_OBJECT.name:
        files = {
            "image": original_file,
            "mask": mask_file,
        }
        data = {"prompt": prompt}
        response = requests.post(f"{AI_MICROSERVICE_API_URL}{AI_functions.ADD_OBJECT.value[0]}", files=files, data=data)
        if response.status_code == 200:
            return files
        else:
            return success_dict(True)

    if uppercase_ai_function == AI_functions.TRANSFER_STYLE.name:
        files = {
            "image": original_file,
        }
        data = {"style": prompt}
        response = requests.post(
            f"{AI_MICROSERVICE_API_URL}{AI_functions.TRANSFER_STYLE.value[0]}", files=files, data=data
        )
        if response.status_code == 200:
            return files
        else:
            return success_dict(True)

    if uppercase_ai_function == AI_functions.UPSCALE.name:
        files = {"image": original_file}
        response = requests.post(f"{AI_MICROSERVICE_API_URL}{AI_functions.UPSCALE.value[0]}", files=files)
        if response.status_code == 200:
            return files
        else:
            return success_dict(True)

    return success_dict(False), 404
