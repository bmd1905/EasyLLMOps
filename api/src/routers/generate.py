from fastapi import APIRouter, HTTPException
from fastapi.responses import Response, StreamingResponse

from src import logger
from src.llms.base import client
from src.schemas.prompt_schema import PromptRequest

# Create an APIRouter instance for the chatbot routes
chatbot_router = APIRouter(
    prefix='/api/promptalchemy',
    tags=['promptalchemy'],
    responses={404: {'description': 'Not found'}},
)


# Function to create a chat response, handling both streamed and non-streamed responses
def create_chat_response(prompt: str, stream: bool) -> dict:
    """
    Creates a chat response using the specified prompt and streaming option.

    Args:
        prompt (str): The user prompt.
        stream (bool): Whether to stream the response or not.

    Returns:
        dict: The response from the LLM.

    Raises:
        HTTPException: If there is an error creating the chat response.
    """
    try:
        response = client.chat.completions.create(
            model='gemini-flash',  # Use the 'gemini-flash' model
            messages=[{'role': 'user', 'content': prompt}],  # Send the prompt as a user message
            stream=stream,  # Enable streaming if specified
        )
        return response  # Return the response from the LLM
    except Exception as e:
        logger.error(f'Error creating chat response: {e}')  # Log the error
        raise HTTPException(status_code=500, detail='Internal Server Error')  # Raise a 500 error


# Endpoint to handle non-streamed prompt requests
@chatbot_router.post('/generate/')
def handle_request(request: PromptRequest) -> Response:
    """
    Handles a prompt request and returns the generated response.

    Args:
        request (PromptRequest): The prompt request object.

    Returns:
        Response: The generated response.
    """
    prompt = request.prompt  # Get the prompt from the request
    logger.info(f'Got prompt: "{prompt}"')  # Log the prompt

    response = create_chat_response(prompt, stream=False)  # Create a non-streamed response
    content = response.choices[0].message.content  # Get the generated content

    return Response(content=content, media_type='text/plain')  # Return the content as plain text


# Endpoint to handle streamed prompt requests
@chatbot_router.post('/generate/stream')
def handle_request_stream(request: PromptRequest) -> StreamingResponse:
    """
    Handles a prompt request and returns the generated response as a stream.

    Args:
        request (PromptRequest): The prompt request object.

    Returns:
        StreamingResponse: The generated response as a stream.
    """
    prompt = request.prompt  # Get the prompt from the request
    logger.info(f'Got prompt: "{prompt}"')  # Log the prompt

    response = create_chat_response(prompt, stream=True)  # Create a streamed response

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
