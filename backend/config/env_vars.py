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


def _read_env_string(name: str) -> str:
    data: str | None = os.getenv(name)

    if data is None:
        raise Exception(f"Couldn't read environment variable: {name}")

    return data


MONGO_HOST: str = _read_env_string("MONGO_HOST")
MONGO_PORT: int = _parse_to_int(_read_env_string("MONGO_PORT"))
MONGO_USERNAME: str = _read_env_string("MONGO_USERNAME")
MONGO_PASSWORD: str = _read_env_string("MONGO_PASSWORD")
MONGO_DB_NAME: str = _read_env_string("MONGO_DB_NAME")

FRONTEND_URL: str = _read_env_string("FRONTEND_URL")

TEMPLATE_FOLDER: str = _read_env_string("TEMPLATE_FOLDER")
APP_HOST: str = _read_env_string("APP_HOST")
APP_PORT: int = _parse_to_int(_read_env_string("APP_PORT"))
DEBUG: bool = _parse_to_bool(_read_env_string("DEBUG"))

APP_SECRET: str = _read_env_string("APP_SECRET")
JWT_SECRET_KEY: str = _read_env_string("JWT_SECRET_KEY")
JWT_ACCESS_TOKEN_EXPIRES: int = _parse_to_int(_read_env_string("JWT_ACCESS_TOKEN_EXPIRES"))
JWT_REFRESH_TOKEN_EXPIRES: int = _parse_to_int(_read_env_string("JWT_REFRESH_TOKEN_EXPIRES"))
RESET_PASS_TOKEN_MAX_AGE: int = _parse_to_int(_read_env_string("RESET_PASS_TOKEN_MAX_AGE"))

GOOGLE_CLIENT_ID: str = _read_env_string("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET: str = _read_env_string("GOOGLE_CLIENT_SECRET")
GOOGLE_DISCOVERY_URL: str = _read_env_string("GOOGLE_DISCOVERY_URL")

MAX_CONTENT_LENGTH: int = _parse_to_int(_read_env_string("MAX_CONTENT_LENGTH"))

MAIL_SERVER: str = _read_env_string("MAIL_SERVER")
MAIL_PORT: int = _parse_to_int(_read_env_string("MAIL_PORT"))
MAIL_USE_TLS: bool = _parse_to_bool(_read_env_string("MAIL_USE_TLS"))
MAIL_USE_SSL: bool = _parse_to_bool(_read_env_string("MAIL_USE_SSL"))
MAIL_USERNAME: str = _read_env_string("MAIL_USERNAME")
MAIL_PASSWORD: str = _read_env_string("MAIL_PASSWORD")
MAIL_DEFAULT_SENDER: str = _read_env_string("MAIL_DEFAULT_SENDER")

SWAGGER_URL: str = _read_env_string("SWAGGER_URL")
SWAGGER_UI_URL: str = _read_env_string("SWAGGER_UI_URL")
