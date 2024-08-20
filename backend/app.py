from flask import Flask

# main.py
from flask import Flask, render_template

app = Flask(__name__, template_folder='templates')


@app.route('/')
def login():
    return render_template('logging_page.html')


@app.route('/register')
def register():
    return render_template('register.html')


@app.route('/forgot-password')
def forgot_password():
    return render_template('forgot_password.html')


if __name__ == '__main__':
    app.run()
