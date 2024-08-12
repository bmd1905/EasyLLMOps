from fastapi import HTTPException
from openai import APIError, RateLimitError

from src import logger
from src.configs.litellm_config import litellm_config
from src.llms.base import client


def generate_response(prompt: str, model: str, system_prompt: str = '', stream: bool = False) -> str:
    """
    Generate a response from the LLM.

    :param prompt: The user prompt.
    :param model: The LLM model to use.
    :param system_prompt: The system prompt.
    :param stream: Whether to stream the response or not.

    :return: The response from the LLM.
    """
    response = create_chat_response(prompt, model=model, system_prompt=system_prompt, stream=stream)

    # Return the response as a stream
    if stream:
        return response

    # Return the response content
    return response.choices[0].message.content


def create_chat_response(
    prompt: str, model: str = 'gemini-flash', system_prompt: str = '', stream: bool = False
) -> dict:
    """
    Create a chat response from the LLM.

    :param prompt: The user prompt.
    :param model: The LLM model to use.
    :param system_prompt: The system prompt.
    :param stream: Whether to stream the response or not.

    :return: The response from the LLM.
    """
    try:
        response = client.chat.completions.create(
            model=model,
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': prompt},
            ],
            stream=stream,
            **litellm_config.GENERATION_CONFIG,
        )
        return response
    except RateLimitError as e:
        logger.error(f'Rate limit exceeded: {e}')
        raise HTTPException(status_code=429, detail='Rate limit exceeded')
    except APIError as e:
        logger.error(f'OpenAI API error: {e}')
        raise HTTPException(status_code=500, detail='Internal Server Error: OpenAI API Error')
    except Exception as e:
        logger.error(f'Error creating chat response: {e}')
        raise HTTPException(status_code=500, detail='Internal Server Error')
