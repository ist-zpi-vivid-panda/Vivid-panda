from collections.abc import Callable
from functools import wraps
from typing import Any, Dict, List, Tuple

from flask import Response, jsonify
from flask_jwt_extended import get_current_user, verify_jwt_in_request

from blueprints.user.models import UserModel


def error_dict(message: str) -> Dict[str, Any]:
    return {"error": message}


def validation_errors_dict(messages: Dict[str, List[str]]) -> Dict[str, Any]:
    return {"validation_errors": messages}


def user_required(fn: Callable[[Any], Tuple[Response, int] | Response]):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user: UserModel | None = get_current_user()

        if user is None:
            return jsonify(error_dict("Incorrect user")), 401

        kwargs["user"] = user

        return fn(*args, **kwargs)

    return wrapper
