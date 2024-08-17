from src.configs.prompt_config.prompt_loader import SYSTEM_PROMPTS
from src.interfaces import PromptEnhancer
from src.llms.litellm import generate_llm_response


class DefaultPromptEnhancer(PromptEnhancer):
    """The default prompt enhancer for the conversation handler."""

    async def apply(self, prompt_type: str, latest_prompt: str) -> str:
        """
        Enhances the prompt using the default prompt enhancer.

        :param prompt_type: The type of prompt to enhance
        :param latest_prompt: The latest prompt in the conversation

        :return: The enhanced prompt
        """
        response = await generate_llm_response(
            prompt=latest_prompt,
            model='gemini-flash',
            system_prompt=SYSTEM_PROMPTS[prompt_type],
            prompt_type=prompt_type,
            json_mode=True,
        )
        return response.final_prompt
