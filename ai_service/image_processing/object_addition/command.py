from image_processing.command import Command
from image_processing.object_addition.factory import AddObjectModelFactory
from PIL import Image


class AddObjectCommand(Command):
    def __init__(self, model_name: str = "empty") -> None:
        self.model = AddObjectModelFactory.get_model(model_name)

    def execute(
        self, image: Image.Image, mask: Image.Image, prompt: str
    ) -> Image.Image:
        result = self.model.inpaint(image, mask, prompt)
        return result
