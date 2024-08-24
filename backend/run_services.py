# service singletons
from blueprints.auth.services import UserService
from blueprints.files.services import FileInfoService

user_service = UserService()
file_service = FileInfoService()
