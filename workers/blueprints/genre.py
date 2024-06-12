import logging

import numpy as np
from flask import Blueprint, jsonify, request

from services.audio_utils import extract_features, get_audio_metadata

logger = logging.getLogger(__name__)
genre_bp = Blueprint("genre", __name__, url_prefix="/workers/genres")


@genre_bp.route("/train", methods=["POST"])
def train_model():
    file_paths = request.json.get("file_paths")
    user_id = request.json.get("user_id")
    return jsonify({"model_id": "1"}), 200


@genre_bp.route("/", methods=["GET"])
def get_genres():
    return jsonify({"genres": []}), 200
