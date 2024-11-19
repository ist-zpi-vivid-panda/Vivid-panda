from PIL import Image


class AddObjectModel:
    def inpaint(
        self, image: Image.Image, mask: Image.Image, prompt: str
    ) -> Image.Image:
        raise NotImplementedError
