# this is used as the CORS package is awful to set up and doesn't deliver on its promises
from flask import Flask, Response, make_response

from config.env_vars import FRONTEND_URL


def add_cors_headers(response) -> Response:
    response.headers["Access-Control-Allow-Origin"] = FRONTEND_URL
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    return response


def register_cors(app: Flask) -> None:
    @app.after_request
    def after_request(response) -> Response:
        return add_cors_headers(response)

    @app.route("/", defaults={"path": ""}, methods=["OPTIONS"])
    @app.route("/<path:path>", methods=["OPTIONS"])
    def options_preflight(path) -> Response:
        return add_cors_headers(make_response())
