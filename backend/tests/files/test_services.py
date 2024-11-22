import pytest
from flask_jwt_extended import create_access_token
from blueprints.files.services import FileInfoService
from blueprints.files.models import FileInfoModel
from datetime import datetime
from bson import ObjectId
from app import create_app
import mongomock
from blueprints.user.models import UserModel, AccountDataProvider

# Создаем приложение
app = create_app()


@pytest.fixture
def mock_db():
    # Используем mongomock для эмуляции базы данных MongoDB
    return mongomock.MongoClient().db


@pytest.fixture
def file_info_service(mock_db):
    # Инициализируем FileInfoService с эмуляцией коллекции MongoDB
    service = FileInfoService()
    service._collection = mock_db.file_info
    return service


@pytest.fixture
def access_token():
    with app.app_context():
        # Создаем тестового пользователя с фиктивными данными
        test_user = UserModel(
            uid="507f191e810c19729de860ea",
            email="test@example.com",
            username="testuser",
            password_hash="hashedpassword",
            provider=AccountDataProvider.LOCAL,
            profile_picture_grid_fs_id=None
        )
        # Вывод для отладки
        print("Generated test user identity:", test_user)

        # Создаем токен доступа с объектом UserModel
        return create_access_token(identity=test_user)


@pytest.fixture
def client():
    # Возвращаем тестовый клиент для взаимодействия с API
    return app.test_client()


@pytest.fixture
def sample_file():
    # Возвращаем пример файла для тестирования
    return FileInfoModel(
        filename="sample.txt",
        mime_type="text/plain",
        file_size=1234,
        uploaded_at=datetime.now(),
        last_update_at=datetime.now(),
        owner_id=ObjectId("507f1f77bcf86cd799439011"),
        grid_fs_id=ObjectId("507f1f77bcf86cd799439012")
    )


def test_get_files(client, access_token):
    # Тест получения списка файлов
    headers = {"Authorization": f"Bearer {access_token}"}
    response = client.get("/files/", headers=headers)
    assert response.status_code == 200


def test_map_from_db(file_info_service, sample_file):
    # Тест маппинга данных из базы данных в модель FileInfoModel
    inserted_id = file_info_service._collection.insert_one(sample_file.get_dict_repr()).inserted_id
    file_from_db = file_info_service.map_from_db(
        file_info_service._collection.find_one({"_id": inserted_id})
    )
    assert file_from_db.filename == sample_file.filename


def test_get_id(sample_file):
    # Тест получения идентификатора файла
    assert sample_file.file_id is None
    sample_file.file_id = "507f1f77bcf86cd799439014"
    assert sample_file.file_id == "507f1f77bcf86cd799439014"
