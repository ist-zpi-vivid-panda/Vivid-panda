from flask import Blueprint, jsonify, render_template
from flask_jwt_extended import get_jwt_identity, jwt_required

core = Blueprint("core", __name__, template_folder="templates")


def register_routes(app):
    @app.route("/protected", methods=["GET"])
    @jwt_required()
    def protected():
        current_user = get_jwt_identity()
        return jsonify(logged_in_as=current_user), 200

    @app.route("/")
    def login():
        return render_template("logging_page.html")

    @app.route("/register")
    def register():
        return render_template("register.html")

    @app.route("/forgot-password")
    def forgot_password():
        return render_template("forgot_password.html")

    # path params
    @app.route("/add/<int:number1>/<int:number2>")
    def add(number1: int, number2: int):
        return f"{number1} + {number2} = {number1 + number2}"

    # string query params
    @app.route("/handle_url_params")
    def handle_url_params():
        return ""
