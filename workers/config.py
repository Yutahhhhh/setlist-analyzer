"""Configuration settings for the Flask application."""

import os
from dataclasses import dataclass


@dataclass
class Config:
    """Base configuration class with default settings."""

    JSON_AS_ASCII = False
    MODEL_DIR = os.getenv("MODEL_DIR", "../llm")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    TF_CPP_MIN_LOG_LEVEL = 0
    TF_ENABLE_ONEDNN_OPTS = 2
