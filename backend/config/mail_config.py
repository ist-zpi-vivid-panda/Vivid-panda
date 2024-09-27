from flask import Flask
from flask_mailman import Mail

from config.env_vars import (
    MAIL_DEFAULT_SENDER,
    MAIL_PASSWORD,
    MAIL_PORT,
    MAIL_SERVER,
    MAIL_USE_SSL,
    MAIL_USE_TLS,
    MAIL_USERNAME,
)


class MailConfig:
    def __new__(cls, app: Flask, mail: Mail) -> Mail:
        app.config["MAIL_SERVER"] = MAIL_SERVER
        app.config["MAIL_PORT"] = MAIL_PORT
        app.config["MAIL_USE_TLS"] = MAIL_USE_TLS
        app.config["MAIL_USE_SSL"] = MAIL_USE_SSL
        app.config["MAIL_USERNAME"] = MAIL_USERNAME
        app.config["MAIL_PASSWORD"] = MAIL_PASSWORD
        app.config["MAIL_DEFAULT_SENDER"] = MAIL_DEFAULT_SENDER

        mail.init_app(app)

        return mail
