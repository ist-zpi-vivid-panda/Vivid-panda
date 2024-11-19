import os.path

from flask import Flask, request
from flask_babel import Babel

BABEL_SUPPORTED_LOCALES = ["en", "pl"]
BABEL_DEFAULT_LOCALE = "en"
BABEL_TRANSLATION_DIRECTORIES = "./translations"


def get_locale():
    language = request.accept_languages.best_match(BABEL_SUPPORTED_LOCALES)

    if language is None:
        return BABEL_DEFAULT_LOCALE

    return language


def create_babel_config(app: Flask, babel: Babel) -> None:
    abs_path = os.path.abspath(BABEL_TRANSLATION_DIRECTORIES)

    if not os.path.exists(abs_path) or not os.path.isdir(abs_path):
        raise Exception("Incorrect babel translation directory")

    app.config["BABEL_DEFAULT_LOCALE"] = BABEL_DEFAULT_LOCALE
    app.config["BABEL_SUPPORTED_LOCALES"] = BABEL_SUPPORTED_LOCALES
    app.config["BABEL_TRANSLATION_DIRECTORIES"] = abs_path

    babel.init_app(app, locale_selector=get_locale)
