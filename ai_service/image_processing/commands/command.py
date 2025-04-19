# image_processing/commands/command.py
from abc import ABC, abstractmethod
from typing import Any, Protocol

from PIL import Image


class CommandProtocol(Protocol):
    def execute(self, *args: Any, **kwargs: Any) -> Image.Image:
        ...


class Command(ABC):
    @abstractmethod
    def execute(self, *args: Any, **kwargs: Any) -> Image.Image:
        pass
