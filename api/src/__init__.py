import os
import sys
from datetime import datetime
from pathlib import Path

from loguru import logger

LOG_FOLDER = Path('logs')
LOG_FILE = LOG_FOLDER / f"app_{datetime.now().strftime('%Y_%m_%d')}.log"


def init_logging(env: str = 'development') -> None:
    """
    Initialize logging configuration.

    Parameters:
    - env (str): The environment for logging configuration. ('development' or 'production')
    """
    if not LOG_FOLDER.exists():
        LOG_FOLDER.mkdir(parents=True, exist_ok=True)

    logger.remove()

    # Define the logging format based on environment
    console_format = '<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>'
    file_format = '{time:YYYY-MM-DD at HH:mm:ss} | {level} | {name}:{function}:{line} - {message}'

    # Log to console
    logger.add(
        sys.stderr,
        format=console_format,
        level='DEBUG' if env == 'development' else 'INFO',
        colorize=True,
        backtrace=True,
        diagnose=env == 'development',
    )

    # Log to file
    logger.add(
        LOG_FILE,
        format=file_format,
        level='INFO',
        rotation='500 MB',
        retention='7 days',  # Retain log files for 7 days
        compression='zip',
        enqueue=True,  # Enables asynchronous logging
    )

    # Optional: Add custom level
    logger.level('REQUEST', no=25, color='<yellow>', icon=' ')

    # Catch all unhandled exceptions and log them
    def exception_handler(exc_type, exc_value, exc_traceback):
        if issubclass(exc_type, KeyboardInterrupt):
            sys.__excepthook__(exc_type, exc_value, exc_traceback)
            return
        logger.opt(exception=(exc_type, exc_value, exc_traceback)).critical('Unhandled exception')

    sys.excepthook = exception_handler


# Initialize logging based on environment
init_logging(env=os.getenv('APP_ENV', 'development'))
