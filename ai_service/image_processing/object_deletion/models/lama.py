from image_processing.object_deletion.models.model import ObjectDeletionModel
from PIL import Image
from simple_lama_inpainting import SimpleLama


class LamaInpaintingModel(ObjectDeletionModel):
    def __init__(self) -> None:
        self.model = SimpleLama(device="cpu")

    def inpaint(self, image: Image.Image, mask: Image.Image) -> Image.Image:
        return self.model(image, mask)
