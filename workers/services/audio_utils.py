import logging
import librosa
import os
import numpy as np
from mutagen.easyid3 import EasyID3
from mutagen.flac import FLAC
from mutagen.oggvorbis import OggVorbis
from mutagen.wave import WAVE
from mutagen.mp3 import MP3
import hashlib
import mimetypes
import base64

def get_audio_metadata(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    audio, artwork, art_mime_type = None, None, None
    try:
        if ext == '.mp3':
            audio, artwork, art_mime_type = get_mp3_metadata(file_path)
        elif ext == '.flac':
            audio, artwork, art_mime_type = get_flac_metadata(file_path)
        elif ext == '.ogg':
            audio = OggVorbis(file_path)
        elif ext == '.wav':
            audio = WAVE(file_path)
        else:
            raise ValueError(f"Unsupported file type: {ext}")

        if artwork:
            artwork = base64.b64encode(artwork).decode('utf-8')

        return {
            'title': audio.get('title', [None])[0],
            'artist': audio.get('artist', [None])[0],
            'album': audio.get('album', [None])[0],
            'genre': audio.get('genre', [None])[0],
            'year': audio.get('date', [None])[0],
            'artwork': artwork,
            'art_mime_type': art_mime_type
        }
    except Exception as e:
        logging.error(f"Error processing metadata for {file_path}: {str(e)}")
        raise e
    
def get_mp3_metadata(file_path):
    audio = EasyID3(file_path)
    artwork = None
    art_mime_type = None
    try:
        mp3 = MP3(file_path)
        for tag in mp3.tags.values():
            if tag.FrameID == 'APIC':
                artwork = tag.data
                art_mime_type = tag.mime
                break
    except Exception as e:
        logging.error(f"Error extracting artwork for {file_path}: {str(e)}")
    return audio, artwork, art_mime_type

def get_flac_metadata(file_path):
    audio = FLAC(file_path)
    artwork = None
    art_mime_type = None
    if audio.pictures:
        artwork = audio.pictures[0].data
        art_mime_type = audio.pictures[0].mime
    return audio, artwork, art_mime_type

def get_audio_mime_type(file_path):
    mime_type, _ = mimetypes.guess_type(file_path)
    return mime_type

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

def generate_md5(file_path):
    hash_md5 = hashlib.md5()
    try:
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except Exception as e:
        logging.error(f"Error generating MD5 for {file_path}: {str(e)}")
        return None