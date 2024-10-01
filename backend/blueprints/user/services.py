from typing import Any, Mapping

from pymongo.collection import Collection

from app import database
from blueprints.user.models import AccountDataProvider, UserModel
from utils.service_utils import BaseCRUDService

try:
    users_collection = database["users"]
except Exception as e:
    print(f"Error: {e}")


class UserService(BaseCRUDService):
    def get_collection(self) -> Collection[Mapping[str, Any]]:
        return users_collection

    def map_from_db(self, data) -> UserModel:
        return UserModel(
            uid=str(data["_id"]),
            email=data["email"].lower(),
            username=data["username"],
            password_hash=data["password_hash"],
            provider=AccountDataProvider(data["provider"]),
            profile_picture_grid_fs_id=str(data["profile_picture_grid_fs_id"])
            if data["profile_picture_grid_fs_id"]
            else None,
        )

    def get_id(self, user: UserModel) -> str:
        return user.uid

    def get_by_email(self, email: str) -> UserModel | None:
        return super().get_one_by({"email": email.lower()})
