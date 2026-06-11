#!/usr/bin/env bash
set -euo pipefail

# Allinea il fork all'ultimo Casper ufficiale:
# aggiorna il mirror origin/upstream e fa il merge di upstream/main in custom.

if git remote get-url upstream >/dev/null 2>&1; then
    git remote set-url upstream https://github.com/TryGhost/Casper.git
else
    git remote add upstream https://github.com/TryGhost/Casper.git
fi

git fetch origin --prune
git fetch upstream main --no-tags --prune

git checkout custom
git push origin refs/remotes/upstream/main:refs/heads/upstream
git merge --no-edit upstream/main

pnpm install
./node_modules/.bin/gulp build
git push origin custom
