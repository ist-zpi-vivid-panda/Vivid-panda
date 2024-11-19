from typing import Any, Dict

from image_processing.colorization.colorize_command import ColorizeCommand
from image_processing.command import Command
from image_processing.object_addition.command import AddObjectCommand
from image_processing.object_deletion.command import DeleteObjectCommand
from image_processing.style_transfer.style_transfer_command import StyleTransferCommand

# from image_processing.commands.style_transfer_command import StyleTransferCommand
from image_processing.upscaling.command import UpscaleCommand
from PIL import Image


class Invoker:
    _instance = None

    def __new__(cls) -> "Invoker":
        if cls._instance is None:
            cls._instance = super(Invoker, cls).__new__(cls)
        return cls._instance

    def __init__(self) -> None:
        self.commands: Dict[str, Command] = {
            "colorize_image": ColorizeCommand(),
            "delete_object": DeleteObjectCommand(),
            "add_object": AddObjectCommand(),
            "transfer_style": StyleTransferCommand(),
            "upscale": UpscaleCommand(),
        }

    def process_request(self, request: Dict[str, Any]) -> Image.Image:
        command = self.commands.get(request["type"])
        if command:
            return command.execute(**request["params"])
        else:
            raise ValueError(
                f"Unknown command type: {request['type']}, available commands "
                f"are {list(self.commands.keys())}"
            )
