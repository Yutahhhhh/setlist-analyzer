import logging

from flask import Blueprint, jsonify, request
from services.genre_train_util import GenreClassifier

logger = logging.getLogger(__name__)
genre_bp = Blueprint("genre", __name__, url_prefix="/workers/genres")


@genre_bp.route("/train", methods=["POST"])
def train_model():
    data = request.json
    tracks = data['tracks']
    user_id = data['user_id']
    incremental = data.get('incremental', False)
    
    try:
        if not user_id:
            raise ValueError("User ID is required.")
        if not tracks:
            raise ValueError("No tracks provided for training.")
        classifier = GenreClassifier(user_id)

        if not incremental:
            classifier.clear_model()
        classifier.train(tracks, incremental)

        return jsonify({"message": "Model trained and saved successfully.", "model_path": classifier.model_path})
    except Exception as e:
        logger.error(f"Failed to train model: {e}")
        return jsonify({"error": str(e)}), 500

@genre_bp.route("/predict", methods=["POST"])
def predict_genre():
    data = request.json
    user_id = data['user_id']
    tracks = data['tracks']

    try:
        if not user_id:
            raise ValueError("User ID is required.")
        if not tracks:
            raise ValueError("No tracks provided for prediction.")
        
        classifier = GenreClassifier(user_id)
        genre_name = classifier.predict_genre(tracks)

        return jsonify({"genre": genre_name}), 200
    except Exception as e:
        logger.error(f"Failed to predict genre: {e}")
        return jsonify({"error": str(e)}), 500

@genre_bp.route("/", methods=["GET"])
def get_genres():
    user_id = request.args.get('user_id')
    try:
        if not user_id:
            raise ValueError("User ID is required.")
        classifier = GenreClassifier(user_id)
        genres = classifier.get_trained_genres()
        return jsonify({"genres": genres}), 200
    except Exception as e:
        logger.error(f"Failed to get genres: {e}")
        return jsonify({"error": str(e)}), 500
