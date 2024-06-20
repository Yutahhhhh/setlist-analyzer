import pytest
import tensorflow as tf
from ..app import create_app

tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)

@pytest.fixture
def app():
    app = create_app()
    return app

@pytest.fixture
def client(app):
    return app.test_client()
