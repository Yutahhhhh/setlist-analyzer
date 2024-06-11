import logging
import librosa
import os
import numpy as np
from mutagen.easyid3 import EasyID3
from mutagen.flac import FLAC
from mutagen.oggvorbis import OggVorbis
from mutagen.wave import WAVE

def get_audio_metadata(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    try:
        if ext in ['.mp3']:
            audio = EasyID3(file_path)
        elif ext in ['.flac']:
            audio = FLAC(file_path)
        elif ext in ['.ogg']:
            audio = OggVorbis(file_path)
        elif ext in ['.wav']:
            audio = WAVE(file_path)
        else:
            raise ValueError(f"Unsupported file type: {ext}")

        return {
            'title': audio.get('title', [None])[0],
            'artist': audio.get('artist', [None])[0],
            'album': audio.get('album', [None])[0],
            'genre': audio.get('genre', [None])[0]
        }
    except Exception as e:
        logging.error(f"Error processing metadata for {file_path}: {str(e)}")
        raise e


def extract_features(file_path):
    try:
        y, sr = librosa.load(file_path)

        if y.size == 0:  # ファイルが空か損傷している場合
            return None
        
        tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr)
        chroma = librosa.feature.chroma_stft(y=y, sr=sr)
        key = np.argmax(np.sum(chroma, axis=1))
        mode = 1 if np.mean(librosa.feature.tonnetz(y=y, sr=sr)) > 0 else 0
        time_signature = len(beat_frames)
        
        return {
            'tempo': float(tempo[0]) if tempo.size > 0 else None,
            'key': int(key) if key is not None else None,
            'mode': mode,
            'time_signature': int(time_signature),
            'acousticness': float(np.mean(librosa.feature.zero_crossing_rate(y=y))),
            'spectral_contrast': float(np.mean(librosa.feature.spectral_contrast(y=y))),
            'energy': float(np.mean(librosa.feature.rms(y=y))),
            'spectral_flatness': float(np.mean(librosa.feature.spectral_flatness(y=y))),
            'spectral_bandwidth': float(np.mean(librosa.feature.spectral_bandwidth(y=y))),
            'loudness': float(librosa.core.amplitude_to_db(y, ref=np.max).mean()),
            'mfcc': float(np.mean(librosa.feature.mfcc(y=y, sr=sr))),
            'valence': float(np.mean(librosa.feature.chroma_stft(y=y, sr=sr))),
            'duration': float(librosa.get_duration(y=y, sr=sr)),
        }
    except Exception as e:
        print(f"Error processing features for {file_path}: {str(e)}")
        return None
