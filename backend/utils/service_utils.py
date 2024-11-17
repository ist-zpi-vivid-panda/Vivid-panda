from abc import ABC, abstractmethod
from typing import Any, Dict, Generic, List, Mapping, TypeVar

from bson.objectid import ObjectId
from pymongo.collection import Collection

from utils.any_utils import SingletonMeta
from utils.model_utils import BaseModel

T = TypeVar("T", bound=BaseModel)
P = TypeVar("P")


class Pagination(Generic[P]):
    def __init__(
        self,
        collection: List[P],
        page: int,
        total_pages: int,
        total_items: int,
    ) -> None:
        self.collection = collection
        self.page = page
        self.per_page = len(collection)
        self.total_pages = total_pages
        self.total_items = total_items


class BaseCRUDService(ABC, Generic[T]):
    __metaclass__ = SingletonMeta

    @abstractmethod
    def get_collection(self) -> Collection[Mapping[str, Any]]:
        pass

    @abstractmethod
    def map_from_db(self, data: Mapping[str, Any]) -> T:
        pass

    @abstractmethod
    def get_id(self, data) -> str | None:
        pass

    def get_all_list(self) -> List[Dict[str, Any]]:
        return [self.map_from_db(doc).get_dto() for doc in self.get_collection().find()]

    def get_by_id(self, _id: str) -> T | None:
        return self.get_one_by({"_id": ObjectId(_id)})

    def insert(self, data: T) -> str | None:
        data_id = self.get_id(data)

        if not (data_id is None or self.get_by_id(data_id) is None):
            return None

        return str(self.get_collection().insert_one(data.get_dict_repr()).inserted_id)

    def update(self, data: T) -> str | None:
        return str(
            self.get_collection()
            .update_one({"_id": ObjectId(self.get_id(data))}, {"$set": data.get_dict_repr()}, upsert=False)
            .upserted_id
        )

    def delete(self, data: T) -> bool:
        data_id = self.get_id(data)
        if data_id is None:
            return False

        old_data = self.get_by_id(data_id)
        if old_data is None:
            return False

        return self.get_collection().delete_one({"_id": ObjectId(self.get_id(old_data))}).deleted_count > 0

    def get_one_by(self, identifier: Dict[str, Any]) -> T | None:
        data = self.get_collection().find_one(identifier)

        if data is None:
            return None

        return self.map_from_db(data)

    # pagination starts on 1
    def get_all_by_paginated(self, identifier: Dict[str, Any], page: int, per_page: int) -> Pagination[T]:
        collection = self.get_collection()
        data = collection.find(identifier).skip(per_page * (page - 1)).limit(per_page)

        total_items = collection.count_documents({})

        paginated = Pagination(
            collection=[] if data is None else [self.map_from_db(doc) for doc in data],
            page=page,
            total_pages=(total_items + per_page) // per_page,
            total_items=total_items,
        )

        return paginated
