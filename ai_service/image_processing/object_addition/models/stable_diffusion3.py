from diffusers import StableDiffusion3InpaintPipeline
from image_processing.object_addition.models.model import AddObjectModel
from PIL import Image


class StableDiffusion3InpaintingModel(AddObjectModel):
    def __init__(self) -> None:
        self.pipeline = StableDiffusion3InpaintPipeline.from_pretrained(
            "stabilityai/stable-diffusion-3-medium-diffusers",
        ).to("cpu")

    def inpaint(
        self, image: Image.Image, mask: Image.Image, prompt: str
    ) -> Image.Image:
        negative_prompt = "bad anatomy, deformed, ugly, disfigured"
        image = self.pipeline(
            prompt=prompt, negative_prompt=negative_prompt, image=image, mask_image=mask
        ).images[0]
        return image
