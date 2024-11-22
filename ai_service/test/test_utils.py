# test/unit/test_utils.py
from io import BytesIO
from typing import Generator

import pytest
from api.request import process_image_request
from flask import Flask, Response
from flask.testing import FlaskClient
from PIL import Image

app = Flask(__name__)


@pytest.fixture
def client() -> Generator[FlaskClient, None, None]:
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def create_test_image() -> BytesIO:
    img = Image.new("RGB", (100, 100), color="red")
    img_io = BytesIO()
    img.save(img_io, "JPEG")
    img_io.seek(0)
    return img_io


def test_process_image_request_missing_file(client: FlaskClient) -> None:
    @app.route("/test_missing_file", methods=["POST"])
    def test_missing_file() -> tuple[Response, int]:
        return process_image_request("colorize", ["image"])

    response = client.post(
        "/test_missing_file", data={}, content_type="multipart/form-data"
    )
    assert response.status_code == 400
    assert response.json == {"error": "No image provided"}


def test_process_image_request_missing_form_field(client: FlaskClient) -> None:
    @app.route("/test_missing_form_field", methods=["POST"])
    def test_missing_form_field() -> tuple[Response, int]:
        return process_image_request("add_object", ["image", "mask"], ["prompt"])

    img_io = create_test_image()
    data = {"image": (img_io, "test.jpg"), "mask": (img_io, "mask.jpg")}
    response = client.post(
        "/test_missing_form_field", data=data, content_type="multipart/form-data"
    )
    assert response.status_code == 400
    assert response.json == {"error": "No prompt provided"}


def test_process_image_request_success(client: FlaskClient) -> None:
    @app.route("/test_success", methods=["POST"])
    def test_success() -> tuple[Response, int]:
        return process_image_request("colorize_image", ["image"])

    img_io = create_test_image()
    data = {"image": (img_io, "test.jpg")}
    response = client.post(
        "/test_success", data=data, content_type="multipart/form-data"
    )
    assert response.status_code == 200
    assert response.content_type == "image/jpeg"
