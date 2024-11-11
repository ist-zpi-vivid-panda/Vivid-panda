from image_processing.command import Command
from image_processing.upscaling.factory import UpscalingModelFactory
from PIL import Image


class UpscaleCommand(Command):
    def __init__(self, model_name: str = "edsr") -> None:
        self.model = UpscalingModelFactory.get_model(model_name)

    def execute(self, image: Image.Image) -> Image.Image:
        return self.model.upscale(image)
