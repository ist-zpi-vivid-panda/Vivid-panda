from app import create_app
from config.env_vars import IP_ADDRESS, BACKEND_PORT, DEBUG

app = create_app()

if __name__ == "__main__":
    app.run(host=IP_ADDRESS, port=BACKEND_PORT, debug=DEBUG)
