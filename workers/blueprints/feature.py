import logging
import os

from flask import Blueprint, jsonify, request

from services.audio_utils import (extract_features, generate_md5,
                                  get_audio_metadata, get_audio_mime_type)

feature_bp = Blueprint("feature", __name__, url_prefix="/workers/features")


@feature_bp.route("/analyze", methods=["POST"])
def analyze():
    try:
        file_paths = request.json.get("file_paths")
        if not file_paths:
            return jsonify({"error": "No file paths provided"}), 400
        results = []

        for file_path in file_paths:
            if not os.path.exists(file_path):
                logging.info(f"File not found: {file_path}")
                continue  # ファイルが存在しない場合はスキップ
            metadata = get_audio_metadata(file_path)
            features = extract_features(file_path)
            md5 = generate_md5(file_path)
            audio_mime_type = get_audio_mime_type(file_path)

            results.append(
                {
                    "file_path": file_path,
                    "metadata": metadata,
                    "features": features,
                    "md5": md5,
                    "audio_mime_type": audio_mime_type,
                }
            )

        return jsonify({"results": results}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
