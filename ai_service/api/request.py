from io import BytesIO
from typing import Any, Dict, List, Optional

from flask import Response, jsonify, request, send_file
from image_processing.invoker import Invoker
from PIL import Image


def check_image_shape(image: Image, request_type: str, min_size=10, max_size=10000) -> bool:
    upscaler_increase = 4
    if request_type == "upscaling":
        max_size = max_size / upscaler_increase
    return max_size > image.size[0] > min_size and max_size > image.size[1] > min_size


def process_image_request(
    request_type: str,
    required_files: List[str],
    required_form_fields: Optional[List[str]] = None,
) -> tuple[Response, int]:
    if required_form_fields is None:
        required_form_fields = []

    for file_key in required_files:
        if file_key not in request.files:
            return jsonify({"error": f"No {file_key} provided"}), 400

    for form_field in required_form_fields:
        if form_field not in request.form:
            return jsonify({"error": f"No {form_field} provided"}), 400

    invoker = Invoker()
    request_data: Dict[str, Any] = {"type": request_type, "params": {}}

    for file_key in required_files:
        file = request.files[file_key]
        request_data["params"][file_key] = Image.open(file)
        if not check_image_shape(request_data["params"][file_key], request_data["type"]):
            return jsonify({"error": f"Invalid {file_key} shape"}), 400

    for form_field in required_form_fields:
        request_data["params"][form_field] = request.form[form_field]

    processed_image = invoker.process_request(request_data)

    img_io = BytesIO()
    processed_image.save(img_io, format="JPEG")
    img_io.seek(0)

    return send_file(img_io, mimetype="image/jpeg"), 200
