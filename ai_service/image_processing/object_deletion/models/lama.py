from image_processing.object_deletion.models.model import ObjectDeletionModel
from PIL import Image
from simple_lama_inpainting import SimpleLama


class LamaInpaintingModel(ObjectDeletionModel):
    def __init__(self) -> None:
        self.model = SimpleLama(device="cpu")

    def inpaint(self, image: Image.Image, mask: Image.Image) -> Image.Image:
        resized_mask = mask.resize(image.size, Image.LANCZOS)
        resized_mask = resized_mask.convert("L")
        resized_binary_mask = resized_mask.point(lambda p: 255 if p > 128 else 0)
        return self.model(image, resized_binary_mask)
