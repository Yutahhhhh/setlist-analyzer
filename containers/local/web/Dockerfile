ARG RUBY_VERSION=3.2.0
FROM registry.docker.com/library/ruby:$RUBY_VERSION-slim as base

WORKDIR /usr/src/app

RUN apt-get update -qq && \
    apt-get install -y build-essential nodejs default-mysql-client libmariadb-dev git graphviz && \
    apt-get clean

RUN bundle config set --local path 'vendor/bundle'

ENV BUNDLE_PATH="/usr/local/bundle"

EXPOSE 3000
ENV BINDING=0.0.0.0