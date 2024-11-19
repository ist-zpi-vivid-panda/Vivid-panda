import torch
from deoldify.visualize import get_image_colorizer
from image_processing.command import Command
from PIL import Image

# from deoldify import device
# from deoldify.device_id import DeviceId
# device.set(device=DeviceId.GPU0)


class ColorizeCommand(Command):
    def __init__(self) -> None:
        self.set_device()
        self.colorizer = get_image_colorizer(artistic=False)

    @staticmethod
    def set_device() -> None:
        if not torch.cuda.is_available():
            print("GPU not available. Using CPU instead.")
        else:
            torch.backends.cudnn.benchmark = True

    def execute(self, image: Image.Image) -> Image.Image:
        result = self.colorizer.filter.filter(
            image, image, render_factor=35, post_process=True
        )
        return result

    # def execute(self, image: Image.Image) -> Image.Image:
    #     width, height = 800, 600
    #     color_mode = "RGB"
    #     empty_image = Image.new(color_mode, (width, height), color=(255, 255, 255))
    #     return empty_image
