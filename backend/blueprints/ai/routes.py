from io import BytesIO
from typing import Tuple

import requests
from flask import Blueprint, Response, request, send_file
from werkzeug.datastructures import FileStorage

from ai_functions.ai_function_enum import AiFunctions
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


def proxy_file(external_response: requests.Response) -> Response:
    file_stream = BytesIO(external_response.content)

    # Get the filename from the response headers or provide a default
    filename = external_response.headers.get("Content-Disposition", "attachment; filename=downloaded_file").split(
        "filename="
    )[-1]

    return send_file(
        file_stream,
        download_name=filename,
        mimetype=external_response.headers.get("Content-Type", "application/octet-stream"),
    )


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
    ai_function: str | None,
    mask_file: FileStorage | None = None,
) -> Tuple[dict, int] | dict | Response:
    prompt: str | None = request.args.get("prompt", None, type=str)

    if ai_function is None:
        return success_dict(False), 404

    response: requests.Response | None = None

    uppercase_ai_function: str = ai_function.upper()

    if uppercase_ai_function == AiFunctions.COLORIZE_IMAGE.name:
        files = {"image": original_file}
        response = requests.post(f"{AI_MICROSERVICE_API_URL}{AiFunctions.COLORIZE_IMAGE.value[0]}", files=files)

    elif uppercase_ai_function == AiFunctions.DELETE_OBJECT.name and mask_file is not None:
        files = {
            "image": original_file,
            "mask": mask_file,
        }
        response = requests.post(f"{AI_MICROSERVICE_API_URL}{AiFunctions.DELETE_OBJECT.value[0]}", files=files)

    elif uppercase_ai_function == AiFunctions.ADD_OBJECT.name and mask_file is not None:
        files = {
            "image": original_file,
            "mask": mask_file,
        }
        data = {"prompt": prompt}
        response = requests.post(f"{AI_MICROSERVICE_API_URL}{AiFunctions.ADD_OBJECT.value[0]}", files=files, data=data)

    elif uppercase_ai_function == AiFunctions.TRANSFER_STYLE.name:
        files = {
            "image": original_file,
        }
        data = {"style": prompt}
        response = requests.post(
            f"{AI_MICROSERVICE_API_URL}{AiFunctions.TRANSFER_STYLE.value[0]}", files=files, data=data
        )

    elif uppercase_ai_function == AiFunctions.UPSCALE.name:
        files = {"image": original_file}
        response = requests.post(f"{AI_MICROSERVICE_API_URL}{AiFunctions.UPSCALE.value[0]}", files=files)

    if response is not None and response.status_code == 200:
        return proxy_file(response)
    else:
        return success_dict(False), 404
