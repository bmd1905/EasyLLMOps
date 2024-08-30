import yaml


def load_yaml_config(yaml_file_path: str) -> dict:
    """
    Loads a YAML configuration file.

    Args:
        yaml_file_path (str): File path.

    Returns:
        dict: Configuration data.
    """
    with open(yaml_file_path) as f:
        return yaml.safe_load(f)
