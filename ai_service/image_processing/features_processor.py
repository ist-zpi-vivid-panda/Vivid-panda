from enum import Enum
from functools import cached_property
from typing import Any, List, Tuple

import cv2
import numpy as np
from numpy import floating


class Status(Enum):
    WITHIN = 0
    LESS = 1
    GREATER = 2
    EXTREMELY_LESS = 3
    EXTREMELY_GREATER = 4


class FeaturesProcessor:
    """
    A class to process image features like brightness, sharpness, and contrast.
    """

    def __init__(self, image_input: str | np.ndarray):
        """
        Initialize the FeaturesProcessor with an image file.

        Args:
            image_input (str or np.ndarray): The input image file path
            or a numpy array.
        """
        if isinstance(image_input, str):
            self.image = cv2.imread(image_input)
            if self.image is None:
                raise ValueError("Invalid image path or file not found.")
        elif isinstance(image_input, np.ndarray):
            self.image = image_input
        else:
            raise ValueError(
                "Invalid input. Provide a valid image path or a numpy array."
            )

    def calculate_brightness(self) -> floating[Any]:
        gray_image = cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY)
        mean_brightness = np.mean(gray_image)
        return mean_brightness

    def calculate_white_balance(self) -> floating[Any]:
        mean_b = np.mean(self.image[:, :, 0])
        mean_r = np.mean(self.image[:, :, 2])
        white_balance = mean_r - mean_b
        return white_balance

    def calculate_contrast(self) -> floating[Any]:
        gray_image = cv2.cvtColor(self.image, cv2.COLOR_BGR2GRAY)
        contrast = np.std(gray_image)
        return contrast

    def calculate_saturation(self) -> floating[Any]:
        hsv_image = cv2.cvtColor(self.image, cv2.COLOR_BGR2HSV)
        saturation = hsv_image[:, :, 1].mean()
        return saturation

    @cached_property
    def brightness(self) -> floating[Any]:
        return self.calculate_brightness()

    @cached_property
    def white_balance(self) -> floating[Any]:
        return self.calculate_white_balance()

    @cached_property
    def contrast(self) -> floating[Any]:
        return self.calculate_contrast()

    @cached_property
    def saturation(self) -> floating[Any]:
        return self.calculate_saturation()

    @staticmethod
    def validate_range(attribute: str, attr_range: Tuple[float, float]) -> None:
        if not isinstance(attr_range, tuple) or len(attr_range) != 2:
            raise ValueError(f"Invalid range for {attribute} attribute")
        if attr_range[0] > attr_range[1]:
            raise ValueError(
                f"Invalid range for {attribute} attribute. Min value is "
                f"greater than max value"
            )

    @staticmethod
    def classify_value(
        value: float,
        value_range: Tuple[float, float],
        extreme_threshold: float = 0.1,
    ) -> Status:
        """
        Classify the value in relation to the range.

        Args:
            value (float): The attribute value (brightness, sharpness, etc.).
            value_range (Tuple[float, float]): The (min, max) range for the
            attribute.
            extreme_threshold (float): Percentage outside the range to classify
            as "extreme".

        Returns:
            str: A classification of the value ("within", "less", "greater",
            "extremely less", "extremely greater").
        """
        min_val, max_val = value_range
        # Lower extreme threshold
        extreme_min = min_val * (1 - extreme_threshold)
        # Upper extreme threshold
        extreme_max = max_val * (1 + extreme_threshold)

        if value < extreme_min:
            return Status.EXTREMELY_LESS
        elif value < min_val:
            return Status.LESS
        elif value > extreme_max:
            return Status.EXTREMELY_GREATER
        elif value > max_val:
            return Status.GREATER
        else:
            return Status.WITHIN

    def __call__(
        self, ranges: List[Tuple[float, float]]
    ) -> dict[str, floating[Any]] | None:
        """
        Process the attributes and check them against the given ranges.

        Args:
            ranges (List[Tuple[float, float]]): A list of (min, max) ranges
            for each attribute.

        Returns:
            dict: A dictionary of attributes with issues, if any.
        """
        attributes = ["brightness", "sharpness", "contrast"]
        if len(ranges) != len(attributes):
            raise ValueError(f"Expected {len(attributes)} ranges, got {len(ranges)}")

        issues = {}
        for attribute, attr_range in zip(attributes, ranges):
            self.validate_range(attribute, attr_range)
            value = getattr(self, attribute)
            classification = self.classify_value(value, attr_range)

            if classification != Status.WITHIN:
                issues[attribute] = {"value": value, "status": classification}
        return issues
