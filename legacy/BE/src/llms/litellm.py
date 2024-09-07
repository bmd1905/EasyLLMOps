import json

from fastapi import HTTPException
from openai import APIError, RateLimitError

from src import logger
from src.configs.litellm_config import litellm_config
from src.llms.base import client
from src.schemas.prompt_schema import response_format_map


async def generate_llm_response(
    prompt: str,
    model: str = 'gemini-flash',
    system_prompt: str = '',
    stream: bool = False,
    prompt_type: str = None,
    history: list = None,
    json_mode: bool = False,
) -> str | dict:
    """
    Generates a response from the LLM, handling both streaming and non-streaming cases.

    :param prompt: The prompt to generate a response for
    :param model: The model to use for generating the response
    :param system_prompt: The system prompt to use for the conversation
    :param stream: Whether to stream the response
    :param prompt_type: The type of prompt to use
    :param history: The conversation history
    :param json_mode: Whether to return the response in JSON format

    :return: The generated response as a string or dictionary
    """
    try:
        # Create the messages list
        messages = [{'role': 'system', 'content': system_prompt}]
        if history:
            for turn in history:
                messages.append({'role': 'user', 'content': turn[0]})
                messages.append({'role': 'assistant', 'content': turn[1]})
        messages.append({'role': 'user', 'content': prompt})

        # Create the response format
        response_format = {'type': 'json_object'} if json_mode else None

        # Create the response
        response = await client.chat.completions.create(
            model=model,
            messages=messages,
            stream=stream,
            response_format=response_format,
            **litellm_config.GENERATION_CONFIG,
        )

        # Return the response if streaming
        if stream:
            return response

        # Parse the response
        dict_ = json.loads(response.choices[0].message.content)

        # Get the response format
        response_format = response_format_map.get(prompt_type) if prompt_type else None

        # Log and return the response
        if response_format:
            return response_format(**dict_)
        else:
            return response

    except RateLimitError as e:
        logger.error(f'Rate limit exceeded: {e}')
        raise HTTPException(status_code=429, detail='Rate limit exceeded')

    except APIError as e:
        logger.error(f'OpenAI API error: {e}')
        raise HTTPException(status_code=500, detail='Internal Server Error')

    except Exception as e:
        logger.error(f'Error creating chat response: {e}')
        raise HTTPException(status_code=500, detail='Internal Server Error')
