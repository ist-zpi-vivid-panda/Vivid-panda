from typing import Any, Mapping

from pymongo import MongoClient
from pymongo.database import Database

from env_vars import MONGO_HOST, MONGO_PASSWORD, MONGO_PORT, MONGO_USERNAME

config = {
    "host": MONGO_HOST,
    "port": MONGO_PORT,
    "username": MONGO_USERNAME,
    "password": MONGO_PASSWORD,
}


class Connection:
    def __new__(cls, database_name: str) -> Database[Mapping[str, Any]]:
        connection = MongoClient(**config)
        return connection[database_name]
