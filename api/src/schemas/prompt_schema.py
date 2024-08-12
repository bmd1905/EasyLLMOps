from enum import Enum

from pydantic import BaseModel, Field


class PromptModel(BaseModel):
    """Pydantic model for validating prompt structure."""

    NAME: str = Field(..., description='The name of the prompt.')
    DESCRIPTION: str = Field(..., description='The description of the prompt.')
    SYSTEM_PROMPT: str = Field(..., description='The system prompt for the user.')
    PROMPT_TEMPLATE: str = Field(..., description='The template string for the prompt.')


class PromptType(str, Enum):
    ENHANCE_PROMPT = 'enhance_prompt'
    FEW_SHOT_PROMPT = 'few_shot_prompt'
    CHAIN_OF_THOUGHT_PROMPT = 'chain_of_thought_prompt'


class PromptRequest(BaseModel):
    prompt: str
    prompt_type: PromptType = PromptType.ENHANCE_PROMPT
    model: str = 'gemini-flash'


class CompletionIn(BaseModel):
    prompt: str
    model: str = 'gemini-flash'
