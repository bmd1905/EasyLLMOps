from unittest.mock import MagicMock, patch

import pytest
from fastapi import HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.testclient import TestClient

from src.configs.prompt_config.prompt_loader import prompt_loader
from src.llms.base import client
from src.routers.promptalchemy import promptalchemy_router
from src.schemas.prompt_schema import PromptRequest, PromptType

# Create a TestClient for integration tests
test_client = TestClient(promptalchemy_router)

# Sample test data
mock_prompt_request = PromptRequest(prompt='Write a small blog post about AI', prompt_type='enhance_prompt')
mock_system_prompt = 'This is a system prompt.'
mock_prompt_template = 'Formatted: {prompt}'


# Fixture for mocking the prompt_loader.get_prompt
@pytest.fixture
def mock_get_prompt():
    with patch.object(prompt_loader, 'get_prompt') as mock_get_prompt:
        mock_prompt = MagicMock()
        mock_prompt.PROMPT_TEMPLATE = mock_prompt_template
        mock_prompt.SYSTEM_PROMPT = mock_system_prompt
        mock_get_prompt.return_value = mock_prompt
        yield mock_get_prompt


# Fixture for mocking the client.chat.completions.create
@pytest.fixture
def mock_create_chat_response():
    with patch('src.llms.base.client.chat.completions.create') as mock_create:
        mock_response = MagicMock()
        mock_response.choices = [MagicMock(message=MagicMock(content='Generated response'))]
        mock_create.return_value = mock_response
        yield mock_create


# Unit test for create_chat_response function
def test_create_chat_response_success(mock_create_chat_response):
    from src.llms.litellm import create_chat_response

    response = create_chat_response(prompt='Test', model='test-model', system_prompt='system')
    assert response.choices[0].message.content == 'Generated response'


def test_create_chat_response_exception(mock_create_chat_response):
    from src.llms.litellm import create_chat_response

    mock_create_chat_response.side_effect = Exception('Test error')

    with pytest.raises(HTTPException) as exc_info:
        create_chat_response(prompt='Test', model='test-model', system_prompt='system')
    assert exc_info.value.status_code == 500
    assert exc_info.value.detail == 'Internal Server Error'
