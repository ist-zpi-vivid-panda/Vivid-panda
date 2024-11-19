# from PIL import Image
# from basicsr.archs.rrdbnet_arch import RRDBNet
# from realesrgan import RealESRGANer
#
# from image_processing.upscaling.models.model import UpscalingModel
#
#
# class EsrganUpscalingModel(UpscalingModel):
#    download_path = "https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/"
#     model = "RealESRGAN_x4plus.pth"
#
#     def __init__(self) -> None:
#         self.upscaler = RealESRGANer(
#             4,
#             self.download_path+self.model,
#             model = RRDBNet(
#                 num_in_ch=3,
#                 num_out_ch=3,
#                 num_feat=64,
#                 num_block=23,
#                 num_grow_ch=32,
#                 scale=4
#             ),
#             device="cpu"
#         )
#
#     def upscale(self, image: Image.Image) -> Image.Image:
#         self.upscaler.pre_process(image)
#         self.upscaler.process()
#         output = self.upscaler.post_process()
#         return output
