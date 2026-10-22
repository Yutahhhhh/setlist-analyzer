ARG RUBY_VERSION=3.2.0
FROM node:22.23.4-bookworm-slim AS node
FROM registry.docker.com/library/ruby:$RUBY_VERSION-slim as base

COPY --from=node /usr/local/bin/node /usr/local/bin/node
RUN test "$(node --version)" = "v22.23.4"

WORKDIR /usr/src/app

RUN apt-get update -qq && \
    apt-get install -y build-essential default-mysql-client libmariadb-dev git graphviz && \
    apt-get clean

RUN bundle config set --local path 'vendor/bundle'

ENV BUNDLE_PATH="/usr/local/bundle"

EXPOSE 3000
ENV BINDING=0.0.0.0
