from typing import Any, Mapping

from bson.objectid import ObjectId
from pymongo.collection import Collection

from app import database
from blueprints.files.models import FileInfoModel
from grid_fs_service import add_thumbnail
from utils.service_utils import BaseCRUDService, Pagination

try:
    file_info_collection = database["file_info"]
    file_info_collection.create_index(["owner_id", 1])

except Exception as e:
    print(f"Error: {e}")


class FileInfoService(BaseCRUDService):
    def get_collection(self) -> Collection[Mapping[str, Any]]:
        return file_info_collection

    def map_from_db(self, data) -> FileInfoModel:
        return FileInfoModel(
            file_id=str(data["_id"]),
            filename=data["filename"],
            mime_type=data["mime_type"],
            file_size=data["file_size"],
            uploaded_at=data["uploaded_at"],
            owner_id=str(data["owner_id"]),
            last_update_at=data["last_update_at"],
            grid_fs_id=str(data["grid_fs_id"]),
        )

    def get_id(self, file: FileInfoModel) -> str:
        return file.file_id

    def get_paginated_by_owner_id(self, owner_id: str, page: int, per_page: int) -> Pagination:
        resulting_page = super().get_all_by_paginated({"owner_id": ObjectId(owner_id)}, page, per_page)

        resulting_page.collection = [
            add_thumbnail(obj_dict=file.get_dto(), grid_fs_id=file.grid_fs_id) for file in resulting_page.collection
        ]

        return resulting_page
