from typing import Any, Mapping

from pymongo.collection import Collection

from app import database
from blueprints.files.models import FileInfoModel
from service_utils import BaseCRUDService, Pagination

try:
    file_info_collection = database["file_info"]
    print("Collection 'users' created successfully")
except Exception as e:
    print(f"Error: {e}")


class FileInfoService(BaseCRUDService):
    def get_collection(self) -> Collection[Mapping[str, Any]]:
        return file_info_collection

    def get_by_identifier(self, file: FileInfoModel) -> FileInfoModel | None:
        return super().get_one_by({"_id": file.file_id})

    def map_from_db(self, data) -> FileInfoModel:
        return FileInfoModel(
            file_id=data["_id"],
            filename=data["filename"],
            mime_type=data["mime_type"],
            file_size=data["file_size"],
            uploaded_at=data["uploaded_at"],
            owner_id=data["owner_id"],
        )

    def get_paginated_by_owner_id(self, owner_id: str, page: int, per_page: int) -> Pagination:
        return super().get_all_by_paginated({"owner_id": owner_id}, page, per_page)
