# from pathlib import Path

# import torch
from image_processing.commands.command import Command
from PIL import Image

# from deoldify import device
# from deoldify.device_id import DeviceId
# from deoldify.visualize import get_image_colorizer


class ColorizeCommand(Command):
    def __init__(self) -> None:
        pass
        # self.colorizer = get_image_colorizer(artistic=False)
        # self.set_device()

    # @staticmethod
    # def set_device():
    #     if not torch.cuda.is_available():
    #         print("GPU not available. Using CPU instead.")
    #     else:
    #         device.set(device=DeviceId.GPU0)
    #         torch.backends.cudnn.benchmark = True
    #
    # def execute(self, image):
    #     self.colorizer.filter.filter(image, image, render_factor=35,
    #     post_process=True)
    #     return image

    def execute(self, image: Image.Image) -> Image.Image:
        width, height = 800, 600
        color_mode = "RGB"
        empty_image = Image.new(color_mode, (width, height), color=(255, 255, 255))
        return empty_image
