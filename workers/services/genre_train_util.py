import os
import pickle
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import SGD

MODEL_DIR = os.getenv('MODEL_DIR', '../llm')

class GenreClassifier:
    def __init__(self, user_id):
        self.user_id = user_id
        self.model_path = os.path.join(MODEL_DIR, f"{user_id}/genre/model.h5")
        self.preprocessor_path = os.path.join(MODEL_DIR, f"{user_id}/genre/preprocessor.pkl")
        self.genre_mapping_path = os.path.join(MODEL_DIR, f"{user_id}/genre/mapping.pkl")
        self.feature_columns = ['acousticness', 'spectral_contrast', 'energy', 'spectral_flatness',
                                'spectral_bandwidth', 'loudness', 'mfcc', 'valence', 'tempo',
                                'duration', 'key', 'mode', 'time_signature', 'measure']
        self.model = None
        self.preprocessor = None
        self.genre_mapping = {}

    def initial_train_load(self):
        self.clear_model()
        self.initialize_preprocessor()

    def initialize_preprocessor(self):
        self.preprocessor = ColumnTransformer(transformers=[
            ('num', StandardScaler(), self.feature_columns[:-4]),
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), self.feature_columns[-4:])
        ], remainder='passthrough')

    def build_and_train_model(self, X, y):
        input_dim = X.shape[1]
        self.model = Sequential([
            Dense(512, activation='relu', input_shape=(input_dim,)),
            Dropout(0.3),
            Dense(256, activation='relu'),
            Dropout(0.3),
            Dense(128, activation='relu'),
            Dropout(0.2),
            Dense(len(np.unique(y)), activation='softmax')
        ])
        self.model.compile(optimizer=SGD(learning_rate=0.01, momentum=0.9, nesterov=True),
                           loss='sparse_categorical_crossentropy', metrics=['accuracy'])
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        self.model.fit(X_train, y_train, epochs=50, batch_size=32, validation_data=(X_test, y_test))
        self.save_model()

    def train(self, tracks):
        df = pd.DataFrame(tracks)
        X = df.drop('genre', axis=1)
        y = df['genre'].astype('category').cat.codes
        self.genre_mapping = {i: genre for i, genre in enumerate(df['genre'].unique())}
        X_processed = self.preprocessor.fit_transform(X)
        self.build_and_train_model(X_processed, y)

    def predict_genre(self, track_features):
        self.model = load_model(self.model_path)
        self.preprocessor = joblib.load(self.preprocessor_path)
        with open(self.genre_mapping_path, 'rb') as f:
            self.genre_mapping = pickle.load(f)
        X = self.preprocessor.transform(track_features)
        genre_index = np.argmax(self.model.predict(X), axis=1)[0]
        return self.genre_mapping[genre_index]
    
    def get_trained_genres(self):
        with open(self.genre_mapping_path, 'rb') as f:
            self.genre_mapping = pickle.load(f)
        return list(self.genre_mapping.values())

    def save_model(self):
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        self.model.save(self.model_path)
        joblib.dump(self.preprocessor, self.preprocessor_path)
        with open(self.genre_mapping_path, 'wb') as f:
            pickle.dump(self.genre_mapping, f)
            
    def clear_model(self):
        if os.path.exists(self.model_path):
            os.remove(self.model_path)
        if os.path.exists(self.preprocessor_path):
            os.remove(self.preprocessor_path)
        if os.path.exists(self.genre_mapping_path):
            os.remove(self.genre_mapping_path)
        self.model = None
        self.preprocessor = None
        self.genre_mapping = {}

