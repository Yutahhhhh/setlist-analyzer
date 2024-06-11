FROM python:3.9-slim

WORKDIR /usr/src/app

COPY ./bin ./bin
RUN chmod +x ./bin/local_worker_start.sh

RUN python3 -m venv ./venv

EXPOSE 5328
ENV BINDING=0.0.0.0
ENV PYTHONPATH /usr/src/app