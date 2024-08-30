import os
from pathlib import Path

from pydantic_settings import BaseSettings


class PathConfig(BaseSettings):
    """
    Configuration settings for the paths used in the project.
    """

    # Define the base directory for the project
    BASE_DIR: Path = Path(__file__).parent.parent

    # Define the base directory for the prompt configurations
    PROMPT_BASE_DIR: Path = os.path.join(BASE_DIR, 'prompt_config', 'prompts')

    # Prompt module
    PROMPT_MODULE: str = 'src.configs.prompt_config.prompts.{prompt_name}'


path_config = PathConfig()
