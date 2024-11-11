import cv2
import numpy as np
from image_processing.upscaling.models.model import UpscalingModel
from PIL import Image


class EdsrUpscalingModel(UpscalingModel):
    def __init__(
        self, path: str = "models/EDSR_x4.pb", name: str = "edsr", scale: int = 4
    ) -> None:
        self.sr = cv2.dnn_superres.DnnSuperResImpl_create()
        self.set_model(path, name, scale)

    def set_model(self, path: str, name: str, scale: int) -> None:
        self.sr.readModel(path)
        self.sr.setModel(name, scale)

    def upscale(self, image: Image.Image) -> Image.Image:
        opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        result = self.sr.upsample(opencv_image)
        rgb_image = cv2.cvtColor(result, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(rgb_image)
        return pil_image
