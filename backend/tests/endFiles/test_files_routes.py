from unittest.mock import patch
from io import BytesIO
import pytest
from flask_jwt_extended import create_access_token
from app import create_app
from blueprints.user.models import UserModel, AccountDataProvider
from blueprints.files.models import FileInfoModel
from datetime import datetime
from bson import ObjectId

app = create_app()

@pytest.fixture
def access_token():
    with app.app_context():
        test_user = UserModel(
            uid="507f1f77bcf86cd799439012",  # Используем тот же идентификатор, что и владелец файла
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

def test_get_file(client, access_token):
    headers = {"Authorization": f"Bearer {access_token}"}
    with patch("run_services.file_service.get_by_id") as mock_get_file:
        mock_get_file.return_value = FileInfoModel(
            file_id=ObjectId("507f1f77bcf86cd799439011"),
            filename="test.png",
            mime_type="image/png",
            file_size=12345,
            uploaded_at=datetime.now(),
            last_update_at=datetime.now(),
            owner_id=ObjectId("507f1f77bcf86cd799439012"),  # Совпадает с `uid` из access_token
            grid_fs_id=ObjectId("507f1f77bcf86cd799439013")
        )

        response = client.get("/files/507f1f77bcf86cd799439011", headers=headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}. Response data: {response.get_data(as_text=True)}"

def test_post_file(client, access_token):
    headers = {"Authorization": f"Bearer {access_token}"}
    with patch("grid_fs_service.put_file_on_grid_fs", return_value=ObjectId("507f1f77bcf86cd799439013")), \
         patch("run_services.file_service.insert", return_value="new_file_id"):
        data = {
            "file": (BytesIO(b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89"), "test.png")
        }
        response = client.post("/files/", headers=headers, data=data, content_type="multipart/form-data")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}. Response data: {response.get_data(as_text=True)}"

def test_update_file(client, access_token):
    headers = {"Authorization": f"Bearer {access_token}"}
    with patch("run_services.file_service.get_by_id") as mock_get_file, \
         patch("run_services.file_service.update") as mock_update:
        mock_get_file.return_value = FileInfoModel(
            file_id=ObjectId("507f1f77bcf86cd799439011"),
            filename="old_name.png",
            mime_type="image/png",
            file_size=12345,
            uploaded_at=datetime.now(),
            last_update_at=datetime.now(),
            owner_id=ObjectId("507f1f77bcf86cd799439012"),  # Совпадает с `uid` из access_token
            grid_fs_id=ObjectId("507f1f77bcf86cd799439013")
        )
        mock_update.return_value = "507f1f77bcf86cd799439011"

        response = client.patch("/files/507f1f77bcf86cd799439011", headers=headers, json={"filename": "new_name.png"})
        assert response.status_code == 200, f"Expected 200, got {response.status_code}. Response data: {response.get_data(as_text=True)}"

def test_delete_file(client, access_token):
    headers = {"Authorization": f"Bearer {access_token}"}
    with patch("run_services.file_service.get_by_id") as mock_get_file, \
         patch("run_services.file_service.delete") as mock_delete, \
         patch("grid_fs_service.delete_file_from_grid_fs") as mock_delete_file:
        mock_get_file.return_value = FileInfoModel(
            file_id=ObjectId("507f1f77bcf86cd799439011"),
            filename="test.png",
            mime_type="image/png",
            file_size=12345,
            uploaded_at=datetime.now(),
            last_update_at=datetime.now(),
            owner_id=ObjectId("507f1f77bcf86cd799439012"),  # Совпадает с `uid` из access_token
            grid_fs_id=ObjectId("507f1f77bcf86cd799439013")
        )
        mock_delete.return_value = True

        response = client.delete("/files/507f1f77bcf86cd799439011", headers=headers)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}. Response data: {response.get_data(as_text=True)}"
