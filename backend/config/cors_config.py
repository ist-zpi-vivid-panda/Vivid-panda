from flask import Flask
from flask_cors import CORS

from config.env_vars import FRONTEND_URL


def create_cors_config(app: Flask) -> None:
    CORS(
        app,
        methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
        supports_credentials=True,
        origins=FRONTEND_URL,
        allow_headers=["Content-Type", "Authorization", "Accept-Language"],
    )
