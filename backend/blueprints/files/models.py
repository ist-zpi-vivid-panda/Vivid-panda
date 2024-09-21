from datetime import datetime
from typing import Any, Dict

from bson import ObjectId

from utils.model_utils import BaseModel


class FileInfoModel(BaseModel):
    def __init__(
        self,
        file_id: str | None,
        filename: str,
        mime_type: str,
        file_size: int,
        uploaded_at: datetime,
        last_update_at: datetime,
        owner_id: str,
        grid_fs_id: str,
    ) -> None:
        self.file_id = file_id
        self.filename = filename
        self.mime_type = mime_type
        self.file_size = file_size
        self.uploaded_at = uploaded_at
        self.last_update_at = last_update_at
        self.owner_id = owner_id
        self.grid_fs_id = grid_fs_id

    def set_id(self, _id: str) -> None:
        self.file_id = _id

    def get_dict_repr(self) -> Dict[str, Any]:
        return {
            "_id": ObjectId(self.file_id),
            "filename": self.filename,
            "mime_type": self.mime_type,
            "file_size": self.file_size,
            "uploaded_at": self.uploaded_at,
            "last_update_at": self.last_update_at,
            "owner_id": ObjectId(self.owner_id),
            "grid_fs_id": ObjectId(self.grid_fs_id),
        }

    def get_dto(self) -> Dict[str, Any]:
        return {
            "id": self.file_id,
            "filename": self.filename,
            "mime_type": self.mime_type,
            "file_size": self.file_size,
            "uploaded_at": self.uploaded_at,
            "last_update_at": self.last_update_at,
            "owner_id": self.owner_id,
        }
