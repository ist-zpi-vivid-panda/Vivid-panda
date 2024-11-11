import cv2
import numpy as np
from image_processing.upscaling.models.model import UpscalingModel
from PIL import Image


class LanczosUpscalingModel(UpscalingModel):
    def __init__(self, scale: int = 4) -> None:
        self.scale = scale

    def upscale(self, image: Image.Image) -> Image.Image:
        opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        original_height, original_width = opencv_image.shape[:2]
        new_width = int(original_width * self.scale)
        new_height = int(original_height * self.scale)
        result = cv2.resize(
            opencv_image, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4
        )
        rgb_image = cv2.cvtColor(result, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(rgb_image)
        return pil_image
