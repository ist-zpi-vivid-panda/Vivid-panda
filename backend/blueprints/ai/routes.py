from io import BytesIO
from typing import Tuple

import requests
from flask import Blueprint, Response, request, send_file
from werkzeug.datastructures import FileStorage

from blueprints.ai.services import (
    handle_add_object,
    handle_colorize_image,
    handle_delete_object,
    handle_transfer_style,
    handle_upscale,
)
from blueprints.user.models import UserModel
from schemas.file import (
    AIMicroserviceSchema,
    FileOutputDataSchema,
)
from schemas.responses import ErrorSchema
from utils.ai_functions_utils import AiFunction
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
    ai_function: str | None = None,
    mask_file: FileStorage | None = None,
) -> Tuple[dict, int] | dict | Response:
    prompt = request.args.get("prompt", None, type=str)

    if not ai_function:
        return success_dict(False), 404

    ai_function_handlers = {
        AiFunction.COLORIZE_IMAGE.name: lambda: handle_colorize_image(original_file),
        AiFunction.DELETE_OBJECT.name: lambda: handle_delete_object(original_file, mask_file),
        AiFunction.ADD_OBJECT.name: lambda: handle_add_object(original_file, mask_file, prompt),
        AiFunction.TRANSFER_STYLE.name: lambda: handle_transfer_style(original_file, prompt),
        AiFunction.UPSCALE.name: lambda: handle_upscale(original_file),
    }

    ai_function_upper = ai_function.upper()
    response: requests.Response | None = None

    if ai_function_upper in ai_function_handlers:
        response = ai_function_handlers[ai_function_upper]()

    if response and response.status_code == 200:
        return proxy_file(response)

    return success_dict(False), 404
