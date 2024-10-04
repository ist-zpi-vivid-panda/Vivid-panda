import unittest
from unittest.mock import patch

import numpy as np
import cv2
from pathlib import Path

from image_processing.features_processor import FeaturesProcessor


class TestFeaturesProcessorWhiteBalanceScore(unittest.TestCase):
    def setUp(self):
        self.black_image = np.zeros((10, 10, 3), dtype=np.uint8)
        self.white_image = np.full((10, 10, 3), 255, dtype=np.uint8)
        self.red_tinted_image = np.full((10, 10, 3), [255, 100, 100], dtype=np.uint8)
        self.blue_tinted_image = np.full((10, 10, 3), [100, 100, 255], dtype=np.uint8)

        self.processor_black = FeaturesProcessor(self.black_image)
        self.processor_white = FeaturesProcessor(self.white_image)
        self.processor_red_tinted = FeaturesProcessor(self.red_tinted_image)
        self.processor_blue_tinted = FeaturesProcessor(self.blue_tinted_image)

    def test_black_image_white_balance_score(self):
        white_balance_score = self.processor_black.white_balance
        self.assertAlmostEqual(white_balance_score, 0, delta=5)

    def test_white_image_white_balance_score(self):
        white_balance_score = self.processor_white.white_balance
        self.assertAlmostEqual(white_balance_score, 0, delta=5)

    def test_red_tinted_image_white_balance_score(self):
        white_balance_score = self.processor_red_tinted.white_balance
        self.assertLess(white_balance_score, -50)

    def test_blue_tinted_image_white_balance_score(self):
        white_balance_score = self.processor_blue_tinted.white_balance
        self.assertGreater(white_balance_score, 50)

    def test_cache_functionality(self):
        with patch.object(self.processor_black, 'calculate_white_balance', wraps=self.processor_black.calculate_white_balance) as mocked:
            first_white_balance = self.processor_black.white_balance
            second_white_balance = self.processor_black.white_balance
            mocked.assert_called_once()
            self.assertEqual(first_white_balance, second_white_balance)


class TestFeaturesProcessorWhiteBalanceScoreWithRealImages(unittest.TestCase):
    def setUp(self):
        self.image_folder = Path("../../test_resources/features_processor/white_balance_examples")

        self.real_image_1 = cv2.imread(str(self.image_folder / "image1.jpg"))
        self.real_image_2 = cv2.imread(str(self.image_folder / "image2.jpg"))
        self.real_image_3 = cv2.imread(str(self.image_folder / "image3.jpg"))

        assert self.real_image_1 is not None, "Error during test image upload"
        assert self.real_image_2 is not None, "Error during test image upload"
        assert self.real_image_3 is not None, "Error during test image upload"

        self.processor_real_image_1 = FeaturesProcessor(self.real_image_1)
        self.processor_real_image_2 = FeaturesProcessor(self.real_image_2)
        self.processor_real_image_3 = FeaturesProcessor(self.real_image_3)

    def test_real_image_1_white_balance_score(self):
        white_balance_score = self.processor_real_image_1.white_balance
        print(f"White Balance Score for image1.jpg: {white_balance_score}")
        self.assertGreaterEqual(white_balance_score, -40)
        self.assertLessEqual(white_balance_score, 40)

    def test_real_image_2_white_balance_score(self):
        white_balance_score = self.processor_real_image_2.white_balance
        print(f"White Balance Score for image2.jpg: {white_balance_score}")
        self.assertLessEqual(white_balance_score, -40)

    def test_real_image_3_white_balance_score(self):
        white_balance_score = self.processor_real_image_3.white_balance
        print(f"White Balance Score for image3.jpg: {white_balance_score}")
        self.assertGreaterEqual(white_balance_score, 40)


if __name__ == '__main__':
    unittest.main()
