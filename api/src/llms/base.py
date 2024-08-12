from langfuse.openai import openai
from settings import settings

client = openai.OpenAI(
    api_key='anything',
    base_url=settings.LITELLM_PROXY_URL,
)
