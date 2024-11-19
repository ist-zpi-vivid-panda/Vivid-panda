from PIL import Image


class ObjectDeletionModel:
    def inpaint(self, image: Image.Image, mask: Image.Image) -> Image.Image:
        raise NotImplementedError
