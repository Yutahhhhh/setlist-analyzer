# Dockerfile for Next.js
FROM node:20-slim

WORKDIR /usr/src/app

COPY ./bin ./bin
RUN chmod +x ./bin/local_next_start.sh

ENV HOST 0.0.0.0