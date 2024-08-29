from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


def setup_middleware(app: FastAPI) -> None:
    """
    Sets up CORS middleware for the FastAPI application.

    Args:
        app (FastAPI): FastAPI application instance.
    """
    app.add_middleware(
        CORSMiddleware,
        allow_origins=['*'],  # Allow all origins
        allow_methods=['*'],  # Allow all methods
        allow_headers=['*'],  # Allow all headers
        allow_credentials=False,  # Do not allow credentials
    )
