import shutil
from flask import Blueprint, jsonify, request, current_app
import os
import traceback
from services.audio_utils import extract_vocal
from services.lyric_model_util import audio_to_text, find_phrase_times

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
        vocal_file_path, output_dir = extract_vocal(file_path)
        whisper_model = current_app.config['WHISPER_MODEL']
        transcription = audio_to_text(whisper_model, vocal_file_path)
        full_text = " ".join([seg['text'] for seg in transcription['segments']])
        phrase_times = find_phrase_times(transcription['segments'])

        # 一時ファイルとディレクトリを削除
        if os.path.exists(vocal_file_path):
            os.remove(vocal_file_path)
        if output_dir and os.path.exists(output_dir):
            shutil.rmtree(output_dir)

        return jsonify({
            "phrases": phrase_times,
            "lyrics": full_text
        }), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500