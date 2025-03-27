#!/usr/bin/env bash
# exit on error
set -o errexit

rm -f tmp/pids/server.pid

bundle exec rails assets:precompile
bundle exec rails db:migrate

npm run build

# サーバー起動（最終的に必要なコマンドを実行）
exec "$@"