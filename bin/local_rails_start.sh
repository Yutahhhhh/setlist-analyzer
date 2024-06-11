#!/bin/bash

set -eu

bundle config set system 'true'
bundle config set clean 'true'
bundle install

${BASH_SOURCE%/*}/wait_for_mysql.sh

set +e
bin/rails db:create
bin/rails ridgepole:apply
bin/rails db:seed
set -e

# sidekiq起動
bundle exec sidekiq -C config/sidekiq.yml &

export PATH="$PATH:/usr/src/app/bin"

# server.pidが存在する場合のみ削除
if [ -f ./tmp/pids/server.pid ]; then
    rm ./tmp/pids/server.pid
fi

bin/rails server -b 0.0.0.0