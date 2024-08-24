from abc import ABC, abstractmethod
from dataclasses import dataclass
from typing import Any, Dict


@dataclass
class BaseModel(ABC):
    @abstractmethod
    def set_id(self, _id: str) -> None:
        pass

    @abstractmethod
    def get_repr_for_db(self) -> Dict[str, Any]:
        pass
