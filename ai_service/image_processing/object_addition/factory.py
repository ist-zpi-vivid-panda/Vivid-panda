from image_processing.object_addition.models.empty import EmptyAddObjectModel
from image_processing.object_addition.models.kandinsky import KandinskyInpaintingModel
from image_processing.object_addition.models.model import AddObjectModel
from image_processing.object_addition.models.stable_diffusion3 import (
    StableDiffusion3InpaintingModel,
)
from image_processing.object_addition.models.stable_diffusion_light import (
    StableDiffusionInpaintingModelLight,
)
from image_processing.object_addition.models.stable_diffusion_xl import (
    StableDiffusionXLInpaintingModel,
)


class AddObjectModelFactory:
    @staticmethod
    def get_model(model_type: str) -> AddObjectModel:
        if model_type == "kandinsky":
            return KandinskyInpaintingModel()
        elif model_type == "stable_diffusion_light":
            return StableDiffusionInpaintingModelLight()
        elif model_type == "stable_diffusion_xl":
            return StableDiffusionXLInpaintingModel()
        elif model_type == "stable_diffusion3":
            return StableDiffusion3InpaintingModel()
        elif model_type == "empty":
            return EmptyAddObjectModel()
        else:
            raise ValueError(f"Unsupported model: {model_type}")
