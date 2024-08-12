from fastapi import APIRouter
from fastapi.responses import Response, StreamingResponse

from src import logger
from src.llms.litellm import generate_response
from src.schemas.prompt_schema import CompletionIn

# Create an APIRouter instance for the chatbot routes
chatbot_router = APIRouter(
    prefix='/api/completion',
    tags=['completion'],
    responses={404: {'description': 'Not found'}},
)


# Endpoint to handle non-streamed prompt requests
@chatbot_router.post('/generate/')
def handle_request(request: CompletionIn) -> Response:
    """
    Handles a prompt request and returns the generated response.

    Args:
        request (PromptRequest): The prompt request object.

    Returns:
        Response: The generated response.
    """

    # Parse the request
    prompt = request.prompt
    logger.info(f'Got prompt: "{prompt}"')

    # Generate the response
    content = generate_response(prompt=prompt, model=request.model, stream=False)

    # Return the response content
    return Response(content=content, media_type='text/plain')


# Endpoint to handle streamed prompt requests
@chatbot_router.post('/generate/stream')
def handle_request_stream(request: CompletionIn) -> StreamingResponse:
    """
    Handles a prompt request and returns the generated response as a stream.

    :param request: The prompt request object.

    :return: The generated response as a stream.
    """

    #  Parse the request
    prompt = request.prompt
    model = request.model

    logger.info(f'Request received - Prompt: "{prompt}", Model: "{model}"')

    # Generate the response as a stream
    response = generate_response(prompt=prompt, model=model, stream=True)

    def generate():
        """
        Generator function to yield the response chunks.
        """
        try:
            for chunk in response:  # Iterate over the response chunks
                if chunk.choices[0].delta.content is not None:  # Check for content in the chunk
                    yield chunk.choices[0].delta.content  # Yield the content
        except Exception as e:
            logger.error(f'Error streaming response: {e}')  # Log any streaming errors
            yield 'Error processing stream.'  # Yield an error message

    return StreamingResponse(generate(), media_type='text/plain')  # Return the streaming response
