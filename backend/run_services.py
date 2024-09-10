# service singletons
from blueprints.files.services import FileInfoService
from blueprints.user.services import UserService

user_service = UserService()
file_service = FileInfoService()
