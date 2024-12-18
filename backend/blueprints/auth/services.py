from flask import render_template_string
from flask_mailman import EmailMessage
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from blueprints.user.models import UserModel
from config import env_vars
from config.env_vars import FRONTEND_URL
from emails_services.reset_password_email_html_content import reset_password_email_html_content
from run_services import user_service


def send_reset_password_email(user: UserModel) -> None:
    reset_password_url = (
        f"{FRONTEND_URL}/auth/change-password?token={user.generate_reset_password_token()}&user_id={user.uid}"
    )

    email_body = render_template_string(reset_password_email_html_content, reset_password_url=reset_password_url)

    message = EmailMessage(
        subject="Reset your password",
        body=email_body,
        to=[user.email],
    )
    message.content_subtype = "html"

    message.send()


def validate_reset_password_token(token: str, user_id: str) -> UserModel | None:
    user: UserModel | None = user_service.get_by_id(user_id)

    if user is None:
        return None

    serializer = URLSafeTimedSerializer(env_vars.APP_SECRET)

    try:
        token_user_id = serializer.loads(
            token,
            max_age=env_vars.RESET_PASS_TOKEN_MAX_AGE,
            salt=user.password_hash,
        )
    except (BadSignature, SignatureExpired):
        return None

    if token_user_id != user.uid:
        return None

    return user
