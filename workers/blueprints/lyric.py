from flask import Blueprint, jsonify, request
import os
from services.audio_utils import extract_vocal
from services.lyric_model_util import initialize_whisper_model, audio_to_text, find_phrase_times

lyric_bp = Blueprint("lyric", __name__, url_prefix="/workers/lyrics")

@lyric_bp.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    if not data or 'file_path' not in data:
        return jsonify({"error": "No file path provided"}), 400

    file_path = data['file_path']
    if not os.path.exists(file_path):
        return jsonify({"error": "File does not exist"}), 404

    try:
        vocal_file_path = extract_vocal(file_path)
        whisper_model = initialize_whisper_model()
        transcription = audio_to_text(whisper_model, vocal_file_path)
        full_text = " ".join([seg['text'] for seg in transcription['segments']])
        phrase_times = find_phrase_times(transcription['segments'])

        # 一時ファイルを削除
        # os.remove(vocal_file_path)

        return jsonify({
            "phrases": phrase_times,
            "lyrics": full_text
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500