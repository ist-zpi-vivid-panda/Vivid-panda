import os

from flask import send_from_directory

from app import create_app
from config.env_vars import APP_HOST, APP_PORT, DEBUG

# app
app = create_app()


@app.route("/favicon.ico")
def favicon():
    return send_from_directory(
        os.path.join(app.root_path, "static"), "favicon.ico", mimetype="image/vnd.microsoft.icon"
    )


if __name__ == "__main__":
    app.run(host=APP_HOST, port=APP_PORT, debug=DEBUG)
