from unittest.mock import MagicMock

import pytest
from image_processing.invoker import Invoker


def test_invoker_singleton() -> None:
    invoker1 = Invoker()
    invoker2 = Invoker()
    assert invoker1 is invoker2


def test_invoker_process_request() -> None:
    invoker = Invoker()
    mock_command = MagicMock()
    invoker.commands["mock_command"] = mock_command
    request = {"type": "mock_command", "params": {"param1": "value1"}}
    invoker.process_request(request)
    mock_command.execute.assert_called_once_with(param1="value1")


def test_invoker_process_request_unknown_command() -> None:
    invoker = Invoker()
    request = {"type": "unknown_command", "params": {}}
    with pytest.raises(ValueError, match="Unknown command type: unknown_command"):
        invoker.process_request(request)
