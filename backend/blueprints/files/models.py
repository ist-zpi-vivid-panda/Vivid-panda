from datetime import datetime
from typing import Any, Dict

from model_utils import BaseModel


class FileInfoModel(BaseModel):
    def __init__(
        self,
        file_id: str,
        filename: str,
        mime_type: str,
        file_size: int,
        uploaded_at: datetime,
        owner_id: str,
    ) -> None:
        self.file_id = file_id
        self.filename = filename
        self.mime_type = mime_type
        self.file_size = file_size
        self.uploaded_at = uploaded_at
        self.owner_id = owner_id

    def set_id(self, _id: str) -> None:
        self.file_id = _id

    def get_dict_repr(self) -> Dict[str, Any]:
        return {
            "filename": self.filename,
            "mime_type": self.mime_type,
            "file_size": self.file_size,
            "uploaded_at": self.uploaded_at,
            "owner_id": self.owner_id,
        }

    def get_accessible_by_user(self) -> Dict[str, Any]:
        return {
            "filename": self.filename,
            "mime_type": self.mime_type,
            "file_size": self.file_size,
            "uploaded_at": self.uploaded_at,
        }
