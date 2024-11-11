import torch
from diffusers import AutoPipelineForInpainting
from image_processing.object_addition.models.model import AddObjectModel
from PIL import Image


class StableDiffusionXLInpaintingModel(AddObjectModel):
    def __init__(self, device: str = "cuda") -> None:
        self.device = device
        self.pipeline = AutoPipelineForInpainting.from_pretrained(
            "diffusers/stable-diffusion-xl-1.0-inpainting-0.1",
        ).to(device)

    def inpaint(
        self, image: Image.Image, mask: Image.Image, prompt: str
    ) -> Image.Image:
        generator = torch.Generator(self.device).manual_seed(92)
        image = self.pipeline(
            prompt=prompt, image=image, mask_image=mask, generator=generator
        ).images[0]
        return image
