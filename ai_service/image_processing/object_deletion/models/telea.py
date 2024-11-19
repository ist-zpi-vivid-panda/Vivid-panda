import cv2
import numpy as np
from image_processing.object_deletion.models.model import ObjectDeletionModel
from PIL import Image


class TeleaInpaintingModel(ObjectDeletionModel):
    def inpaint(self, image: Image.Image, mask: Image.Image) -> Image.Image:
        opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        opencv_mask = np.array(mask)
        result = cv2.inpaint(
            opencv_image, opencv_mask, inpaintRadius=3, flags=cv2.INPAINT_TELEA
        )
        rgb_image = cv2.cvtColor(result, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(rgb_image)
        return pil_image
