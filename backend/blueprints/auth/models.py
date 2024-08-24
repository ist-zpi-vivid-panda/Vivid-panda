from enum import Enum
from typing import Any, Dict

from model_utils import BaseModel


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
    ) -> None:
        self.uid = uid
        self.email = email
        self.username = username
        self.password_hash = password_hash
        self.provider = provider

    def set_id(self, _id: str) -> None:
        self.uid = _id

    def get_repr_for_db(self) -> Dict[str, Any]:
        return {
            "email": self.email,
            "username": self.username,
            "password_hash": self.password_hash,
            "provider": self.provider.value,
        }
