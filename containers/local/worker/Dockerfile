FROM python:3.10-slim

WORKDIR /usr/src/app

COPY ./bin ./bin
COPY workers/requirements.txt .
RUN chmod +x ./bin/local_worker_start.sh

RUN mkdir -p /usr/src/app/logs

RUN apt-get update && apt-get install -y \
    git \
    ffmpeg \
    libsndfile1 \
    mecab \
    libmecab-dev \
    mecab-ipadic-utf8 \
    build-essential \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN pip install -r requirements.txt

EXPOSE 5328
ENV BINDING=0.0.0.0
ENV PYTHONPATH /usr/src/app