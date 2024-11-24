import os

from dotenv import load_dotenv

load_dotenv(".env")

if os.path.exists("../.env"):
    load_dotenv("../.env", override=True)

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


SECRET_KEY: str = _read_env_string("SECRET_KEY")
IP_ADDRESS: str = _read_env_string("IP_ADDRESS")
AI_MICROSERVICE_PORT: int = _read_env_int("AI_MICROSERVICE_PORT")

MAX_CONTENT_LENGTH: int = _read_env_int("MAX_CONTENT_LENGTH")

DEBUG: bool = _read_env_bool("DEBUG")
