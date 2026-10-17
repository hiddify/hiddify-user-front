#!/usr/bin/env bash
# Build user_front → hiddifypanel/static/user-front/ (admin_v2-style).
# Caps Node heap and skips `tsc` so small install hosts are not OOMed.
set -euo pipefail
cd "$(dirname "$0")/.."

HEAP_MB="${HIDDIFY_USER_FRONT_HEAP_MB:-${HIDDIFY_UI_BUILD_HEAP_MB:-1024}}"
export NODE_OPTIONS="--max-old-space-size=${HEAP_MB}${NODE_OPTIONS:+ $NODE_OPTIONS}"

if [ ! -d node_modules ]; then
  echo "Installing user_front deps (heap=${HEAP_MB}MB, maxsockets=2)…"
  npm install --no-audit --no-fund --loglevel=error --maxsockets=2
fi

echo "Building user_front → ../static/user-front (vite only; heap=${HEAP_MB}MB)…"
nice -n 10 npx --no-install vite build --minify esbuild

if [ ! -f ../static/user-front/manifest.json ] && [ ! -f ../static/user-front/.vite/manifest.json ]; then
  echo "user_front build produced no Vite manifest" >&2
  exit 1
fi
echo "User front built to hiddifypanel/static/user-front/"
