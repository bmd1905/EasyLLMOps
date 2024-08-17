from enum import Enum
from typing import List

from pydantic import BaseModel, Field


class PromptModel(BaseModel):
    """Pydantic model for validating prompt structure."""

    NAME: str = Field(..., description='The name of the prompt.')
    DESCRIPTION: str = Field(..., description='The description of the prompt.')
    SYSTEM_PROMPT: str = Field(..., description='The system prompt for the user.')
    PROMPT_TEMPLATE: str = Field(..., description='The template string for the prompt.')


class PromptType(str, Enum):
    """Enum class for prompt types."""

    ENHANCE_PROMPT = 'enhance_prompt'
    FEW_SHOT_PROMPT = 'few_shot_prompt'
    CHAIN_OF_THOUGHT_PROMPT = 'chain_of_thought_prompt'
    STRUCTURE_OUTPUT_PROMPT = 'structure_output_prompt'


class PromptRequest(BaseModel):
    """Pydantic model for prompt request."""

    prompt: str
    prompt_type: PromptType = PromptType.ENHANCE_PROMPT


class CompletionIn(BaseModel):
    """Pydantic model for completion input."""

    prompt: str
    model: str = 'gemini-flash'


# ------------------------------- Response Models -------------------------------
class PromptAlchemyResponse(BaseModel):
    """Pydantic model for prompt alchemy response."""

    optimized_prompt: str
    content: str


class PromptAlchemyOut(BaseModel):
    """Pydantic model for prompt alchemy output."""

    body: str
    final_prompt: str


response_format_map = {
    PromptType.ENHANCE_PROMPT: PromptAlchemyOut,
    PromptType.FEW_SHOT_PROMPT: PromptAlchemyOut,
    PromptType.CHAIN_OF_THOUGHT_PROMPT: PromptAlchemyOut,
    PromptType.STRUCTURE_OUTPUT_PROMPT: PromptAlchemyOut,
}


# ------------------------------- Conversation Models -------------------------------
class ConversationIn(BaseModel):
    """Pydantic model for conversation input."""

    message: str
    history: List[List[str]]
    prompt_type: PromptType = PromptType.ENHANCE_PROMPT
    stream: bool = False
    latest_prompt: str = ''
    model: str = 'gemini-flash'
    temperature: float = 0.0
