from app import create_app
from env_vars import APP_HOST, APP_PORT, DEBUG

# app
app = create_app()


if __name__ == "__main__":
    app.run(host=APP_HOST, port=APP_PORT, debug=DEBUG)