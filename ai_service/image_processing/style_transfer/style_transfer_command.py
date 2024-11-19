import torch
from image_processing.command import Command
from image_processing.style_transfer import net
from image_processing.style_transfer.function import coral
from image_processing.style_transfer.test import style_transfer, test_transform
from PIL import Image
from torch import nn
from torchvision.utils import make_grid


class StyleTransferCommand(Command):
    size = 512
    crop = False
    preserve_color = False
    style_references = {
        "vangogh": "resources/styles/starry_night.jpg",
        "mondrian": "resources/styles/composition_vii.jpg",
        "matisse": "resources/styles/woman_with_a_hat.jpg",
        "sketch": "resources/styles/sketch.png",
    }

    def __init__(
        self,
        vgg_weights: str = "models/vgg_normalised.pth",
        decoder_weights: str = "models/decoder.pth",
        alpha: float = 1.0,
        device="cpu",
    ) -> None:
        self.vgg = self.vgg_init(vgg_weights, device)
        self.decoder = self.decoder_init(decoder_weights, device)
        self.device = device
        self.alpha = alpha

    @staticmethod
    def vgg_init(vgg_path, device) -> nn.Sequential:
        vgg = net.vgg
        vgg.eval()
        vgg.load_state_dict(torch.load(vgg_path))
        vgg = nn.Sequential(*list(vgg.children())[:31])
        vgg.to(device)
        return vgg

    @staticmethod
    def decoder_init(decoder_path, device) -> nn.Module:
        decoder = net.decoder
        decoder.eval()
        decoder.load_state_dict(torch.load(decoder_path))
        decoder.to(device)
        return decoder

    def get_style_reference(self, style_name: str) -> Image:
        try:
            style = Image.open(self.style_references[style_name])
        except KeyError:
            raise ValueError(
                f"Style {style_name} not found in style reference. Available styles: {', '.join(self.style_references.keys())}"
            )
        return style

    def execute(self, image: Image.Image, style: str) -> Image.Image:
        style_img = self.get_style_reference(style)
        content_tf = test_transform(self.size, self.crop)
        style_tf = test_transform(self.size, self.crop)

        content = content_tf(image)
        style = style_tf(style_img)

        if self.preserve_color:
            style = coral(style, content)
        style = style.to(self.device).unsqueeze(0)
        content = content.to(self.device).unsqueeze(0)

        with torch.no_grad():
            output = style_transfer(self.vgg, self.decoder, content, style, self.alpha)
        output = output.cpu()
        grid = make_grid(output)
        array = (
            grid.mul(255)
            .add_(0.5)
            .clamp_(0, 255)
            .permute(1, 2, 0)
            .to("cpu", torch.uint8)
            .numpy()
        )
        result = Image.fromarray(array)
        return result
