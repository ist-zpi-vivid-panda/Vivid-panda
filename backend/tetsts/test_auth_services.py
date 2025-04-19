import pytest
from blueprints.auth.services import send_reset_password_email, validate_reset_password_token
from blueprints.user.models import UserModel
from unittest.mock import patch, MagicMock
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadSignature


@pytest.fixture
def user():
    return UserModel(
        uid="user_id",
        email="test@example.com",
        username="testuser",
        password_hash="hashedpassword",
        provider="LOCAL"
    )


def test_send_reset_password_email(user):
    with patch("flask_mailman.EmailMessage.send") as mock_send:
        send_reset_password_email(user)
        mock_send.assert_called_once()


def test_validate_reset_password_token(user):
    serializer = URLSafeTimedSerializer("secret_key")
    token = serializer.dumps(user.uid, salt=user.password_hash)

    with patch("blueprints.auth.services.URLSafeTimedSerializer") as mock_serializer:
        mock_serializer.return_value = serializer
        validated_user = validate_reset_password_token(token, user.uid)
        assert validated_user == user


def test_validate_reset_password_token_expired(user):
    with patch("blueprints.auth.services.URLSafeTimedSerializer.loads", side_effect=SignatureExpired("Token expired")):
        assert validate_reset_password_token("expired_token", user.uid) is None


def test_validate_reset_password_token_invalid(user):
    with patch("blueprints.auth.services.URLSafeTimedSerializer.loads", side_effect=BadSignature("Invalid token")):
        assert validate_reset_password_token("invalid_token", user.uid) is None
