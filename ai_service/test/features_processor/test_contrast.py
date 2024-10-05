import unittest
from pathlib import Path
from unittest.mock import patch

import cv2
import numpy as np
from image_processing.features_processor import FeaturesProcessor


class TestFeaturesProcessorContrast(unittest.TestCase):
    def setUp(self) -> None:
        self.black_image = np.zeros((10, 10, 3), dtype=np.uint8)
        self.white_image = np.full((10, 10, 3), 255, dtype=np.uint8)
        self.black_white_image = np.array(
            [[[0, 0, 0], [255, 255, 255]] * 5] * 10, dtype=np.uint8
        )

        self.processor_black = FeaturesProcessor(self.black_image)
        self.processor_white = FeaturesProcessor(self.white_image)
        self.processor_black_white = FeaturesProcessor(self.black_white_image)

    def test_black_image_contrast(self) -> None:
        contrast = self.processor_black.contrast
        self.assertEqual(contrast, 0)

    def test_white_image_contrast(self) -> None:
        contrast = self.processor_white.contrast
        self.assertEqual(contrast, 0)

    def test_black_white_image_contrast(self) -> None:
        contrast = self.processor_black_white.contrast
        self.assertEqual(contrast, 127.5)

    def test_cache_functionality(self) -> None:
        with patch.object(
            self.processor_black,
            "calculate_contrast",
            wraps=self.processor_black.calculate_contrast,
        ) as mocked:
            first_contrast = self.processor_black.contrast
            second_contrast = self.processor_black.contrast
            mocked.assert_called_once()
            self.assertEqual(first_contrast, second_contrast)


class TestFeaturesProcessorContrastWithRealImages(unittest.TestCase):
    def setUp(self) -> None:
        self.image_folder = Path(
            "../../test_resources/features_processor/contrast_examples"
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

    def test_real_image_1_contrast(self) -> None:
        contrast = self.processor_real_image_1.contrast
        print(f"Contrast for image1.jpg: {contrast}")
        self.assertLessEqual(contrast, 80)
        self.assertGreaterEqual(contrast, 40)

    def test_real_image_2_contrast(self) -> None:
        contrast = self.processor_real_image_2.contrast
        print(f"Contrast for image2.jpg: {contrast}")
        self.assertLessEqual(contrast, 40)

    def test_real_image_3_contrast(self) -> None:
        contrast = self.processor_real_image_3.contrast
        print(f"Contrast for image3.jpg: {contrast}")
        self.assertGreaterEqual(contrast, 80)


if __name__ == "__main__":
    unittest.main()
