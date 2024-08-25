import os
from datetime import timedelta

from dotenv import load_dotenv

load_dotenv()

MONGO_HOST = os.getenv("MONGO_HOST")
MONGO_PORT = int(os.getenv("MONGO_PORT"))
MONGO_USERNAME = os.getenv("MONGO_USERNAME")
MONGO_PASSWORD = os.getenv("MONGO_PASSWORD")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")

FRONTEND_URL = os.getenv("FRONTEND_URL")

TEMPLATE_FOLDER = os.getenv("TEMPLATE_FOLDER")
APP_HOST = os.getenv("APP_HOST")
APP_PORT = int(os.getenv("APP_PORT"))
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

APP_SECRET = os.getenv("APP_SECRET")
JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
JWT_ACCESS_TOKEN_EXPIRES = timedelta(int(os.getenv("JWT_ACCESS_TOKEN_EXPIRES")))

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_DISCOVERY_URL = os.getenv("GOOGLE_DISCOVERY_URL")
