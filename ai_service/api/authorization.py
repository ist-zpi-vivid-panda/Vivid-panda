from functools import wraps
from typing import TypeVar, Callable, Any

import jwt

from flask import request, jsonify

from env.env_vars import SECRET_KEY

F = TypeVar("F", bound=Callable[..., Any])


def validate_jwt_token(token: str) -> None:
    """
    Validates a static JWT token.
    """
    try:
        jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        raise Exception("Token has expired.")
    except jwt.DecodeError:
        raise Exception("Invalid token.")


def jwt_required(f: F) -> F:
    """
    Decorator to protect endpoints with a common JWT token.
    """
    @wraps(f)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"error": "Authorization header missing or invalid"}), 401

        token = auth_header.split(" ")[1]  # Extract the token part
        try:
            validate_jwt_token(token)
        except Exception as e:
            return jsonify({"error": str(e)}), 401

        return f(*args, **kwargs)
    return wrapper  # type: ignore