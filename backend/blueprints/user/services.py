from typing import Any, Mapping

from pymongo.collection import Collection

from app import database
from blueprints.user.models import AccountDataProvider, UserModel
from service_utils import BaseCRUDService

try:
    users_collection = database["users"]
    print("Collection 'users' created successfully")
except Exception as e:
    print(f"Error: {e}")


class UserService(BaseCRUDService):
    def get_collection(self) -> Collection[Mapping[str, Any]]:
        return users_collection

    def get_by_identifier(self, user: UserModel) -> UserModel | None:
        return self.get_by_email(user.email)

    def map_from_db(self, data) -> UserModel:
        return UserModel(
            uid=str(data["_id"]),
            email=data["email"],
            username=data["username"],
            password_hash=data["password_hash"],
            provider=AccountDataProvider(data["provider"]),
        )

    def get_by_email(self, email: str) -> UserModel | None:
        return super().get_one_by({"email": email})
