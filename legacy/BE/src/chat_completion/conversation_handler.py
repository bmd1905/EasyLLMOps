from fastapi.responses import StreamingResponse

from src.configs.prompt_config import DEFAULT_SYSTEM_PROMPT
from src.configs.prompt_config.prompt_loader import PROMPT_TEMPLATES
from src.interfaces import PromptEnhancer
from src.llms.litellm import generate_llm_response
from src.schemas.prompt_schema import ConversationIn


class ConversationHandler:
    """The conversation handler for the EasyLLMOps API."""

    def __init__(self, prompt_enhancer: PromptEnhancer, model: str):
        """
        Initializes the conversation handler with the prompt enhancer and model.

        :param prompt_enhancer: The prompt enhancer to use
        :param model: The model to use for the conversation
        """
        self.prompt_enhancer = prompt_enhancer
        self.model = model

    async def handle_conversation(self, data: ConversationIn):
        """
        Handles the conversation endpoint for the EasyLLMOps API.

        :param data: The conversation data

        :return: The response from the conversation
        """
        prompt_type = data.prompt_type
        message = data.message
        history = data.history
        latest_prompt = data.latest_prompt

        # Format the latest prompt
        formatted_latest_prompt = PROMPT_TEMPLATES[prompt_type].format(prompt=latest_prompt)

        # Enhance the prompt
        final_prompt = (
            await self.prompt_enhancer.apply(prompt_type, formatted_latest_prompt) if not history else message
        )

        # Generate the response for the conversation
        return await self.generate_conversation_response(
            model=self.model,
            history=history,
            prompt=final_prompt,
            system_prompt=DEFAULT_SYSTEM_PROMPT,
        )

    async def generate_conversation_response(self, model: str, prompt: str, system_prompt: str, history: list):
        """
        Generates a response for the conversation.

        :param model: The model to use for the conversation
        :param prompt: The prompt for the conversation
        :param system_prompt: The system prompt for the conversation
        :param history: The conversation history

        :return: The response from the conversation
        """

        async def stream_generator():
            """
            Generates a stream of responses for the conversation.

            :return: The stream of responses
            """
            response = await generate_llm_response(
                prompt=prompt, model=model, system_prompt=system_prompt, history=history, stream=True, json_mode=False
            )
            async for chunk in response:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content

        return StreamingResponse(stream_generator(), media_type='text/event-stream')
