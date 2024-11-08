#działa
import pytest
from bson import ObjectId
from blueprints.user.models import UserModel, AccountDataProvider

@pytest.fixture
def user():
    return UserModel(
        uid="507f191e810c19729de860ea",
        email="test@example.com",
        username="testuser",
        password_hash="hashedpassword",
        provider=AccountDataProvider.LOCAL,
        profile_picture_grid_fs_id="507f191e810c19729de860eb"
    )

def test_get_dict_repr(user):
    dict_repr = user.get_dict_repr()
    assert dict_repr["_id"] == ObjectId("507f191e810c19729de860ea")
    assert dict_repr["email"] == "test@example.com"
    assert dict_repr["username"] == "testuser"
    assert dict_repr["provider"] == AccountDataProvider.LOCAL.value

def test_get_dto(user):
    dto = user.get_dto()
    assert dto["id"] == "507f191e810c19729de860ea"
    assert dto["email"] == "test@example.com"
    assert dto["username"] == "testuser"
    assert dto["provider"] == AccountDataProvider.LOCAL.value

def test_generate_reset_password_token(user):
    token = user.generate_reset_password_token()
    assert isinstance(token, str)
    assert len(token) > 0
