from unittest import TestCase
from unittest.mock import patch, MagicMock
from itsdangerous import SignatureExpired, BadSignature
from blueprints.auth.services import validate_reset_password_token
from config import env_vars
from config.env_vars import RESET_PASS_TOKEN_MAX_AGE


class TestValidateResetPasswordToken(TestCase):

    @patch("blueprints.auth.services.user_service.get_by_id")
    @patch("blueprints.auth.services.URLSafeTimedSerializer")
    def test_validate_reset_password_token_success(self, mock_serializer, mock_get_by_id):
        # Mocking a user
        mock_user = MagicMock()
        mock_user.uid = "12345"
        mock_user.password_hash = "hashed_password"
        mock_get_by_id.return_value = mock_user

        # Mocking successful token validation
        mock_serializer.return_value.loads.return_value = "12345"

        # Calling the function under test
        user = validate_reset_password_token("valid_token", "12345")

        # Verifying that the user is returned
        self.assertEqual(user, mock_user)
        mock_get_by_id.assert_called_once_with("12345")
        mock_serializer.return_value.loads.assert_called_once_with(
            "valid_token",
            max_age=env_vars.RESET_PASS_TOKEN_MAX_AGE,  # Ensure this value matches the actual configuration
            salt="hashed_password",
        )

    @patch("blueprints.auth.services.user_service.get_by_id")
    @patch("blueprints.auth.services.URLSafeTimedSerializer")
    def test_validate_reset_password_token_expired(self, mock_serializer, mock_get_by_id):
        # Mocking a user
        mock_user = MagicMock()
        mock_user.password_hash = "hashed_password"
        mock_get_by_id.return_value = mock_user

        # Mocking an expired token
        mock_serializer.return_value.loads.side_effect = SignatureExpired("Token expired")

        # Calling the function under test
        user = validate_reset_password_token("expired_token", "12345")

        # Verifying that None is returned
        self.assertIsNone(user)
        mock_get_by_id.assert_called_once_with("12345")
        mock_serializer.return_value.loads.assert_called_once_with(
            "expired_token",
            max_age=env_vars.RESET_PASS_TOKEN_MAX_AGE,
            salt="hashed_password",
        )

    @patch("blueprints.auth.services.user_service.get_by_id")
    @patch("blueprints.auth.services.URLSafeTimedSerializer")
    def test_validate_reset_password_token_invalid(self, mock_serializer, mock_get_by_id):
        # Mocking a user
        mock_user = MagicMock()
        mock_user.password_hash = "hashed_password"
        mock_get_by_id.return_value = mock_user

        # Mocking an invalid token
        mock_serializer.return_value.loads.side_effect = BadSignature("Invalid token signature")

        # Calling the function under test
        user = validate_reset_password_token("invalid_token", "12345")

        # Verifying that None is returned
        self.assertIsNone(user)
        mock_get_by_id.assert_called_once_with("12345")
        mock_serializer.return_value.loads.assert_called_once_with(
            "invalid_token",
            max_age=env_vars.RESET_PASS_TOKEN_MAX_AGE,
            salt="hashed_password",
        )
