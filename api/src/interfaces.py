from abc import ABC, abstractmethod


class PromptEnhancer(ABC):
    @abstractmethod
    async def apply(self, prompt_type: str, latest_prompt: str) -> str:
        pass
