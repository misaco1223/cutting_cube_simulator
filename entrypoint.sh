#!/usr/bin/env bash
# exit on error
set -o errexit

rm -f tmp/pids/server.pid

bundle exec rails db:migrate
bunlde exec rails db:seed

# xvfbをバックグラウンドで起動
Xvfb :99 -screen 0 1024x768x24 &

# 環境変数DISPLAYを設定
export DISPLAY=:99

# サーバー起動（最終的に必要なコマンドを実行）
exec "$@"