FROM python:3.9-slim

WORKDIR /usr/src/app

COPY ./bin ./bin
COPY workers/requirements.txt .
RUN chmod +x ./bin/local_worker_start.sh

# 必要なパッケージのインストール
RUN apt-get update && apt-get install -y \
    git \
    ffmpeg \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /usr/src/app/.cache \
    && rm -rf /root/.cache/pip

# Pythonの依存パッケージのインストール
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5328
ENV BINDING=0.0.0.0
ENV PYTHONPATH /usr/src/app