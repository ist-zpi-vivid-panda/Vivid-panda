from enum import Enum


class StyleTransfer(Enum):
    VAN_GOGH = "vangogh"
    MONDRIAN = "mondrian"
    MATISSE = "matisse"
    SKETCH = "sketch"


class AiFunction(Enum):
    COLORIZE_IMAGE = "colorize_image"
    DELETE_OBJECT = "delete_object"
    ADD_OBJECT = "add_object"
    TRANSFER_STYLE = "transfer_style"
    UPSCALE = "upscale"
