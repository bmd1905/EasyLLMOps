import os
from typing import Dict

from api.src import logger
from api.src.schemas.prompt_schema import PromptModel
from pydantic import BaseModel

from src.constants.path_config import PROMPT_BASE_DIR


class PromptLoaderStrategy:
    """
    Abstract base class defining the common interface for prompt loading strategies.

    This class outlines the method `load_prompts` that must be implemented by any concrete
    prompt loading strategy. The `load_prompts` method should return a dictionary of prompts
    where the keys are prompt names and the values are instances of `BaseModel`.
    """

    def load_prompts(self) -> Dict[str, BaseModel]:
        """
        Abstract method for loading prompts.

        Subclasses must implement this method to return a dictionary where keys are prompt names
        and values are instances of `BaseModel`.

        Returns:
            Dict[str, BaseModel]: A dictionary of prompts.
        """
        raise NotImplementedError


class PythonFilePromptLoader(PromptLoaderStrategy):
    """
    Concrete implementation of `PromptLoaderStrategy` for loading prompts from Python files.

    This strategy loads prompt definitions from `.py` files located in the specified directory.
    It assumes that each `.py` file defines a prompt model that is validated against the `PromptModel`.
    """

    def __init__(self, prompt_dir: str):
        """
        Initialize the loader with the directory containing prompt files.

        Args:
            prompt_dir (str): The directory where prompt Python files are located.
        """
        self.prompt_dir = prompt_dir

    def load_prompts(self) -> Dict[str, BaseModel]:
        """
        Load prompts from Python files in the specified directory.

        This method scans the directory for Python files, imports them, and validates them using
        the `PromptModel`. The validated prompts are returned as a dictionary.

        Returns:
            Dict[str, BaseModel]: A dictionary where keys are prompt names (derived from file names)
                                   and values are instances of `PromptModel`.
        """
        prompts = {}
        prompt_files = os.listdir(self.prompt_dir)

        for prompt_file in prompt_files:
            if prompt_file.endswith('.py') and prompt_file != '__init__.py':
                prompt_name = prompt_file.replace('.py', '')
                prompt_module = f'promptalchemy.constants.prompts.{prompt_name}'
                try:
                    # Import the module dynamically
                    prompt = __import__(prompt_module, fromlist=['*'])

                    # Validate the prompt using the Pydantic model
                    validated_prompt = PromptModel(**vars(prompt))
                    prompts[prompt_name] = validated_prompt

                    # Log the successful loading of the prompt
                    logger.info(f'Loaded prompt {prompt_name}')
                except Exception as e:
                    logger.error(f'Failed to load prompt {prompt_name}: {e}')

        return prompts


# TODO: Consider adding additional strategies for loading prompts from sources like YAML, JSON, or a database


class PromptLoader:
    """
    Class responsible for loading and managing prompts using a strategy pattern.

    This class uses a strategy pattern to allow different methods of loading prompts. By default,
    it uses `PythonFilePromptLoader`, but this can be overridden by providing a different strategy.
    """

    def __init__(self, prompt_dir: str = PROMPT_BASE_DIR, strategy: PromptLoaderStrategy = None):
        """
        Initialize the `PromptLoader` with a directory and a strategy for loading prompts.

        Args:
            prompt_dir (str): Directory where prompt files are located. Defaults to `PROMPT_BASE_DIR`.
            strategy (PromptLoaderStrategy): The strategy used to load prompts. If None, defaults to `PythonFilePromptLoader`.
        """
        self.prompt_dir = prompt_dir
        self.strategy = strategy or PythonFilePromptLoader(prompt_dir)
        self.prompts = self.load_prompts()

    def load_prompts(self) -> Dict[str, PromptModel]:
        """
        Load all prompts using the chosen strategy.

        Uses the `load_prompts` method of the provided strategy to load prompts and return them as a dictionary.

        Returns:
            Dict[str, PromptModel]: A dictionary where keys are prompt names and values are instances of `PromptModel`.
        """
        return self.strategy.load_prompts()

    def get_prompt(self, prompt_name: str) -> PromptModel:
        """
        Retrieve a specific prompt by name.

        Args:
            prompt_name (str): The name of the prompt to retrieve.

        Returns:
            PromptModel: The prompt corresponding to the provided name.

        Raises:
            ValueError: If the prompt with the specified name is not found.
        """
        if prompt_name in self.prompts:
            return self.prompts[prompt_name]
        else:
            raise ValueError(f"Prompt '{prompt_name}' not found.")


if __name__ == '__main__':
    # Example usage of the `PromptLoader` class
    prompt_loader = PromptLoader()

    # Log the number of loaded prompts
    logger.info(f'Loaded {len(prompt_loader.prompts)} prompts:')

    # Retrieve a specific prompt by name
    enhance_prompt = prompt_loader.get_prompt('enhance_prompt')

    # Access and format the prompt template
    prompt_template = enhance_prompt.PROMPT_TEMPLATE
    formatted_prompt = prompt_template.format(prompt='Write a story about a detective solving')

    # Log the formatted prompt
    logger.info(formatted_prompt)
