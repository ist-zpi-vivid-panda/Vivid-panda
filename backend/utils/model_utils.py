from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Dict


@dataclass
class BaseModel(ABC):
    @abstractmethod
    def get_dict_repr(self) -> Dict[str, Any]:
        pass

    @abstractmethod
    def get_dto(self) -> Dict[str, Any]:
        pass

    def __repr__(self) -> str:
        return str(self.get_dict_repr())
