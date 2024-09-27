from collections.abc import Callable
from functools import wraps
from typing import Any, Dict, List, Tuple, Type

from flask import Response, jsonify
from flask_apispec import doc, marshal_with
from flask_jwt_extended import get_current_user, verify_jwt_in_request, jwt_required
from marshmallow import Schema

from blueprints.user.models import UserModel
from config.doc_config import get_security
from schemas.responses import ErrorSchema


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


def secure_endpoint(description: str, tags: list[str], response_schemas: List[Tuple[Type[Schema], int]]):
    def decorator(func):
        func = jwt_required()(func)
        func = user_required(func)
        func = doc(description=description, tags=tags, security=get_security())(func)
        for schema, code in response_schemas:
            func = marshal_with(schema, code=code)(func)

        return func

    return decorator
