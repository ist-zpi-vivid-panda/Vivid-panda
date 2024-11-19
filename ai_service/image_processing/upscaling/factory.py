from image_processing.upscaling.models.edsr import EdsrUpscalingModel
from image_processing.upscaling.models.lanczos import LanczosUpscalingModel
from image_processing.upscaling.models.model import UpscalingModel

# from image_processing.upscaling.models.esrgan import EsrganUpscalingModel


class UpscalingModelFactory:
    @staticmethod
    def get_model(model_name: str) -> UpscalingModel:
        if model_name == "edsr":
            return EdsrUpscalingModel()
        # elif model_name == "esrgan":
        #     return EsrganUpscalingModel()
        elif model_name == "lanczos":
            return LanczosUpscalingModel()
        else:
            raise ValueError(f"Unsupported model: {model_name}")
