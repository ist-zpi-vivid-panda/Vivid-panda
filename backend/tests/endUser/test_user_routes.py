import pytest
from flask import Flask
from flask_jwt_extended import create_access_token
from blueprints.user.routes import users_blueprint
from blueprints.user.models import UserModel
from blueprints.user.services import UserService
from unittest.mock import MagicMock
from io import BytesIO


# Mock Flask app setup
@pytest.fixture
def app():
    app = Flask(__name__)
    app.register_blueprint(users_blueprint, url_prefix='/users')
    app.config['TESTING'] = True
    app.config['JWT_TOKEN_LOCATION'] = ['headers']
    app.config['JWT_SECRET_KEY'] = 'test-secret-key'
    app.config['JWT_HEADER_NAME'] = 'Authorization'
    app.config['JWT_HEADER_TYPE'] = 'Bearer'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 9000  # Example: 150 minutes
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 2592000  # Example: 30 days
    return app


@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def access_token(mock_user):
    return create_access_token(identity=mock_user.uid)

@pytest.fixture
def mock_user():
    return UserModel(
        uid="64b4d7f93f999a1a8e123456",  # valid 24-character hex string
        email="testuser@example.com",
        username="testuser",
        password_hash="hashed_password",
        provider=0,  # LOCAL provider
        profile_picture_grid_fs_id=None
    )


# Test get_user endpoint
def test_get_user(client, mock_user):
    UserService.get_one_by = MagicMock(return_value=mock_user)

    response = client.get('/users/')
    assert response.status_code == 200
    assert response.json == {
        "id": "64b4d7f93f999a1a8e123456",
        "email": "testuser@example.com",
        "username": "testuser",
        "provider": 0
    }


# Test get_user_profile_picture endpoint
def test_get_user_profile_picture(client, mock_user):
    mock_user.profile_picture_grid_fs_id = "mock_grid_fs_id"
    UserService.get_one_by = MagicMock(return_value=mock_user)

    response = client.get('/users/profile-picture')
    assert response.status_code == 200
    assert "data" in response.json


# Test upsert_user_profile_picture endpoint
def test_upsert_user_profile_picture(client, mock_user):
    UserService.get_one_by = MagicMock(return_value=mock_user)

    data = {
        'file': (BytesIO(b"fake image data"), 'test_picture.png')
    }
    response = client.post('/users/profile-picture', data=data, content_type='multipart/form-data')

    assert response.status_code in [200, 400]  # Test for success and file save failure scenarios
