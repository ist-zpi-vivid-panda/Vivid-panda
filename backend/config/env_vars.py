import os

from dotenv import load_dotenv

if os.path.exists("../.env"):
    load_dotenv("../.env")

load_dotenv(".env")
load_dotenv(".env.local", override=True)


def _read_env_bool(name: str) -> bool:
    return _read_env_string(name).lower() == "true"


def _read_env_int(name: str) -> int:
    try:
        return int(_read_env_string(name))
    except ValueError:
        raise Exception(f"Problem with parsing {name} to int for an environment variable")


def _read_env_string(name: str) -> str:
    data: str | None = os.getenv(name)

    if data is None:
        raise Exception(f"Couldn't read environment variable: {name}")

    return data


MONGO_HOST: str = _read_env_string("MONGO_HOST")
MONGO_PORT: int = _read_env_int("MONGO_PORT")
MONGO_USERNAME: str = _read_env_string("MONGO_USERNAME")
MONGO_PASSWORD: str = _read_env_string("MONGO_PASSWORD")
MONGO_DB_NAME: str = _read_env_string("MONGO_DB_NAME")

IP_ADDRESS: str = _read_env_string("IP_ADDRESS")

METHOD: str = _read_env_string("METHOD")
FRONTEND_PORT: str = _read_env_string("FRONTEND_PORT")

FRONTEND_URL: str = f"{METHOD}://{IP_ADDRESS}:{FRONTEND_PORT}"

BACKEND_PORT: int = _read_env_int("BACKEND_PORT")

TEMPLATE_FOLDER: str = _read_env_string("TEMPLATE_FOLDER")
DEBUG: bool = _read_env_bool("DEBUG")

APP_SECRET: str = _read_env_string("APP_SECRET")
JWT_SECRET_KEY: str = _read_env_string("JWT_SECRET_KEY")
JWT_ACCESS_TOKEN_EXPIRES: int = _read_env_int("JWT_ACCESS_TOKEN_EXPIRES")
JWT_REFRESH_TOKEN_EXPIRES: int = _read_env_int("JWT_REFRESH_TOKEN_EXPIRES")
RESET_PASS_TOKEN_MAX_AGE: int = _read_env_int("RESET_PASS_TOKEN_MAX_AGE")

GOOGLE_CLIENT_ID: str = _read_env_string("GOOGLE_CLIENT_ID")

MAX_CONTENT_LENGTH: int = _read_env_int("MAX_CONTENT_LENGTH")

MAIL_SERVER: str = _read_env_string("MAIL_SERVER")
MAIL_PORT: int = _read_env_int("MAIL_PORT")
MAIL_USE_TLS: bool = _read_env_bool("MAIL_USE_TLS")
MAIL_USE_SSL: bool = _read_env_bool("MAIL_USE_SSL")
MAIL_USERNAME: str = _read_env_string("MAIL_USERNAME")
MAIL_PASSWORD: str = _read_env_string("MAIL_PASSWORD")
MAIL_DEFAULT_SENDER: str = _read_env_string("MAIL_DEFAULT_SENDER")

SWAGGER_URL: str = _read_env_string("SWAGGER_URL")
SWAGGER_UI_URL: str = _read_env_string("SWAGGER_UI_URL")

AI_MICROSERVICE_API_URL = _read_env_string("AI_MICROSERVICE_API_URL")
AI_MICROSERVICE_API_KEY = _read_env_string("AI_MICROSERVICE_API_KEY")
