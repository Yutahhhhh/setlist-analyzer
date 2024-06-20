import json
import os

import pytest

sample_path = os.getenv("PYTHONPATH", "/workers") + "/tests/fixtures/sample/"
audio_files = {
    "mp3": sample_path + "test.mp3",
    "wav": sample_path + "test.wav",
    "flac": sample_path + "test.flac",
    "ogg": sample_path + "test.ogg",
}

@pytest.mark.parametrize("file_type, file_path", audio_files.items())
def test_audio_analysis_success(client, file_type, file_path, caplog):
    url = "/workers/features/analyze"
    data = {"file_paths": [file_path]}
    headers = {"Content-Type": "application/json"}
    # POSTリクエストを送信
    response = client.post(url, data=json.dumps(data), headers=headers)
    assert response.status_code == 200
    response_data = response.get_json()
    assert "results" in response_data
    assert len(response_data["results"]) == 1
    result = response_data["results"][0]
    assert result["file_path"] == file_path
    assert "metadata" in result
    assert "features" in result
    assert "md5" in result
    assert "audio_mime_type" in result

    # 各値の検証
    validate_features(result["features"])
    validate_metadata(result["metadata"], file_type)
    assert len(result["md5"]) == 32  # MD5ハッシュの長さが正しいか確認


@pytest.mark.parametrize(
    "file_path, expected_status",
    [
        (sample_path + "test.m4a", 500),  # 許可されていないファイルタイプ
        (None, 400),
    ],
)
def test_audio_analysis_error_cases(client, file_path, expected_status):
    url = "/workers/features/analyze"
    data = {"file_paths": [file_path]} if file_path is not None else {}
    headers = {"Content-Type": "application/json"}

    response = client.post(url, data=json.dumps(data), headers=headers)
    assert response.status_code == expected_status

    if expected_status == 400 or expected_status == 404:
        assert "error" in response.json  # エラーメッセージが含まれているか確認


def validate_features(features):
    assert 1 <= features["tempo"] <= 300, "テンポの範囲が不正です。"
    assert 0 <= features["key"] <= 11, "キーの範囲が不正です。"
    assert features["mode"] in [0, 1], "モードの値が不正です。"
    assert features["time_signature"] > 0, "拍子記号の値が不正です。"
    assert (
        0.0 <= features["acousticness"] <= 1.0
    ), "アコースティック度の範囲が不正です。"
    assert (
        0.0 <= features["spectral_contrast"] <= 80.0
    ), "スペクトルコントラストの範囲が不正です。"
    assert 0.0 <= features["energy"] <= 1.0, "エネルギーの範囲が不正です。"
    assert (
        0.0 <= features["spectral_flatness"] <= 1.0
    ), "スペクトルフラットネスの範囲が不正です。"
    assert features["spectral_bandwidth"] > 0, "スペクトル帯域幅の値が不正です。"
    assert features["loudness"] <= 0, "ラウドネスの範囲が不正です。"
    assert isinstance(features["mfcc"], float), "MFCCは浮動小数点数であるべきです。"
    assert 0.0 <= features["valence"] <= 1.0, "バレンスの範囲が不正です。"
    assert features["duration"] > 0, "持続時間が不正です。"


def validate_metadata(metadata, file_type):
    fields = ["title", "artist", "album", "genre", "year", "artwork", "art_mime_type"]
    for field in fields:
        assert isinstance(
            metadata[field], (str, type(None))
        ), f"{field}は文字列またはNoneであるべきです。"

        # mp3ファイルの場合は全てのフィールドが存在している
        if file_type == "mp3":
            assert metadata[field] is not None, f"mp3ファイルでは{field}が必要です。"
