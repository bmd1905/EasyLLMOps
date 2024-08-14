from typing import List

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from src import logger
from src.configs.prompt_config.prompt_loader import prompt_loader
from src.llms.litellm import generate_response
from src.schemas.prompt_schema import PromptType

# Create an APIRouter instance for the chatbot routes
conversation_router = APIRouter(
    prefix='/api/promptalchemy_conversation',
    tags=['promptalchemy_conversation'],
    responses={404: {'description': 'Not found'}},
)


class ConversationRequest(BaseModel):
    prompt_type: PromptType
    message: str
    history: List[List[str]]
    stream: bool = False
    latest_prompt: str = ''


def load_and_format_prompt(prompt_type: PromptType, init_prompt: str) -> tuple[str, str]:
    optimized_prompt = prompt_loader.get_prompt(prompt_type)
    return optimized_prompt.PROMPT_TEMPLATE.format(prompt=init_prompt), optimized_prompt.SYSTEM_PROMPT


@conversation_router.post('/conversation')
async def conversation_endpoint(data: ConversationRequest):
    # Parse the request data
    prompt_type = data.prompt_type
    message = data.message
    history = data.history
    stream = data.stream
    latest_prompt = data.latest_prompt

    try:
        # Load and format the prompt
        formatted_latest_prompt, system_prompt = load_and_format_prompt(prompt_type, latest_prompt)

        # ------------------------------- Step 1: Enhance Prompt (Only for the first prompt) -------------------------------
        if not history:  # Check if history is empty (first prompt)
            logger.info(f'Enhancing prompt with latest prompt: "{formatted_latest_prompt}"')
            enhanced_prompt = await generate_response(
                prompt=formatted_latest_prompt,
                model='gpt-4o-mini',
                system_prompt=system_prompt,
                parse=True,
                prompt_type=prompt_type,
            )
            final_prompt = enhanced_prompt.final_prompt
        else:
            final_prompt = message  # Use the original message for subsequent prompts

        # ------------------------------- Step 2: Generate Response -------------------------------
        logger.info(f'Generating response with prompt: "{final_prompt}"')
        response = await generate_response(
            prompt=final_prompt,  # Use the final prompt (enhanced or original)
            model='gemini-flash',
            stream=False,
            history=history,  # Pass history to generate_response
        )
        return {'response': response}

    except Exception as e:
        logger.error(f'Error in conversation endpoint: {e}')
        raise HTTPException(status_code=500, detail=f'An Error occurred: {str(e)}')
