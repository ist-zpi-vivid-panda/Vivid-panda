from enum import Enum
from typing import Type


def is_valid_enum_value(enum_class: Type[Enum], value: str) -> bool:
    return value in enum_class.__members__.values()
