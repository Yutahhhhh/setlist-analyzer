#!/bin/bash

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

export FLASK_APP=app
export FLASK_ENV=development

flask run --host=0.0.0.0 --port=5328 --debug --reload