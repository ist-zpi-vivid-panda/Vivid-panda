from enum import Enum
from typing import Type


def is_valid_enum_value(enum_class: Type[Enum], value: str) -> bool:
    names = [enum.value for enum in enum_class.__members__.values()]

    return value in names
