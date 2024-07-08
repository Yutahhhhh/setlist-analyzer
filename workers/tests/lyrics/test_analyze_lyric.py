import os

import pytest

sample_path = os.getenv("PYTHONPATH", "workers") + "/tests/fixtures/sample/"
audio_files = [
    sample_path + "test_jp_lyric.mp3",
    sample_path + "test_us_lyric.mp3",
]
@pytest.mark.longtest
@pytest.mark.parametrize("file_path", audio_files)
def test_lyric_analysis_success(client, file_path):
    data = {'file_path': file_path}
    response = client.post("/workers/lyrics/analyze", json=data)
    assert response.status_code == 200, f"Failed with response: {response.data.decode()}"
    validate_phrases(response.json.get('phrases', []))
    assert isinstance(response.json.get('lyrics'), str), "Lyrics should be a string."

def validate_phrases(results):
    for phrase_info in results:
        assert isinstance(phrase_info["phrase"], str), "Phrase should be a string."
        assert isinstance(phrase_info["start"], (int, float)), "Start time should be a number."
        assert isinstance(phrase_info["end"], (int, float)), "End time should be a number."
        assert phrase_info["start"] < phrase_info["end"], "Start time should be less than end time."

def test_lyric_analysis_no_file_path(client):
    response = client.post("/workers/lyrics/analyze", json={})
    assert response.status_code == 400, "Should fail without file path"
    assert "error" in response.json, "Error message should be present"

def test_lyric_analysis_file_not_exist(client):
    data = {'file_path': 'invalid_path/non_existent_file.mp3'}
    response = client.post("/workers/lyrics/analyze", json=data)
    assert response.status_code == 404, "Should fail when file does not exist"
    assert "error" in response.json, "Error message should be present"