from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Redis settings
    REDIS_HOST: str = 'redis'
    REDIS_PORT: int = 6379

    # Base URL for the chatbot API
    LITELLM_PROXY_URL: str = 'http://litellm:4000'


settings = Settings()
