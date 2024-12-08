#Nie działa :(
import pytest
from flask import Flask
from io import BytesIO
from flask_jwt_extended import JWTManager, create_access_token

class MockUser:
    """Mock user object to mimic the UserModel class."""
    def __init__(self, uid, email, username="test_user", provider=0, profile_picture_grid_fs_id=None):
        self.uid = uid
        self.email = email
        self.username = username
        self.provider = provider
        self.profile_picture_grid_fs_id = profile_picture_grid_fs_id

    def get_dto(self):
        """Return a dictionary representation of the user."""
        return {
            "id": self.uid,
            "email": self.email,
            "username": self.username,
            "provider": self.provider,
        }

@pytest.fixture
def app():
    """
    Fixture to create and configure a Flask app instance.
    """
    from blueprints.user.routes import users_blueprint

    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = "test-secret"  # Dummy secret key for JWT
    app.config["JWT_TOKEN_LOCATION"] = ["headers"]  # JWT expected in headers

    jwt = JWTManager(app)  # Initialize the JWT manager

    @jwt.user_lookup_loader
    def user_lookup_callback(jwt_header, jwt_data):
        # Simulate user lookup from identity
        identity = jwt_data["sub"]
        return MockUser(uid=identity["id"], email=identity["email"])

    app.register_blueprint(users_blueprint, url_prefix="/users")
    app.testing = True
    return app

@pytest.fixture
def client(app):
    """
    Fixture to create a test client with an application context.
    """
    with app.app_context():  # Ensures app context is active
        yield app.test_client()

@pytest.fixture
def auth_headers(app):
    """
    Fixture to provide Authorization headers with a valid JWT.
    """
    with app.app_context():  # Needed to create tokens within app context
        access_token = create_access_token(identity={"id": "test_user", "email": "test@example.com"})
    return {"Authorization": f"Bearer {access_token}"}

def test_get_user(client, auth_headers):
    """
    Test the GET /users/ endpoint.
    """
    response = client.get("/users/", headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert "id" in data
    assert "email" in data
    assert "username" in data
    assert "provider" in data

def test_get_user_profile_picture(client, auth_headers):
    """
    Test the GET /users/profile-picture endpoint.
    """
    response = client.get("/users/profile-picture", headers=auth_headers)
    assert response.status_code == 200
    data = response.get_json()
    assert "data" in data
    # Add specific assertions if you expect certain values

def test_upsert_user_profile_picture(client, auth_headers):
    """
    Test the POST /users/profile-picture endpoint.
    """
    # Mock file upload
    data = {
        "file": (BytesIO(b"dummy file content"), "test_picture.jpg"),
    }
    response = client.post(
        "/users/profile-picture",
        headers=auth_headers,
        data=data,
        content_type="multipart/form-data",
    )
    assert response.status_code in [200, 400]  # Depending on the test case
    data = response.get_json()
    if response.status_code == 200:
        assert "success" in data and data["success"] is True
    else:
        assert "error" in data

def test_get_user_invalid_method(client, auth_headers):
    """
    Test invalid method (POST instead of GET) on /users/.
    """
    response = client.post("/users/", headers=auth_headers)
    assert response.status_code == 405  # Method not allowed
