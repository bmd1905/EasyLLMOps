from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from src import logger
from src.configs.prompt_config.prompt_loader import PROMPT_TEMPLATES, SYSTEM_PROMPTS
from src.llms.litellm import generate_response_non_stream, generate_response_stream
from src.schemas.prompt_schema import ConversationIn

# Create an APIRouter instance for the chatbot routes
conversation_router = APIRouter(
    prefix='/api/promptalchemy_conversation',
    tags=['promptalchemy_conversation'],
    responses={404: {'description': 'Not found'}},
)


async def enhance_prompt(prompt_type: str, latest_prompt: str) -> str:
    """Enhances the initial prompt using a smaller language model."""
    logger.info(f'Enhancing prompt with latest prompt: "{latest_prompt}"')
    enhanced_prompt = await generate_response_non_stream(
        prompt=latest_prompt,
        model='gpt-4o-mini',
        system_prompt=SYSTEM_PROMPTS[prompt_type],
        parse=True,
        prompt_type=prompt_type,
    )
    return enhanced_prompt.final_prompt


async def generate_streaming_response(final_prompt: str, history: list):
    """Generates a streaming response using the specified language model."""

    async def stream_generator():
        """Async generator function for streaming the response."""
        chunk_count = 0
        async for chunk in generate_response_stream(
            prompt=final_prompt,
            model='gemini-flash',
            history=history,
        ):
            if chunk.choices[0].delta.content is not None:
                chunk_count += 1
                yield chunk.choices[0].delta.content
            logger.info(f'Streamed {chunk_count} chunks.')

    return StreamingResponse(stream_generator(), media_type='text/event-stream')


async def generate_non_streaming_response(final_prompt: str, history: list):
    """Generates a non-streaming response using the specified language model."""
    response = await generate_response_non_stream(
        prompt=final_prompt,
        model='gemini-flash',
        history=history,
    )
    return {'response': response}


@conversation_router.post('/conversation')
async def conversation_endpoint(data: ConversationIn):
    """
    Endpoint for handling conversation requests.

    This endpoint receives a ConversationIn object containing the prompt type, message, history,
    stream flag, and latest prompt. It processes the request, generates a response using the specified
    language model and prompt configuration, and returns the response either as a full response or a
    streaming response depending on the stream flag.

    :param data (ConversationIn): The request data containing the prompt type, message, history, stream flag,
                                    and latest prompt.

    :return: The generated response, either as a dictionary or a streaming response.

    :raises HTTPException: If an error occurs during the conversation processing.
    """
    # Parse the request data
    prompt_type = data.prompt_type
    message = data.message
    history = data.history
    stream = data.stream
    latest_prompt = data.latest_prompt

    try:
        # Load and format the prompt
        formatted_latest_prompt = PROMPT_TEMPLATES[prompt_type].format(prompt=latest_prompt)

        # Enhance Prompt (Only for the first prompt)
        if not history:
            final_prompt = await enhance_prompt(prompt_type, formatted_latest_prompt)
        else:
            final_prompt = message  # Use the original message for subsequent prompts

        # Generate Response
        logger.info(f'Generating response with prompt: "{final_prompt}"')

        if stream:
            return await generate_streaming_response(final_prompt, history)
        else:
            return await generate_non_streaming_response(final_prompt, history)

    except Exception as e:
        logger.error(f'Error in conversation endpoint: {e}')
        raise HTTPException(status_code=500, detail=f'An Error occurred: {str(e)}')
