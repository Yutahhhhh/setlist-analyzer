import pytest
from tests.genres.factory import generate_tracks

@pytest.mark.parametrize("user_id, track_data, expected_genres", [
    ('123', ('Rock', 2), ['Rock']),
    ('123', ('Pop', 2), ['Pop']),
    ('456', ('Pop', 2), ['Pop'])
])
def test_train_model_success(client, user_id, track_data, expected_genres):
    tracks = generate_tracks(*track_data)
    response = client.post("/workers/genres/train", json={'user_id': user_id, 'tracks': tracks})
    assert response.status_code == 200, "Training failed: " + str(response.json)

    response = client.get("/workers/genres/", query_string={'user_id': user_id})
    assert response.status_code == 200, "Failed to get genres: " + str(response.json)
    trained_genres = response.json['genres']
    assert set(trained_genres) == set(expected_genres), "Incorrect genres trained"

    response = client.post("/workers/genres/predict", json={'user_id': user_id, 'tracks': [
        {'id': 1, 'features': {'acousticness': 0.5, 'loudness': -5, 'tempo': 120}},
        {'id': 2, 'features': {'acousticness': 0.8, 'loudness': -5, 'tempo': 100}}
    ]})
    assert response.status_code == 200, "Prediction failed: " + str(response.json)
    results = response.json['results']
    assert len(results) == 2, "Incorrect number of predictions"
    for result in results:
        assert result['genre'] in expected_genres, "Incorrect genre prediction"

@pytest.mark.parametrize("user_id, track_data, error_message", [
    (None, ('Test', 1), "User ID is required."),
    ('123', None, "No tracks provided for training."),
])
def test_train_model_error_cases(client, user_id, track_data, error_message):
    tracks = generate_tracks(*track_data) if track_data else None
    response = client.post("/workers/genres/train", json={'user_id': user_id, 'tracks': tracks})
    assert response.status_code == 500
    assert "error" in response.json

@pytest.mark.parametrize("user_id, tracks, error_message", [
    (None, [{'acousticness': 0.5, 'loudness': -5, 'tempo': 120}], "User ID is required."),
    ('123', None, "Track data is required for prediction."),
    ('123', {}, "Track data is required for prediction.")
])
def test_predict_genre_error(client, user_id, tracks, error_message):
    response = client.post("/workers/genres/predict", json={'user_id': user_id, 'tracks': tracks})
    assert response.status_code == 500
    assert 'error' in response.json