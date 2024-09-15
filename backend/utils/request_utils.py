from collections.abc import Callable
from functools import wraps
from typing import Any, Tuple

from flask import Response, jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request, current_user, get_current_user

from blueprints.user.models import UserModel


def user_required(fn: Callable[[Any], Tuple[Response, int] | Response]):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        user: UserModel | None = get_current_user()

        if user is None:
            return jsonify({"error": "Incorrect user"}), 401

        kwargs["user"] = user

        return fn(*args, **kwargs)

    return wrapper
