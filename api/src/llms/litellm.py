import json

from fastapi import HTTPException
from openai import APIError, RateLimitError
from pydantic import BaseModel

from src import logger
from src.configs.litellm_config import litellm_config
from src.llms.base import client
from src.schemas.prompt_schema import PromptAlchemyOut, response_format_map


def content_to_json(content: str) -> dict:
    """
    Convert the content to a JSON object.

    :param content: The content to convert.

    :return: The JSON object.
    """
    try:
        # Remove the leading/trailing quotes and newlines
        return json.loads(content[7:-3])
    except json.JSONDecodeError as e:
        logger.error(f'Error converting content to JSON: {e}, Content: {content}')
        raise HTTPException(status_code=500, detail='Internal Server Error: Invalid JSON')


def generate_response(
    prompt: str,
    model: str,
    system_prompt: str = '',
    stream: bool = False,
    parse: bool = False,
    prompt_type: str = None,
) -> str | dict:
    """
    Generate a response from the LLM.

    :param prompt: The user prompt.
    :param model: The LLM model to use.
    :param system_prompt: The system prompt.
    :param stream: Whether to stream the response or not.
    :param parse: Whether to parse the response as JSON.
    :param prompt_type: The prompt type.

    :return: The response from the LLM.
    """

    # Get the response format based on the prompt type
    response_format = response_format_map.get(prompt_type) if prompt_type else None

    # Create the chat response
    response = create_chat_response(prompt, model, system_prompt, stream, parse=parse, response_format=response_format)

    # Return the response in the specified format
    if stream:
        return response

    # Parse the response content as JSON
    if parse:
        return response.choices[0].message.parsed

    return response.choices[0].message.content


def create_chat_response(
    prompt: str,
    model: str = 'gemini-flash',
    system_prompt: str = '',
    stream: bool = False,
    parse: bool = False,
    response_format: BaseModel = None,
) -> dict:
    """
    Create a chat response from the LLM.

    :param prompt: The user prompt.
    :param model: The LLM model to use.
    :param system_prompt: The system prompt.
    :param stream: Whether to stream the response or not.
    :param parse: Whether to parse the response as JSON.
    :param response_format: The response format.

    :return: The response from the LLM.
    """
    try:
        if parse:
            return client.beta.chat.completions.parse(
                model=model,
                messages=[
                    {'role': 'system', 'content': system_prompt},
                    {'role': 'user', 'content': prompt},
                ],
                response_format=response_format,
                **litellm_config.GENERATION_CONFIG,
            )

        return client.chat.completions.create(
            model=model,
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': prompt},
            ],
            stream=stream,
            **litellm_config.GENERATION_CONFIG,
        )
    except RateLimitError as e:
        logger.error(f'Rate limit exceeded: {e}')
        raise HTTPException(status_code=429, detail='Rate limit exceeded')

    except APIError as e:
        logger.error(f'OpenAI API error: {e}')
        raise HTTPException(status_code=500, detail='Internal Server Error: OpenAI API Error')

    except Exception as e:
        logger.error(f'Error creating chat response: {e}')
        raise HTTPException(status_code=500, detail='Internal Server Error')
