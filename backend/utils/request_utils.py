from collections.abc import Callable
from functools import wraps
from typing import Any, Dict, List, Tuple, Type

from flask import Response, jsonify
from flask_apispec import doc, marshal_with, use_kwargs
from flask_jwt_extended import get_current_user, jwt_required, verify_jwt_in_request
from marshmallow import Schema

from blueprints.user.models import UserModel
from config.doc_config import get_security
from schemas.responses import ErrorSchema


def error_dict(message: str) -> Dict[str, Any]:
    return {"error": message}


def validation_errors_dict(messages: Dict[str, List[str]]) -> Dict[str, Any]:
    return {"validation_errors": messages}


def success_dict(success: bool) -> Dict[str, Any]:
    return {"success": success}


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


def doc_endpoint(
    description: str,
    tags: list[str],
    response_schemas: List[Tuple[Type[Schema], int]],
    input_schema: Type[Schema] | None = None,
    secure: bool = True,
    location: str = "json",
):
    def endpoint_decorator(
        func: Callable[[Any], Tuple[Response, int] | Response],
    ) -> Callable[[Any], Tuple[Response, int] | Response]:
        func = doc(description=description, tags=tags, security=get_security() if secure else None)(
            func
        )  # add docs to Swagger

        if secure:
            func = jwt_required()(func)  # jwt token is required
            func = user_required(func)  # validate and get the user
            func = marshal_with(schema=ErrorSchema, code=401)(func)  # default JWT error return

        # adding use_kwargs means that you don't need to jsonify the response!
        if input_schema is not None:
            func = use_kwargs(input_schema, location=location)(func)

        for schema, code in response_schemas:
            func = marshal_with(schema=schema, code=code)(func)  # other return schemas

        return func

    return endpoint_decorator
