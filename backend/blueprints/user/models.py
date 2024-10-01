from enum import Enum
from typing import Any, Dict

from bson import ObjectId
from itsdangerous import URLSafeTimedSerializer

from config import env_vars
from utils.model_utils import BaseModel


class AccountDataProvider(Enum):
    LOCAL = 0
    GOOGLE = 1


class UserModel(BaseModel):
    def __init__(
        self,
        uid: str | None,
        email: str,
        username: str,
        password_hash: str,
        provider: AccountDataProvider,
        profile_picture_grid_fs_id: str | None,
    ) -> None:
        self.uid = uid
        self.email = email.lower()
        self.username = username
        self.password_hash = password_hash
        self.provider = provider
        self.profile_picture_grid_fs_id = profile_picture_grid_fs_id

    def get_dict_repr(self) -> Dict[str, Any]:
        return {
            "_id": ObjectId(self.uid),
            "email": self.email,
            "username": self.username,
            "provider": self.provider.value,
            "password_hash": self.password_hash,
            "profile_picture_grid_fs_id": ObjectId(self.profile_picture_grid_fs_id)
            if self.profile_picture_grid_fs_id is not None
            else None,
        }

    def get_dto(self) -> Dict[str, Any]:
        return {
            "id": self.uid,
            "email": self.email,
            "username": self.username,
            "provider": self.provider.value,
        }

    def generate_reset_password_token(self):
        serializer = URLSafeTimedSerializer(env_vars.APP_SECRET)

        return serializer.dumps(self.uid, salt=self.password_hash)
