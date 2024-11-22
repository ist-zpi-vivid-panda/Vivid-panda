import pytest
from datetime import datetime
from flask_jwt_extended import create_access_token
from bson import ObjectId
from app import create_app  # Используем create_app из вашего основного файла
from blueprints.files.services import FileInfoService
import mongomock

# Создаем приложение для тестов
app = create_app()

@pytest.fixture
def client():
    # Используем клиент Flask для тестирования эндпоинтов
    return app.test_client()

@pytest.fixture
def mock_db():
    return mongomock.MongoClient().db

@pytest.fixture
def file_info_service(mock_db):
    service = FileInfoService()
    service._collection = mock_db.file_info
    return service

@pytest.fixture
def access_token():
    with app.app_context():
        # Создаем тестовый токен внутри контекста приложения
        return create_access_token(identity="test_user")

def test_get_files(client, file_info_service, mock_db, access_token):
    # Используем токен в заголовках
    headers = {"Authorization": f"Bearer {access_token}"}

    # Вставляем тестовый документ в mock_db
    mock_db.file_info.insert_one({
        "_id": ObjectId("507f1f77bcf86cd799439015"),
        "filename": "test.txt",
        "mime_type": "text/plain",
        "file_size": 12345,
        "uploaded_at": datetime.now(),
        "last_update_at": datetime.now(),
        "owner_id": ObjectId("507f1f77bcf86cd799439012"),
        "grid_fs_id": ObjectId("507f1f77bcf86cd799439013"),
    })

    # Отправляем запрос с заголовками
    response = client.get('/files/', headers=headers)
    assert response.status_code == 200

    data = response.get_json()
    assert data is not None
