from image_processing.command import Command
from image_processing.object_deletion.factory import ObjectDeletionModelFactory
from PIL import Image


class DeleteObjectCommand(Command):
    def __init__(self, model_name: str = "lama") -> None:
        self.inpainter = ObjectDeletionModelFactory.get_model(model_name)

    def execute(self, image: Image.Image, mask: Image.Image) -> Image.Image:
        result = self.inpainter.inpaint(image, mask)
        return result
