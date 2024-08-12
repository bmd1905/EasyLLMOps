from langfuse.openai import openai
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = None


async def startup():
    # Initialize rate limiter
    global limiter
    limiter = Limiter(key_func=get_remote_address)

    # Check connection to Langfuse
    try:
        openai.langfuse_auth_check()
    except Exception as e:
        print(f'Langfuse connection check failed: {e}')


async def shutdown():
    await limiter.close()
