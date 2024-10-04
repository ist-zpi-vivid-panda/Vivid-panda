import unittest
import numpy as np
import cv2
from unittest.mock import patch
from pathlib import Path

from image_processing.features_processor import FeaturesProcessor


class TestFeaturesProcessorSaturation(unittest.TestCase):
    def setUp(self):
        self.black_image = np.zeros((10, 10, 3), dtype=np.uint8)
        self.white_image = np.full((10, 10, 3), 255, dtype=np.uint8)
        self.black_white_image = np.array([[[0, 0, 0], [255, 255, 255]] * 5] * 10, dtype=np.uint8)

        self.processor_black = FeaturesProcessor(self.black_image)
        self.processor_white = FeaturesProcessor(self.white_image)
        self.processor_black_white = FeaturesProcessor(self.black_white_image)

    def test_black_image_saturation(self):
        saturation = self.processor_black.saturation
        self.assertEqual(saturation, 0)

    def test_white_image_saturation(self):
        saturation = self.processor_white.saturation
        self.assertEqual(saturation, 0)

    def test_black_white_image_saturation(self):
        saturation = self.processor_black_white.saturation
        self.assertEqual(saturation, 0)

    def test_cache_functionality(self):
        with patch.object(self.processor_black, 'calculate_saturation', wraps=self.processor_black.calculate_saturation) as mocked:
            first_saturation = self.processor_black.saturation
            second_saturation = self.processor_black.saturation
            mocked.assert_called_once()
            self.assertEqual(first_saturation, second_saturation)


class TestFeaturesProcessorSaturationWithRealImages(unittest.TestCase):
    def setUp(self):
        self.image_folder = Path("../../test_resources/features_processor/saturation_examples")

        self.real_image_1 = cv2.imread(str(self.image_folder / "image1.jpg"))
        self.real_image_2 = cv2.imread(str(self.image_folder / "image2.jpg"))
        self.real_image_3 = cv2.imread(str(self.image_folder / "image3.jpg"))

        assert self.real_image_1 is not None, "Error during test image upload"
        assert self.real_image_2 is not None, "Error during test image upload"
        assert self.real_image_3 is not None, "Error during test image upload"

        self.processor_real_image_1 = FeaturesProcessor(self.real_image_1)
        self.processor_real_image_2 = FeaturesProcessor(self.real_image_2)
        self.processor_real_image_3 = FeaturesProcessor(self.real_image_3)

    def test_real_image_1_saturation(self):
        saturation = self.processor_real_image_1.saturation
        print(f"Saturation for image1.jpg: {saturation}")
        self.assertGreaterEqual(saturation, 40)
        self.assertLessEqual(saturation, 80)

    def test_real_image_2_saturation(self):
        saturation = self.processor_real_image_2.saturation
        print(f"Saturation for image2.jpg: {saturation}")
        self.assertLessEqual(saturation, 40)

    def test_real_image_3_saturation(self):
        saturation = self.processor_real_image_3.saturation
        print(f"Saturation for image3.jpg: {saturation}")
        self.assertGreaterEqual(saturation, 80)


if __name__ == '__main__':
    unittest.main()
