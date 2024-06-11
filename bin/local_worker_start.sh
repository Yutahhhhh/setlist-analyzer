#!/bin/bash

source /usr/src/app/venv/bin/activate
pip install -r /usr/src/app/requirements.txt

export FLASK_APP=app
export FLASK_ENV=development

flask run --host=0.0.0.0 --port=5328 --debug --reload