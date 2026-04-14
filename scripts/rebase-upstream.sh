#!/usr/bin/env bash
set -euo pipefail

git fetch origin
git checkout custom
git rebase origin/upstream
./node_modules/.bin/gulp build
git push --force-with-lease origin custom
