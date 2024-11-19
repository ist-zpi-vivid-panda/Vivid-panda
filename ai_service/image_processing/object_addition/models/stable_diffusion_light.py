from diffusers import AutoPipelineForInpainting
from image_processing.object_addition.models.model import AddObjectModel
from PIL import Image


class StableDiffusionInpaintingModelLight(AddObjectModel):
    def __init__(self, device: str = "cpu") -> None:
        self.pipeline = AutoPipelineForInpainting.from_pretrained(
            "runwayml/stable-diffusion-inpainting",
        ).to(device)

    def inpaint(
        self, image: Image.Image, mask: Image.Image, prompt: str
    ) -> Image.Image:
        image = self.pipeline(prompt=prompt, image=image, mask_image=mask).images[0]
        return image
