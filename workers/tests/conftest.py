import os
import pytest
import tensorflow as tf
from ..app import create_app

tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)
should_skip = os.getenv('SKIP_LONG_TESTS', 'false').lower() == 'true'

@pytest.fixture
def app():
    app = create_app()
    return app

@pytest.fixture
def client(app):
    return app.test_client()

# 処理の重いテストを任意でスキップする
def pytest_collection_modifyitems(_config, items):
    if should_skip:
        skip_marker = pytest.mark.skip(reason="Long tests are skipped because SKIP_LONG_TESTS is set.")
        for item in items:
            if "longtest" in item.keywords:
                item.add_marker(skip_marker)