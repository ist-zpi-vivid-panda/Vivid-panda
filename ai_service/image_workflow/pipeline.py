from typing import Any, Callable, List, Tuple

from image_processing.features_processor import FeaturesProcessor


class ImagePipeline:
    def __init__(self, image_path: str):
        self.processor = FeaturesProcessor(image_path)
        self.operations: List[Callable[[FeaturesProcessor], Any]] = []
        self.validation_failures: List[Tuple[str, float, float, float]] = []

    def add_operation(self, operation: Callable[..., float]) -> None:
        self.operations.append(operation)

    def run(self) -> None:
        for operation in self.operations:
            result = operation(self.processor)
            print(f"Result of {operation.__name__}: {result}")
            if hasattr(operation, "failures"):
                self.validation_failures.extend(operation.failures)

    def get_validation_failures(self) -> List[Tuple[str, float, float, float]]:
        """
        Retrieve all validation failures.

        Returns:
            List[Tuple[str, float, float, float]]: List of tuples containing
            function name, result, min value, and max value.
        """
        return self.validation_failures


if __name__ == "__main__":
    pipeline = ImagePipeline("path/to/image.jpg")

    pipeline.add_operation(FeaturesProcessor.brightness)
    pipeline.add_operation(FeaturesProcessor.contrast)
    pipeline.add_operation(FeaturesProcessor.saturation)

    print("Starting pipeline execution...")
    pipeline.run()

    # Retrieve and print validation failures
    failures = pipeline.get_validation_failures()
    if failures:
        print("Validation failures detected:")
        for failure in failures:
            func_name, result, min_val, max_val = failure
            print(
                f"{func_name} returned {result}, expected between "
                f"{min_val} and {max_val}"
            )
    else:
        print("All validations passed.")
