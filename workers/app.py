"""
This module configures the Flask application and its routes.
"""

import os
import sys

from flask import Flask

from blueprints.feature import feature_bp
from blueprints.genre import genre_bp
from blueprints.lyric import lyric_bp
from config import Config
from services.log_utils import setup_logging

os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
sys.dont_write_bytecode = True


def create_app():
    """
    Create and configure the Flask application instance.

    Returns:
        Flask app: The configured Flask application.
    """
    app = Flask(__name__)
    app.config.from_object(Config)

    app.register_blueprint(feature_bp)
    app.register_blueprint(genre_bp)
    app.register_blueprint(lyric_bp)

    setup_logging()

    @app.route("/", methods=["GET"])
    def health_check():
        """Health check route."""
        return {"status": "OK", "message": "Health check"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
