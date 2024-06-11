ARG RUBY_VERSION=3.2.0
FROM registry.docker.com/library/ruby:$RUBY_VERSION-slim as base

WORKDIR /usr/src/app

RUN apt-get update -qq && \
  apt-get install -y build-essential git && \
  apt-get clean

COPY Gemfile* ./
COPY . .