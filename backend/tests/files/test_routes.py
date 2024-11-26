import pytest
from flask_jwt_extended import create_access_token
from app import create_app
import mongomock

# Мок-класс для имитации пользователя
class MockUser:
    def __init__(self, uid="507f1f77bcf86cd799439012", email="test_user@example.com"):
        self.uid = uid
        self.email = email

@pytest.fixture
def app_with_test_config():
    app = create_app()
    app.config["JWT_SECRET_KEY"] = "test_jwt_secret"
    app.config["TESTING"] = True
    return app

@pytest.fixture
def client(app_with_test_config):
    return app_with_test_config.test_client()

@pytest.fixture
def mock_db():
    return mongomock.MongoClient().db

@pytest.fixture
def access_token(app_with_test_config):
    with app_with_test_config.app_context():
        user = MockUser()
        return create_access_token(identity=user)

@pytest.fixture
def mock_user():
    return MockUser()

def test_get_files(client, mock_db, access_token, mock_user):
    # Эмуляция вставки данных в mock MongoDB
    mock_db.file_info.insert_one({
        "_id": "507f1f77bcf86cd799439015",
        "filename": "test.txt",
        "mime_type": "text/plain",
        "file_size": 12345,
        "uploaded_at": "2023-01-01T00:00:00",
        "last_update_at": "2023-01-01T00:00:00",
        "owner_id": mock_user.uid,
        "grid_fs_id": "507f1f77bcf86cd799439013",
    })

    # Отправка GET-запроса к маршруту
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.get('/files/', headers=headers)

    # Проверка статуса и данных
    assert response.status_code == 200
    data = response.get_json()
    assert data is not None
