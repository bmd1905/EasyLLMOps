from fastapi import APIRouter, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.responses import Response
from openai import APIConnectionError

from src import logger
from src.configs.prompt_config.prompt_loader import prompt_loader
from src.llms.litellm import generate_response
from src.schemas.prompt_schema import PromptRequest, PromptType

# Create an APIRouter instance for the chatbot routes
promptalchemy_router = APIRouter(
    prefix='/api/promptalchemy',
    tags=['promptalchemy'],
    responses={404: {'description': 'Not found'}},
)


def load_and_format_prompt(prompt_type: PromptType, init_prompt: str) -> tuple[str, str]:
    """
    Loads and formats the prompt based on the prompt type.

    :param prompt_type: The prompt type.
    :param init_prompt: The initial prompt.

    :return: The formatted prompt and system prompt.
    """
    optimized_prompt = prompt_loader.get_prompt(prompt_type)
    return optimized_prompt.PROMPT_TEMPLATE.format(prompt=init_prompt), optimized_prompt.SYSTEM_PROMPT


@promptalchemy_router.post('/generate')
async def handle_request(request: PromptRequest) -> Response:
    """
    Handles a prompt request and returns the generated response.

    :param request: The prompt request object.

    :return: The generated response.
    """
    try:
        init_prompt = request.prompt
        prompt_type = request.prompt_type

        logger.info(f'Request received - Prompt: "{init_prompt}", Prompt Type: "{prompt_type}"')

        # Load and format the prompt
        formatted_prompt, system_prompt = load_and_format_prompt(prompt_type, init_prompt)

        # ------------------------------- Step 1: Enhance Prompt -------------------------------"
        enhanced_prompt = generate_response(
            prompt=formatted_prompt,
            model='gpt-4o-mini',
            system_prompt=system_prompt,
            parse=True,
            prompt_type=prompt_type,
        )

        # ------------------------------- Step 2: Generate Response -------------------------------
        final_response = generate_response(
            prompt=enhanced_prompt.final_prompt,
            model='gemini-flash',
        )

        return Response(content=final_response, media_type='text/plain')

    except RequestValidationError as e:
        logger.error(f'Validation error: {e}')
        raise HTTPException(status_code=422, detail=e.errors())

    except APIConnectionError as e:
        logger.error(f'API connection error: {e}')
        raise HTTPException(status_code=503, detail='Service Unavailable')

    except Exception as e:
        logger.error(f'An unexpected error occurred: {e}')
        raise HTTPException(status_code=500, detail='Internal Server Error')
