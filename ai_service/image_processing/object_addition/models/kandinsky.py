from diffusers import AutoPipelineForInpainting
from image_processing.object_addition.models.model import AddObjectModel
from PIL import Image


class KandinskyInpaintingModel(AddObjectModel):
    def __init__(self) -> None:
        self.pipeline = AutoPipelineForInpainting.from_pretrained(
            "kandinsky-community/kandinsky-2-2-decoder-inpaint",
        ).to("cpu")

    def inpaint(
        self, image: Image.Image, mask: Image.Image, prompt: str
    ) -> Image.Image:
        negative_prompt = "bad anatomy, deformed, ugly, disfigured"
        image = self.pipeline(
            prompt=prompt, negative_prompt=negative_prompt, image=image, mask_image=mask
        ).images[0]
        return image
