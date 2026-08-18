#!/usr/bin/env bash
set -euo pipefail

cd "$HOME/workspace/meygod"
git pull --ff-only
pnpm install
pnpm build
systemctl --user restart meygod-site.service
echo "The Vigil is updated."
