import os

from dotenv import load_dotenv

load_dotenv(".env")
load_dotenv(".env.local", override=True)


def _parse_to_bool(data: str) -> bool:
    return data.lower() == "true"


def _parse_to_int(data: str) -> int:
    try:
        return int(data)
    except ValueError:
        raise Exception(f"Problem with parsing {data} to int for an environment variable")


MONGO_HOST: str = os.getenv("MONGO_HOST")
MONGO_PORT: int = _parse_to_int(os.getenv("MONGO_PORT"))
MONGO_USERNAME: str = os.getenv("MONGO_USERNAME")
MONGO_PASSWORD: str = os.getenv("MONGO_PASSWORD")
MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME")

FRONTEND_URL: str = os.getenv("FRONTEND_URL")

TEMPLATE_FOLDER: str = os.getenv("TEMPLATE_FOLDER")
APP_HOST: str = os.getenv("APP_HOST")
APP_PORT: int = _parse_to_int(os.getenv("APP_PORT"))
DEBUG: bool = _parse_to_bool(os.getenv("DEBUG", "False"))

APP_SECRET: str = os.getenv("APP_SECRET")
JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY")
JWT_ACCESS_TOKEN_EXPIRES: int = _parse_to_int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES"))
JWT_REFRESH_TOKEN_EXPIRES: int = _parse_to_int(os.getenv("JWT_REFRESH_TOKEN_EXPIRES"))
RESET_PASS_TOKEN_MAX_AGE: int = _parse_to_int(os.getenv("RESET_PASS_TOKEN_MAX_AGE"))

GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_DISCOVERY_URL: str = os.getenv("GOOGLE_DISCOVERY_URL")

MAX_CONTENT_LENGTH: int = _parse_to_int(os.getenv("MAX_CONTENT_LENGTH"))

MAIL_SERVER: str = os.getenv("MAIL_SERVER")
MAIL_PORT: int = _parse_to_int(os.getenv("MAIL_PORT"))
MAIL_USE_TLS: bool = _parse_to_bool(os.getenv("MAIL_USE_TLS"))
MAIL_USE_SSL: bool = _parse_to_bool(os.getenv("MAIL_USE_SSL"))
MAIL_USERNAME: str = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD: str = os.getenv("MAIL_PASSWORD")
MAIL_DEFAULT_SENDER: str = os.getenv("MAIL_DEFAULT_SENDER")

SWAGGER_URL: str = os.getenv("SWAGGER_URL")
SWAGGER_UI_URL: str = os.getenv("SWAGGER_UI_URL")
