from io import BytesIO
from typing import Generator

import pytest
from api.routes import app
from flask.testing import FlaskClient
from PIL import Image


@pytest.fixture
def client() -> Generator[FlaskClient, None, None]:
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client


def create_test_image() -> BytesIO:
    img = Image.new("RGB", (100, 100), color="red")
    img_io = BytesIO()
    img.save(img_io, "PNG")
    img_io.seek(0)
    return img_io


def test_colorize_image(client: FlaskClient) -> None:
    img_io = create_test_image()
    data = {"image": (img_io, "test.jpg")}
    response = client.post(
        "/colorize_image", data=data, content_type="multipart/form-data"
    )
    assert response.status_code == 200
    assert response.content_type == "image/jpeg"


def test_object_deletion(client: FlaskClient) -> None:
    img_io = create_test_image()
    mask_io = create_test_image()
    data = {"image": (img_io, "test.jpg"), "mask": (mask_io, "mask.jpg")}
    response = client.post(
        "/delete_object", data=data, content_type="multipart/form-data"
    )
    assert response.status_code == 200
    assert response.content_type == "image/jpeg"


def test_object_addition(client: FlaskClient) -> None:
    img_io = create_test_image()
    mask_io = create_test_image()
    data = {
        "image": (img_io, "test.jpg"),
        "mask": (mask_io, "mask.jpg"),
        "prompt": "Add a tree",
    }
    response = client.post("/add_object", data=data, content_type="multipart/form-data")
    assert response.status_code == 200
    assert response.content_type == "image/jpeg"


def test_style_transfer(client: FlaskClient) -> None:
    img_io = create_test_image()
    data = {"image": (img_io, "test.jpg"), "style": "Van Gogh"}
    response = client.post(
        "/transfer_style", data=data, content_type="multipart/form-data"
    )
    assert response.status_code == 200
    assert response.content_type == "image/jpeg"


def test_upscale(client: FlaskClient) -> None:
    img_io = create_test_image()
    data = {"image": (img_io, "test.jpg")}
    response = client.post("/upscale", data=data, content_type="multipart/form-data")
    assert response.status_code == 200
    assert response.content_type == "image/jpeg"
