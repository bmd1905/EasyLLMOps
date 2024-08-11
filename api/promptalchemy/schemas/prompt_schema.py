from pydantic import BaseModel, Field


class PromptModel(BaseModel):
    """Pydantic model for validating prompt structure."""

    NAME: str = Field(..., description='The name of the prompt.')
    DESCRIPTION: str = Field(..., description='The description of the prompt.')
    SYSTEM_PROMPT: str = Field(..., description='The system prompt for the user.')
    PROMPT_TEMPLATE: str = Field(..., description='The template string for the prompt.')
