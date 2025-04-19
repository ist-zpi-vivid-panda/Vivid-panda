from io import BytesIO

import pytest
from app import create_app
from flask_jwt_extended import create_access_token
from unittest.mock import patch

app = create_app()


@pytest.fixture
def client():
    return app.test_client()


@pytest.fixture
def access_token():
    with app.app_context():
        return create_access_token(identity="test_user")


def test_get_user(client, access_token):
    headers = {"Authorization": f"Bearer {access_token}"}
    with patch("blueprints.user.models.UserModel.get_dto", return_value={"id": "test_id"}):
        response = client.get("/users/", headers=headers)
        assert response.status_code == 200
        data = response.get_json()
        assert data["id"] == "test_id"


def test_get_user_profile_picture(client, access_token):
    headers = {"Authorization": f"Bearer {access_token}"}
    with patch("grid_fs_service.get_file_grid_fs", return_value="test_image_data"):
        response = client.get("/users/profile-picture", headers=headers)
        assert response.status_code == 200
        data = response.get_json()
        assert data["data"] == "test_image_data"


def test_upsert_user_profile_picture(client, access_token):
    headers = {"Authorization": f"Bearer {access_token}"}
    with patch("grid_fs_service.put_file_on_grid_fs", return_value="new_file_id"):
        response = client.post(
            "/users/profile-picture",
            headers=headers,
            data={"file": (BytesIO(b"fake image data"), "test.png")},
            content_type="multipart/form-data"
        )
        assert response.status_code == 200
        data = response.get_json()
        assert data["success"] is True
