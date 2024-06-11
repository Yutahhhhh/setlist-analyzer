import logging
import os
from flask import Blueprint, request, jsonify
from services.audio_utils import get_audio_metadata, extract_features

feature_bp = Blueprint('feature', __name__, url_prefix='/workers/features')

@feature_bp.route('/analyze', methods=['POST'])
def analyze():
    try:
        file_paths = request.json.get('file_paths')
        if not file_paths:
            return jsonify({'error': 'No file paths provided'}), 400
        results = []

        for file_path in file_paths:
            if not os.path.exists(file_path):
                logging.info(f"File not found: {file_path}")
                continue  # ファイルが存在しない場合はスキップ
            metadata = get_audio_metadata(file_path)
            features = extract_features(file_path)
            
            results.append({
                'file_path': file_path,
                'metadata': metadata,
                'features': features
            })

        return jsonify({'results': results}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500