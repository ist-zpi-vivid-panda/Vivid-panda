from collections.abc import Callable
from functools import wraps
from typing import Tuple, Any

from flask import jsonify, Response
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request

from blueprints.user.models import UserModel


def user_required(fn: Callable[[Any], Tuple[Response, int] | Response]):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()  # Verifies the token is present
        user: UserModel | None = get_jwt_identity()

        if user is None:
            return jsonify({"error": "Incorrect user"}), 401

        return fn(*args, **kwargs)

    return wrapper
