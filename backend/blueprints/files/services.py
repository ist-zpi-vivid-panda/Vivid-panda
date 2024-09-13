from typing import Any, Mapping

from pymongo.collection import Collection
from werkzeug.datastructures.file_storage import FileStorage

from app import database, grid_fs
from blueprints.files.models import FileInfoModel
from utils.service_utils import BaseCRUDService, Pagination

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

    def get_id(self, file: FileInfoModel) -> str:
        return file.file_id

    def get_paginated_by_owner_id(self, owner_id: str, page: int, per_page: int) -> Pagination:
        return super().get_all_by_paginated({"owner_id": owner_id}, page, per_page)

    @staticmethod
    def put_file_on_grid_fs(file: FileStorage) -> str | None:
        return grid_fs.put(file, filename=file.filename, content_type=file.content_type)

    @staticmethod
    def delete_file_from_grid_fs(file_id: str):
        return grid_fs.delete(file_id)
