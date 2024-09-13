import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()

MONGO_HOST: str = os.getenv("MONGO_HOST")
MONGO_PORT: int = int(os.getenv("MONGO_PORT"))
MONGO_USERNAME: str = os.getenv("MONGO_USERNAME")
MONGO_PASSWORD: str = os.getenv("MONGO_PASSWORD")
MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME")

FRONTEND_URL: str = os.getenv("FRONTEND_URL")

TEMPLATE_FOLDER: str = os.getenv("TEMPLATE_FOLDER")
APP_HOST: str = os.getenv("APP_HOST")
APP_PORT: int = int(os.getenv("APP_PORT"))
DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

APP_SECRET: str = os.getenv("APP_SECRET")
JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY")
JWT_ACCESS_TOKEN_EXPIRES: timedelta = timedelta(int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES")))
RESET_PASS_TOKEN_MAX_AGE: int = int(os.getenv("RESET_PASS_TOKEN_MAX_AGE"))

GOOGLE_CLIENT_ID: str = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET: str = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_DISCOVERY_URL: str = os.getenv("GOOGLE_DISCOVERY_URL")
