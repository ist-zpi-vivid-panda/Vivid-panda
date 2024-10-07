from typing import Any

import requests

from env_vars import GOOGLE_DISCOVERY_URL


class SingletonMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs) -> dict:
        if cls not in cls._instances:
            cls._instances[cls] = super(SingletonMeta, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


def get_google_provider_cfg() -> Any:
    return requests.get(GOOGLE_DISCOVERY_URL).json()
