from functools import wraps
from typing import Any, Callable, List, Optional, TypeVar

from flask import Flask

from api.authorization import jwt_required
from api.request import process_image_request
from env.env_vars import DEBUG, AI_MICROSERVICE_PORT, IP_ADDRESS
from image_processing.invoker import Invoker

app = Flask(__name__)

F = TypeVar("F", bound=Callable[..., Any])


def api_route(
    action: str,
    required_files: List[str],
    required_form_fields: Optional[List[str]] = None,
) -> Callable[..., Any]:
    def decorator(f: Callable[..., Any]) -> Any:
        @app.route(f"/{action}", methods=["POST"])
        @jwt_required
        @wraps(f)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            return process_image_request(action, required_files, required_form_fields)

        return wrapper

    return decorator


@api_route("colorize_image", ["image"])
def colorize_image() -> None:
    return


@api_route("delete_object", ["image", "mask"])
def object_deletion() -> None:
    return


@api_route("add_object", ["image", "mask"], ["prompt"])
def object_addition() -> None:
    return


@api_route("transfer_style", ["image"], ["style"])
def style_transfer() -> None:
    return


@api_route("upscale", ["image"])
def upscale() -> None:
    return


if __name__ == "__main__":
    invoker = Invoker()
    app.run(host=IP_ADDRESS, port=AI_MICROSERVICE_PORT, debug=DEBUG)
