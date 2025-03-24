#!/user/bin/env bash
# exit on error
set -o errexit

bundle install
bundle exec rails assets:precompile
bundle exec rails db:migrate

# 独自に追加してみた
npm install
npm run build