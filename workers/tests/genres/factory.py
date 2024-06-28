import random

def generate_tracks(genre, count):
    return [
        {
            'genre': genre,
            'acousticness': round(random.uniform(0.0, 1.0), 2),
            'spectral_contrast': random.randint(5, 20),
            'energy': round(random.uniform(0.0, 1.0), 2),
            'spectral_flatness': round(random.uniform(0.0, 1.0), 2),
            'spectral_bandwidth': random.randint(1000, 3000),
            'loudness': random.randint(-60, 0),
            'mfcc': random.randint(0, 30),
            'valence': round(random.uniform(0.0, 1.0), 2),
            'tempo': random.randint(60, 200),
            'duration': random.randint(180, 400),
            'key': random.randint(0, 11),
            'mode': random.randint(0, 1),
            'time_signature': random.choice([3, 4, 5]),
            'measure': random.randint(16, 64)
        }
    ] * count