from typing import Any, Dict, List

from pydantic_settings import BaseSettings


class LitellmConfig(BaseSettings):
    """
    Configuration settings for the LITeLLM API.
    """

    # Proxy URL
    LITELLM_PROXY_URL: str = 'http://litellm:4000'

    # Available models
    MODEL_NAMES: List[str] = [
        'gemini-flash',
        'gpt-4o-mini',
    ]

    # Generation parameters
    GENERATION_CONFIG: Dict[str, Any] = {
        'max_tokens': 8192,
        'temperature': 0.5,
    }


litellm_config = LitellmConfig()
