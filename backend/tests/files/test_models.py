#działa
import pytest
from datetime import datetime
from bson import ObjectId

from blueprints.files.models import FileInfoModel


@pytest.fixture
def file_info():
    return FileInfoModel(
        file_id="507f1f77bcf86cd799439011",
        filename="test.txt",
        mime_type="text/plain",
        file_size=12345,
        uploaded_at=datetime.now(),
        last_update_at=datetime.now(),
        owner_id="507f1f77bcf86cd799439012",
        grid_fs_id="507f1f77bcf86cd799439013"
    )


def test_file_info_initialization(file_info):
    assert file_info.file_id == "507f1f77bcf86cd799439011"
    assert file_info.filename == "test.txt"
    assert file_info.mime_type == "text/plain"


def test_get_dict_repr(file_info):
    repr_dict = file_info.get_dict_repr()
    assert repr_dict["_id"] == ObjectId("507f1f77bcf86cd799439011")
    assert repr_dict["filename"] == "test.txt"


def test_get_dto(file_info):
    dto = file_info.get_dto()
    assert dto["id"] == "507f1f77bcf86cd799439011"
    assert dto["filename"] == "test.txt"
