#!/usr/bin/env bash
# Low-memory install: copy hiddify-user-front@gh-pages into static/user-front/
# and write a minimal Vite-compatible manifest.json (no npm).
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$(cd "$ROOT/../static" && pwd)/user-front"
tmp="$(mktemp -d /var/tmp/hiddify-user-front-XXXXXX)"
trap 'rm -rf "$tmp"' EXIT

echo "Installing prebuilt user_front from gh-pages → static/user-front/…"
git clone --depth 1 --branch gh-pages --single-branch --quiet \
  https://github.com/hiddify/hiddify-user-front.git "$tmp/src"

rm -rf "$OUT"
mkdir -p "$OUT"
cp -a "$tmp/src/assets" "$OUT/assets"
[ -d "$tmp/src/i18n" ] && cp -a "$tmp/src/i18n" "$OUT/i18n"

# Build a tiny manifest so Flask can resolve the entry the same way as a Vite build.
js="$(basename "$(ls "$OUT/assets"/index-*.js | head -n1)")"
css=""
if ls "$OUT/assets"/index-*.css >/dev/null 2>&1; then
  css="$(basename "$(ls "$OUT/assets"/index-*.css | head -n1)")"
fi
python3 - "$OUT" "$js" "$css" <<'PY'
import json, sys
out, js, css = sys.argv[1], sys.argv[2], sys.argv[3]
entry = {"file": f"assets/{js}", "isEntry": True, "src": "index.html"}
if css:
    entry["css"] = [f"assets/{css}"]
(out_path := __import__("pathlib").Path(out)).mkdir(parents=True, exist_ok=True)
(out_path / "manifest.json").write_text(json.dumps({"index.html": entry}, indent=2) + "\n", encoding="utf-8")
print(f"manifest entry → assets/{js}" + (f" + assets/{css}" if css else ""))
PY

# gh-pages bundles load locales from ../i18n/ (relative to the user page URL).
# Rewrite to the static/user-front tree Flask serves.
if compgen -G "$OUT/assets/*.js" >/dev/null; then
  sed -i 's|../i18n/|../static/user-front/i18n/|g' "$OUT/assets"/*.js
fi

echo "User front ready at hiddifypanel/static/user-front/ (prebuilt)"
