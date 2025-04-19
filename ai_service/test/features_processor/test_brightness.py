import unittest
from pathlib import Path
from unittest.mock import patch

import cv2
import numpy as np
from image_processing.features_processor import FeaturesProcessor


class TestFeaturesProcessorBrightness(unittest.TestCase):
    def setUp(self) -> None:
        self.black_image = np.zeros((10, 10, 3), dtype=np.uint8)
        self.white_image = np.full((10, 10, 3), 255, dtype=np.uint8)
        self.black_white_image = np.array(
            [[[0, 0, 0], [255, 255, 255]] * 5] * 10, dtype=np.uint8
        )

        self.processor_black = FeaturesProcessor(self.black_image)
        self.processor_white = FeaturesProcessor(self.white_image)
        self.processor_black_white = FeaturesProcessor(self.black_white_image)

    def test_black_image_brightness(self) -> None:
        brightness = self.processor_black.brightness
        self.assertEqual(brightness, 0)

    def test_white_image_brightness(self) -> None:
        brightness = self.processor_white.brightness
        self.assertEqual(brightness, 255)

    def test_black_white_image_brightness(self) -> None:
        brightness = self.processor_black_white.brightness
        self.assertEqual(brightness, 127.5)

    def test_cache_functionality(self) -> None:
        with patch.object(
            self.processor_black,
            "calculate_brightness",
            wraps=self.processor_black.calculate_brightness,
        ) as mocked:
            first_brightness = self.processor_black.brightness
            second_brightness = self.processor_black.brightness
            mocked.assert_called_once()
            self.assertEqual(first_brightness, second_brightness)


class TestFeaturesProcessorBrightnessWithRealImages(unittest.TestCase):
    def setUp(self) -> None:
        self.image_folder = Path(
            "../../test_resources/features_processor/brightness_examples"
        )

        self.real_image_1 = cv2.imread(str(self.image_folder / "image1.jpg"))
        self.real_image_2 = cv2.imread(str(self.image_folder / "image2.jpg"))
        self.real_image_3 = cv2.imread(str(self.image_folder / "image3.jpg"))

        assert self.real_image_1 is not None, "Error during test image upload"
        assert self.real_image_2 is not None, "Error during test image upload"
        assert self.real_image_3 is not None, "Error during test image upload"

        self.processor_real_image_1 = FeaturesProcessor(self.real_image_1)
        self.processor_real_image_2 = FeaturesProcessor(self.real_image_2)
        self.processor_real_image_3 = FeaturesProcessor(self.real_image_3)

    def test_real_image_1_brightness(self) -> None:
        brightness = self.processor_real_image_1.brightness
        print(f"Brightness for image1.jpg: {brightness}")
        self.assertGreaterEqual(brightness, 100)
        self.assertLessEqual(brightness, 150)

    def test_real_image_2_brightness(self) -> None:
        brightness = self.processor_real_image_2.brightness
        print(f"Brightness for image2.jpg: {brightness}")
        self.assertLessEqual(brightness, 100)

    def test_real_image_3_brightness(self) -> None:
        brightness = self.processor_real_image_3.brightness
        print(f"Brightness for image3.jpg: {brightness}")
        self.assertGreaterEqual(brightness, 150)
