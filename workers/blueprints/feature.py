import logging
from flask import Blueprint, jsonify, request
from concurrent.futures import ThreadPoolExecutor

from services.audio_utils import (extract_features, generate_md5,
                                  get_audio_metadata, get_audio_mime_type)

feature_bp = Blueprint("feature", __name__, url_prefix="/workers/features")


@feature_bp.route("/analyze", methods=["POST"])
def analyze():
    logging.info(f"Request JSON: {request.json}")
    try:
        file_paths = request.json.get("file_paths")
        if not file_paths:
            return jsonify({"error": "No file paths provided"}), 400
        
        results = []
        with ThreadPoolExecutor(max_workers=10) as executor:
            results = list(executor.map(process_file, file_paths))
        return jsonify({"results": results}), 200
    except Exception as e:
        logging.error(f"Error processing request: {str(e)}")
        return jsonify({"error": str(e)}), 500

def process_file(file_path):
    metadata = get_audio_metadata(file_path)
    features = extract_features(file_path)
    md5 = generate_md5(file_path)
    mime_type = get_audio_mime_type(file_path)
    return {
        "file_path": file_path,
        "metadata": metadata,
        "features": features,
        "md5": md5,
        "audio_mime_type": mime_type
    }
