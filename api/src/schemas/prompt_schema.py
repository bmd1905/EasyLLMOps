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
class PromptAlchemyOut(BaseModel):
    """Pydantic model for prompt alchemy output."""

    reasoning: List[str]
    final_prompt: str


class EnhancedPromptOut(BaseModel):
    """Pydantic model for enhanced prompt output."""

    key_improvements: str
    final_prompt: str


class ChainOfThoughtPromptOut(BaseModel):
    """Pydantic model for chain-of-thought prompt output."""

    chain_of_thought: str
    final_prompt: str


response_format_map = {
    PromptType.ENHANCE_PROMPT: EnhancedPromptOut,
    PromptType.FEW_SHOT_PROMPT: PromptAlchemyOut,
    PromptType.CHAIN_OF_THOUGHT_PROMPT: ChainOfThoughtPromptOut,
    PromptType.STRUCTURE_OUTPUT_PROMPT: PromptAlchemyOut,
}
