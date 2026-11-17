#!/usr/bin/env bash
# Low-memory install (no npm): copy the CI build of this commit from hiddify-user-front@gh-pages into static/user-front/.
#
# The files are copied byte for byte, never edited. The bundle finds its locales through window.__USER_FRONT_STATIC__,
# which the panel sets to /<proxy>/static/user-front (panel/user/templates/user_front.html), so i18n/ only has to sit
# next to assets/. gh-pages also carries the Vite manifest.json that Flask reads to find the entry files.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="$(cd "$ROOT/../static" && pwd)/user-front"
REPO="https://github.com/hiddify/hiddify-user-front.git"
DEPTH=100 # gh-pages commits searched for the build of this commit
tmp="$(mktemp -d /var/tmp/hiddify-user-front-XXXXXX)"
trap 'rm -rf "$tmp"' EXIT
src="$tmp/src"

echo "Installing prebuilt user_front from gh-pages → static/user-front/…"
# Blobless: only the history is fetched here, and the files of the one build checked out below.
if ! git clone --quiet --no-checkout --filter=blob:none --depth "$DEPTH" --branch gh-pages --single-branch "$REPO" "$src" 2>/dev/null; then
  rm -rf "$src"
  git clone --quiet --no-checkout --depth "$DEPTH" --branch gh-pages --single-branch "$REPO" "$src"
fi

# The gh-pages deploy names its source commit: "Deploying to gh-pages from @ hiddify/hiddify-user-front@<sha> 🚀".
want="$(git -C "$ROOT" rev-parse HEAD 2>/dev/null || true)"
build=""
if [ -n "$want" ]; then
  build="$(git -C "$src" log --format='%H %s' | awk -v sha="@$want" '!found && index($0, sha) { print $1; found = 1 }')"
fi
if [ -n "$build" ]; then
  echo "gh-pages build of user_front ${want:0:7}: ${build:0:7}"
else
  build="$(git -C "$src" rev-parse HEAD)"
  what="${want:0:7}"
  [ -n "$want" ] || what="(not a git checkout)"
  echo "WARNING: gh-pages has no build of user_front $what; using the newest one (${build:0:7})," \
    "which may not match this panel. Run 'make build-ui' to build this commit from source." >&2
fi
git -C "$src" -c advice.detachedHead=false checkout --quiet "$build"

# Check the build before touching the installed one.
python3 - "$src" <<'PY'
import json, pathlib, sys
root = pathlib.Path(sys.argv[1])
try:
    entries = json.loads((root / "manifest.json").read_text(encoding="utf-8"))
except (OSError, ValueError) as e:
    sys.exit(f"gh-pages build has no usable manifest.json ({e})")
entry = next((e for e in entries.values() if e.get("isEntry") and e.get("file")), None)
if entry is None:
    sys.exit("gh-pages manifest.json has no entry")
missing = [f for f in [entry["file"], *(entry.get("css") or [])] if not (root / f).is_file()]
if missing:
    sys.exit(f"gh-pages build is missing {', '.join(missing)}")
if not (root / "i18n").is_dir():
    sys.exit("gh-pages build has no i18n/")
print(f"manifest entry → {entry['file']}" + "".join(f" + {c}" for c in entry.get("css") or []))
PY

rm -rf "$OUT"
mkdir -p "$OUT"
cp -a "$src/assets" "$src/i18n" "$src/manifest.json" "$OUT/"

echo "User front ready at hiddifypanel/static/user-front/ (prebuilt)"
