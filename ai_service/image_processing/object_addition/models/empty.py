from image_processing.object_addition.models.model import AddObjectModel
from PIL import Image


class EmptyAddObjectModel(AddObjectModel):
    def inpaint(
        self, image: Image.Image, mask: Image.Image, prompt: str
    ) -> Image.Image:
        width, height = 800, 600
        color_mode = "RGB"
        empty_image = Image.new(color_mode, (width, height), color=(255, 255, 255))
        return empty_image
