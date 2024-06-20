import logging
import os

from config import Config


def setup_logging():
    config = Config()
    log_directory = "logs"
    os.makedirs(log_directory, exist_ok=True)

    if config.FLASK_ENV == "development":
        logging.basicConfig(
            level=logging.INFO,
            filename="logs/development.log",
            filemode="a",
            format="%(asctime)s - %(levelname)s - %(message)s",
        )
        error_logger = logging.getLogger("error_logger")
        fh = logging.FileHandler("logs/errors.log")
        fh.setLevel(logging.ERROR)
        formatter = logging.Formatter("%(asctime)s - %(levelname)s - %(message)s")
        fh.setFormatter(formatter)
        error_logger.addHandler(fh)
    else:
        # DEVELOPMENT以外の場合は、標準出力
        logging.basicConfig(
            level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
        )
