# from .generate import chatbot_router
from .completion import chatbot_router
from .promptalchemy import promptalchemy_router

__all__ = ['promptalchemy_router', 'chatbot_router']
