import pytest
from flask_jwt_extended import create_access_token
from app import create_app
from blueprints.auth.routes import auth_blueprint
from blueprints.user.models import UserModel
from werkzeug.security import generate_password_hash
from unittest.mock import patch

app = create_app()

@pytest.fixture
def client():
    return app.test_client()

@pytest.fixture
def access_token():
    with app.app_context():
        return create_access_token(identity="test_user")

def test_register(client):
    with patch("run_services.user_service.insert") as mock_insert:
        mock_insert.return_value = "new_user_id"
        response = client.post("/auth/register", json={
            "email": "test@example.com",
            "username": "testuser",
            "password": "securepassword"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert "access_token" in data
        assert "refresh_token" in data

def test_login(client):
    with patch("run_services.user_service.get_by_email") as mock_get:
        mock_get.return_value = UserModel(
            None, "test@example.com", "testuser", generate_password_hash("securepassword"), "LOCAL", None
        )
        response = client.post("/auth/login", json={
            "email": "test@example.com",
            "password": "securepassword"
        })
        assert response.status_code == 200
        data = response.get_json()
        assert "access_token" in data
        assert "refresh_token" in data

def test_request_reset_password(client):
    with patch("run_services.user_service.get_by_email") as mock_get, \
         patch("blueprints.auth.services.send_reset_password_email") as mock_send_email:
        mock_get.return_value = UserModel(
            None, "test@example.com", "testuser", "hashedpassword", "LOCAL", None
        )
        response = client.post("/auth/request_reset_password", json={"email": "test@example.com"})
        assert response.status_code == 200
        mock_send_email.assert_called_once()

def test_reset_password(client):
    with patch("blueprints.auth.services.validate_reset_password_token") as mock_validate, \
         patch("run_services.user_service.update") as mock_update:
        mock_validate.return_value = UserModel(
            "user_id", "test@example.com", "testuser", "hashedpassword", "LOCAL", None
        )
        response = client.post("/auth/reset_password?token=valid_token&user_id=user_id", json={
            "password": "newpassword",
            "password_repeated": "newpassword"
        })
        assert response.status_code == 200
        mock_update.assert_called_once()
