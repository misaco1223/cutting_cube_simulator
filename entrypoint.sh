#!/usr/bin/env bash
# exit on error
set -o errexit

bundle install
bundle exec rails assets:precompile
bundle exec rails db:migrate

rm -rf node_modules package-lock.json
npm install -g npm
npm run build

# サーバー起動（最終的に必要なコマンドを実行）
exec "$@"