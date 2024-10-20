from typing import Any, Mapping

from pymongo import MongoClient
from pymongo.database import Database

from config.env_vars import MONGO_HOST, MONGO_PASSWORD, MONGO_PORT, MONGO_USERNAME


def create_db_connection(database_name: str) -> Database[Mapping[str, Any]]:
    connection: MongoClient = MongoClient(
        host=MONGO_HOST, port=MONGO_PORT, username=MONGO_USERNAME, password=MONGO_PASSWORD
    )

    return connection[database_name]
