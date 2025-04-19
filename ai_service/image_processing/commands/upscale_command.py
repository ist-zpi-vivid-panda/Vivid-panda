from image_processing.commands.command import Command
from PIL import Image


class UpscaleCommand(Command):
    def __init__(self) -> None:
        pass

    def execute(self, image: Image.Image) -> Image.Image:
        width, height = 800, 600
        color_mode = "RGB"
        empty_image = Image.new(color_mode, (width, height), color=(255, 255, 255))
        return empty_image
