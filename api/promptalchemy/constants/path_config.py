import os
from pathlib import Path

# Define the base directory for the project
BASE_DIR = Path(__file__).parent.parent.parent.parent

# Define the base directory for the prompt configurations
PROMPT_BASE_DIR = os.path.join(BASE_DIR, 'api', 'promptalchemy', 'constants', 'prompts')
