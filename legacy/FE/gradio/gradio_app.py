import json
from typing import AsyncGenerator

import gradio as gr
import requests

API_URL = "http://localhost:8000/api/promptalchemy_conversation/conversation"


def _prepare_api_data(
    message: str, history: list, prompt_type: str, stream: bool
) -> dict:
    """Prepares the data payload for the API request."""
    flattened_history = [item for sublist in history for item in sublist]
    return {
        "prompt_type": prompt_type,
        "message": message,
        "history": [
            [h, r] for h, r in zip(flattened_history[::2], flattened_history[1::2])
        ],
        "stream": stream,
        "latest_prompt": message,
    }


async def _handle_streaming_response(
    response: requests.Response,
) -> AsyncGenerator[str, None]:
    """Handles streaming response from the API."""
    accumulated_response = ""
    for chunk in response.iter_content(chunk_size=128, decode_unicode=True):
        if chunk:
            accumulated_response += chunk
            yield accumulated_response


async def _handle_non_streaming_response(response: requests.Response) -> str:
    """Handles non-streaming response from the API."""
    return response.json()["response"]


async def inference(
    message: str,
    history: list,
    prompt_type: str = "enhance_prompt",
    stream: bool = False,
) -> AsyncGenerator[str, None]:
    """
    Handles the inference logic for the chatbot, communicating with the backend API.

    :param message (str): The current user's message.
    :param history (list): A list of previous messages in the conversation.
    :param prompt_type (str, optional): The type of prompt to use. Defaults to "enhance_prompt".
    :param stream (bool, optional): Whether to stream the response back. Defaults to False.

    :return (AsyncGenerator[str, None]): Yields the response from the API, either streamed or in a single chunk.
    """
    try:
        data = _prepare_api_data(message, history, prompt_type, stream)
        print("Sending data:", json.dumps(data, indent=2))

        if stream:
            response = requests.post(API_URL, json=data, stream=True)
            response.raise_for_status()
            async for chunk in _handle_streaming_response(response):
                yield chunk
        else:
            response = requests.post(API_URL, json=data)
            response.raise_for_status()
            yield await _handle_non_streaming_response(response)

    except requests.exceptions.RequestException as e:
        print("Request Exception:", str(e))
        if e.response is not None:
            print("Response content:", e.response.text)
        yield f"An error occurred: {str(e)}"

    except Exception as e:
        print("Exception encountered:", str(e))
        yield "An unexpected error occurred. Please try again."


with gr.Blocks(theme="JohnSmith9982/small_and_pretty") as demo:
    # Define prompt_type and stream_checkbox before the ChatInterface
    stream_checkbox = gr.Checkbox(label="Enable Streaming", value=False)
    prompt_type = gr.Dropdown(
        [
            "enhance_prompt",
            "few_shot_prompt",
            "chain_of_thought_prompt",
            "structure_output_prompt",
        ],
        label="Prompt Type",
        value="enhance_prompt",
    )

    with gr.Row():
        with gr.Column(scale=3):
            # Create the chat interface
            chatbot = gr.ChatInterface(
                inference,
                chatbot=gr.Chatbot(height=600),
                textbox=gr.Textbox(
                    placeholder="Enter text here...", container=False, scale=5
                ),
                title="Simple Chatbot Test Application",
                examples=[
                    ["Define 'deep learning' in one sentence."],
                    [
                        "What is the difference between 'machine learning' and 'deep learning'?"
                    ],
                ],
                retry_btn="Retry",
                undo_btn="Undo",
                clear_btn="Clear",
                additional_inputs=[
                    prompt_type,
                    stream_checkbox,
                ],  # Now they are defined
            )

        with gr.Column(scale=1):
            # Configuration panel
            with gr.Accordion("Run settings", open=True):
                stream_checkbox = gr.Checkbox(label="Enable Streaming", value=False)
                # Add other configuration options like Model, Token Count, Temperature etc. here.
                model_select = gr.Dropdown(["Model A", "Model B"], label="Model")
                token_count = gr.Slider(0, 1024, value=512, label="Token Count")
                temperature = gr.Slider(0, 1, value=0.7, label="Temperature")

demo.launch()
