from abc import ABC, abstractmethod
from typing import Any, Dict, List, Mapping, TypeVar

from bson import ObjectId
from pymongo.collection import Collection

from model_utils import BaseModel
from utils import SingletonMeta

T = TypeVar("T", bound=BaseModel)


class Pagination:
    def __init__(
        self,
        collection: List[T],
        page: int,
        total_pages: int,
        total_items: int,
    ) -> None:
        self.collection = collection
        self.page = page
        self.per_page = len(collection)
        self.total_pages = total_pages
        self.total_items = total_items


class BaseCRUDService(ABC):
    __metaclass__ = SingletonMeta

    @abstractmethod
    def get_collection(self) -> Collection[Mapping[str, Any]]:
        pass

    @abstractmethod
    def get_by_identifier(self, data: T) -> T | None:
        pass

    @abstractmethod
    def map_from_db(self, data) -> T:
        pass

    def get_all_list(self) -> List[T]:
        return list(map(self.map_from_db, list(self.get_collection().find())))

    def get_by_id(self, _id: str) -> T | None:
        return self.get_one_by({"_id": ObjectId(_id)})

    def insert(self, data: T) -> str | None:
        if self.get_by_identifier(data) is not None:
            return None

        return self.get_collection().insert_one(data.get_repr_for_db()).inserted_id

    def update(self, data: T) -> str | None:
        old_data = self.get_by_identifier(data)
        if old_data is None:
            return None

        data.set_id(old_data.uid)

        # update method is not as straight-forward
        return self.get_collection().insert_one(data.get_repr_for_db()).inserted_id

    def get_one_by(self, identifier: Dict[str, Any]) -> T | None:
        data = self.get_collection().find_one(identifier)

        if data:
            return self.map_from_db(data)

        return None

    def get_all_by_paginated(self, identifier: Dict[str, Any], page: int, per_page: int) -> Pagination:
        collection = self.get_collection()
        data = collection.find(identifier).skip(per_page * (page - 1)).limit(per_page)

        total_items = collection.count_documents({})

        paginated = Pagination(
            collection=[] if data is None else list(map(self.map_from_db, list(data))),
            page=page,
            total_pages=(total_items + per_page - 1) // per_page,
            total_items=total_items,
        )

        return paginated
