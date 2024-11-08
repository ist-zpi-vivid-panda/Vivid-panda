#Działa
import pytest
from app import create_app
from blueprints.user.models import UserModel, AccountDataProvider
from flask_jwt_extended import create_access_token
from unittest.mock import patch
from io import BytesIO

app = create_app()

@pytest.fixture
def client():
    return app.test_client()

@pytest.fixture
def access_token():
    with app.app_context():
        test_user = UserModel(
            uid="507f191e810c19729de860ea",
            email="test@example.com",
            username="testuser",
            password_hash="hashedpassword",
            provider=AccountDataProvider.LOCAL,
            profile_picture_grid_fs_id=None
        )
        return create_access_token(identity=test_user)
@pytest.fixture
def client():
    with app.app_context():
        yield app.test_client()

def test_get_user(client, access_token):
    headers = {"Authorization": f"Bearer {access_token}"}
    with patch("blueprints.user.models.UserModel.get_dto", return_value={"id": "test_id"}):
        response = client.get("/users/", headers=headers)
        assert response.status_code == 200
        data = response.get_json()
        assert data["id"] == "test_id"


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
