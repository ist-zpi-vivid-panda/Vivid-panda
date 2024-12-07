from image_processing.command import Command
from image_processing.object_addition.factory import AddObjectModelFactory
from transformers import pipeline
from PIL import Image


class AddObjectCommand(Command):
    def __init__(self, model_name: str = "empty") -> None:
        self.model = AddObjectModelFactory.get_model(model_name)
        self.lang_detector = pipeline("text-classification", model="papluca/xlm-roberta-base-language-detection", device="cpu")
        self.translator_pl_to_en = pipeline("translation", model="Helsinki-NLP/opus-mt-pl-en", device="cpu")

    def detect_and_translate(self, text: str):
        detection = self.lang_detector(text)
        language = detection[0]['label']
        print("Detected language:", language)
        if language == "pl":
            translation = self.translator_pl_to_en(text)
            translated_text = translation[0]['translation_text']
            print("Translated text:", translated_text)
            return translated_text
        return text

    def execute(
        self, image: Image.Image, mask: Image.Image, prompt: str
    ) -> Image.Image:
        text = self.detect_and_translate(prompt)
        result = self.model.inpaint(image, mask, text)
        return result
