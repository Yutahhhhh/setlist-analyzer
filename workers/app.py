import sys

from flask import Flask

from blueprints.feature import feature_bp
from blueprints.genre import genre_bp
from config import Config
from services.log_utils import setup_logging

sys.dont_write_bytecode = True


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    app.register_blueprint(feature_bp)
    app.register_blueprint(genre_bp)

    setup_logging()

    @app.route("/", methods=["GET"])
    def health_check():
        """Health check route."""
        return {"status": "OK", "message": "Health check"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
