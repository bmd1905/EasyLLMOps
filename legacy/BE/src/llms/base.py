import openai

from src.configs.litellm_config import litellm_config

client = openai.AsyncOpenAI(
    api_key='anything',
    base_url=litellm_config.LITELLM_PROXY_URL,
)
