from app import create_app
from config.env_vars import BACKEND_PORT, DEBUG, IP_ADDRESS

app = create_app()


if __name__ == "__main__":
    app.run(host=IP_ADDRESS, port=BACKEND_PORT, debug=DEBUG)
