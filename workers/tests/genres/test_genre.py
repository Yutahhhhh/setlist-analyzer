import pytest
from tests.genres.factory import generate_tracks

@pytest.mark.parametrize("user_id, track_data, incremental, expected_genres", [
    ('123', ('Rock', 2), False, ['Rock']),
    ('123', ('Pop', 2), True, ['Rock', 'Pop']),
    ('456', ('Pop', 2), False, ['Pop'])
])
def test_train_model_success(client, user_id, track_data, incremental, expected_genres):
    tracks = generate_tracks(*track_data)
    train_response = client.post("/workers/genres/train", json={'user_id': user_id, 'tracks': tracks, 'incremental': incremental})
    assert train_response.status_code == 200, "Training failed: " + str(train_response.json)

    get_genres_response = client.get("/workers/genres/", json={'user_id': user_id})
    assert get_genres_response.status_code == 200, "Failed to get genres: " + str(get_genres_response.json)
    trained_genres = get_genres_response.json['genres']
    assert set(trained_genres) == set(expected_genres), "Incorrect genres trained"

    predict_response = client.post("/workers/genres/predict", json={'user_id': user_id, 'tracks': tracks[0], 'incremental': incremental})
    assert predict_response.status_code == 200, "Prediction failed: " + str(predict_response.json)
    assert 'genre' in predict_response.json, "Response does not contain 'genre' key"
    assert predict_response.json['genre'] in ['Rock', 'Pop'], "Incorrect genre prediction"

@pytest.mark.parametrize("user_id, track_data, error_message", [
    (None, ('Test', 1), "User ID is required."),
    ('123', None, "No tracks provided for training."),
])
def test_train_model_error_cases(client, user_id, track_data, error_message):
    if track_data is not None:
        tracks = generate_tracks(*track_data)
    else:
        tracks = None
    response = client.post("/workers/genres/train", json={'user_id': user_id, 'tracks': tracks})
    assert response.status_code == 500
    assert "error" in response.json
    assert response.json["error"] == error_message

@pytest.mark.parametrize("user_id, tracks, error_message", [
    (None, {'acousticness': 0.5, 'loudness': -5, 'tempo': 120}, "User ID is required."),
    ('123', None, "No tracks provided for prediction."),
    ('123', {}, "No tracks provided for prediction.")
])
def test_predict_genre_error(client, user_id, tracks, error_message):
    response = client.post("/workers/genres/predict", json={'user_id': user_id, 'tracks': tracks})
    assert response.status_code == 500
    assert 'error' in response.json
    assert response.json['error'] == error_message