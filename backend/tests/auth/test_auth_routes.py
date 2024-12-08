import unittest
from unittest.mock import patch, MagicMock
from werkzeug.security import generate_password_hash
from app import create_app


class TestRoutes(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Create a Flask application and test client
        cls.app = create_app()
        cls.app.config['TESTING'] = True
        cls.client = cls.app.test_client()

    def setUp(self):
        # Clear registered components to avoid DuplicateComponentNameError
        if hasattr(self.app, "apispec"):
            self.app.apispec.components = {}
            self.app.apispec._definitions = {}

    @unittest.skip("Skipping test as it is not functional yet")
    @patch('blueprints.auth.routes.user_service.get_by_email')
    def test_login_user_success(self, mock_get_by_email):
        # Mock a user
        mock_user = MagicMock()
        mock_user.password_hash = generate_password_hash("Password123!")
        mock_user.provider = "LOCAL"
        mock_get_by_email.return_value = mock_user

        # Test login request
        response = self.client.post('/auth/login', json={'email': 'test@example.com', 'password': 'Password123!'})
        print("Status Code:", response.status_code)
        print("Response JSON:", response.get_json())  # Debugging

        # Check successful response
        self.assertEqual(response.status_code, 200)
        response_json = response.get_json()
        self.assertIn("access_token", response_json)

    @patch('blueprints.auth.routes.user_service.get_by_email')
    def test_login_user_invalid_credentials(self, mock_get_by_email):
        # Mock no user found
        mock_get_by_email.return_value = None

        # Test request with invalid credentials
        response = self.client.post('/auth/login', json={'email': 'wrong@example.com', 'password': 'wrongpassword'})
        print("Status Code:", response.status_code)
        print("Response JSON:", response.get_json())  # Debugging

        # Check authorization error response
        self.assertEqual(response.status_code, 401)
        response_json = response.get_json()
        self.assertIn("error", response_json)
        self.assertEqual(response_json.get("error"), "Invalid username or password")

    @patch('blueprints.auth.routes.user_service.insert')
    def test_register_user_success(self, mock_insert):
        # Mock successful registration
        mock_insert.return_value = True

        # Test registration request
        response = self.client.post('/auth/register', json={'email': 'new@example.com', 'username': 'newuser', 'password': 'Password123!'})
        print("Status Code:", response.status_code)
        print("Response JSON:", response.get_json())  # Debugging

        # Check successful response
        self.assertEqual(response.status_code, 200)
        response_json = response.get_json()
        self.assertIn("access_token", response_json)

    @patch('blueprints.auth.routes.user_service.insert')
    def test_register_user_email_exists(self, mock_insert):
        # Mock user already exists case
        mock_insert.return_value = None

        # Test registration request with existing email
        response = self.client.post('/auth/register', json={'email': 'existing@example.com', 'username': 'existinguser', 'password': 'Password123!'})
        print("Status Code:", response.status_code)
        print("Response JSON:", response.get_json())  # Debugging

        # Check error response
        self.assertEqual(response.status_code, 400)
        response_json = response.get_json()
        self.assertIn("error", response_json)
        self.assertEqual(response_json.get("error"), "Email already registered")
