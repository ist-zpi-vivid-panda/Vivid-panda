# from image_processing.object_deletion.models.deep_fill_v2 import
# DeepFillInpaintingModel
from image_processing.object_deletion.models.lama import LamaInpaintingModel
from image_processing.object_deletion.models.model import ObjectDeletionModel
from image_processing.object_deletion.models.telea import TeleaInpaintingModel


class ObjectDeletionModelFactory:
    @staticmethod
    def get_model(model_name: str) -> ObjectDeletionModel:
        if model_name == "lama":
            return LamaInpaintingModel()
        elif model_name == "telea":
            return TeleaInpaintingModel()
        else:
            raise ValueError(f"Unsupported model: {model_name}")
