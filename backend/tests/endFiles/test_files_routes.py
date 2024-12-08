import pytest
from flask import Flask
from flask_jwt_extended import JWTManager, create_access_token
from unittest.mock import Mock
from datetime import datetime
from io import BytesIO

class MockUser:
    def __init__(self, uid):
        self.uid = uid

@pytest.fixture
def app():
    from blueprints.files.routes import files_blueprint
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "test-secret"
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]
    JWTManager(app)
    app.register_blueprint(files_blueprint, url_prefix="/files")
    app.testing = True
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_headers(app):
    with app.app_context():
        access_token = create_access_token(identity={"id": "test_user"})
    return {"Authorization": f"Bearer {access_token}"}

def test_get_files(client, auth_headers, mocker):
    mock_file_service = mocker.patch("blueprints.files.routes.file_service")
    mock_file_service.get_paginated_by_owner_id.return_value = Mock(
        collection=[],
        page=1,
        total_pages=0,
        total_items=0
    )
    response = client.get("/files/?page=1&per_page=10", headers=auth_headers)
    assert response.status_code == 200
    assert response.get_json()["collection"] == []

def test_post_file(client, auth_headers, mocker):
    mocker.patch("grid_fs_service.put_file_on_grid_fs", return_value="mock_grid_fs_id")
    mocker.patch("blueprints.files.services.count_user_files", return_value=0)
    mocker.patch("grid_fs_service.get_file_grid_fs", return_value=Mock(length=1024))
    mocker.patch("blueprints.files.routes.file_service.insert", return_value="mock_file_id")
    mocker.patch("grid_fs_service.add_thumbnail", return_value={"id": "mock_file_id"})

    data = {"file": (BytesIO(b"content"), "file.txt")}
    response = client.post("/files/", headers=auth_headers, data=data, content_type="multipart/form-data")
    assert response.status_code == 200
    assert response.get_json()["id"] == "mock_file_id"

def test_get_file(client, auth_headers, mocker):
    mock_file = Mock(owner_id="test_user")
    mock_file.get_dto.return_value = {"id": "mock_file_id", "filename": "file.txt"}
    mocker.patch("blueprints.files.routes.file_service.get_by_id", return_value=mock_file)

    response = client.get("/files/mock_file_id", headers=auth_headers)
    assert response.status_code == 200
    assert response.get_json()["id"] == "mock_file_id"

def test_delete_file(client, auth_headers, mocker):
    mock_file = Mock(owner_id="test_user", grid_fs_id="mock_id")
    mocker.patch("blueprints.files.routes.file_service.get_by_id", return_value=mock_file)
    mocker.patch("blueprints.files.routes.file_service.delete", return_value=True)
    mocker.patch("grid_fs_service.delete_file_from_grid_fs")

    response = client.delete("/files/mock_file_id", headers=auth_headers)
    assert response.status_code == 200
    assert response.get_json()["success"] is True

def test_get_file_data(client, auth_headers, mocker):
    mock_file = Mock(owner_id="test_user", grid_fs_id="mock_id")
    mocker.patch("blueprints.files.routes.file_service.get_by_id", return_value=mock_file)

    mock_file_grid = Mock()
    mock_file_grid.read.return_value = b"content"
    mock_file_grid.content_type = "text/plain"
    mock_file_grid.filename = "file.txt"
    mocker.patch("grid_fs_service.get_file_grid_fs", return_value=mock_file_grid)

    response = client.get("/files/data/download/mock_file_id", headers=auth_headers)
    assert response.status_code == 200
    assert response.data == b"content"
    assert response.headers["Content-Type"] == "text/plain"
