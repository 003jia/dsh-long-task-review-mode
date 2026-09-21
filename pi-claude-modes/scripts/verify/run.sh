#!/usr/bin/env bash
# Verify pi-claude-modes: TypeScript check + runtime smoke test of the v2 UI.
# Requires: node, a typescript compiler (tsc) and esbuild (used from the pi
# installation if not found on PATH). Override with TS_BIN / ESBUILD_BIN.
set -euo pipefail

# PKG_ROOT is this package (pi-claude-modes); REPO_ROOT is the checkout that
# owns the shared node_modules (one level up).
PKG_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ROOT="$PKG_ROOT"
REPO_ROOT="$(cd "$PKG_ROOT/.." && pwd)"
VERIFY="$ROOT/scripts/verify"
WORK="$(mktemp -d /tmp/pi-claude-modes-verify.XXXXXX)"
trap 'rm -rf "$WORK"' EXIT

# Locate the installed pi package so we can reuse its bundled esbuild/typescript.
resolve_pi_pkg() {
  local candidate dir real
  for candidate in "$(command -v pi 2>/dev/null || true)" \
                   "$(npm root -g 2>/dev/null || true)/@earendil-works/pi-coding-agent"; do
    [ -n "$candidate" ] || continue
    if [ -d "$candidate" ]; then
      printf '%s\n' "$candidate"
      return 0
    fi
    if [ -x "$candidate" ]; then
      real="$(readlink -f "$candidate" 2>/dev/null || readlink "$candidate" 2>/dev/null || printf '%s' "$candidate")"
      case "$real" in
        /*) ;;
        *) real="$(cd "$(dirname "$candidate")" && pwd)/$real" ;;
      esac
      dir="$(cd "$(dirname "$real")" 2>/dev/null && pwd || true)"
      while [ -n "$dir" ] && [ "$dir" != "/" ]; do
        if [ -f "$dir/package.json" ] && grep -q '"@earendil-works/pi-coding-agent"' "$dir/package.json" 2>/dev/null; then
          printf '%s\n' "$dir"
          return 0
        fi
        if [ -d "$dir/@earendil-works/pi-coding-agent" ]; then
          printf '%s\n' "$dir/@earendil-works/pi-coding-agent"
          return 0
        fi
        dir="$(dirname "$dir")"
      done
    fi
  done
  return 1
}

PI_PKG="$(resolve_pi_pkg || true)"

TS_BIN="${TS_BIN:-}"
if [ -z "$TS_BIN" ] || [ ! -x "$TS_BIN" ]; then
  for cand in "$REPO_ROOT/node_modules/typescript/bin/tsc" \
    "$ROOT/node_modules/typescript/bin/tsc" \
    "$VERIFY/node_modules/typescript/bin/tsc" \
    "$PI_PKG/node_modules/typescript/bin/tsc" \
    "$(command -v tsc 2>/dev/null || true)"; do
    if [ -n "$cand" ] && [ -x "$cand" ]; then TS_BIN="$cand"; break; fi
  done
fi

ESBUILD_BIN="${ESBUILD_BIN:-}"
if [ -z "$ESBUILD_BIN" ] || [ ! -x "$ESBUILD_BIN" ]; then
  # Only real JS/executable entries here: `node_modules/.bin/esbuild` is a
  # shell wrapper and cannot be executed with `node`.
  for cand in "$PI_PKG/node_modules/esbuild/bin/esbuild" \
    "$PI_PKG/node_modules/@earendil-works/pi-coding-agent/node_modules/esbuild/bin/esbuild" \
    "$REPO_ROOT/node_modules/esbuild/bin/esbuild" \
    "$ROOT/node_modules/esbuild/bin/esbuild" \
    "$HOME/.nvm/versions/node/$(node -v | tr -d v)/lib/node_modules/@earendil-works/pi-coding-agent/node_modules/esbuild/bin/esbuild" \
    "$(command -v esbuild 2>/dev/null || true)"; do
    if [ -n "$cand" ] && [ -x "$cand" ]; then ESBUILD_BIN="$cand"; break; fi
  done
fi

echo "== TypeScript check =="
if [ -n "$TS_BIN" ] && [ -x "$TS_BIN" ]; then
  node "$TS_BIN" -p "$VERIFY/tsconfig.json"
  echo "   ok: typecheck passed"
else
  echo "   warn: tsc not found (set TS_BIN, e.g. to a typescript@5.9 bin/tsc)"
fi

echo "== Bundle for smoke test =="
if [ -z "$ESBUILD_BIN" ] || [ ! -x "$ESBUILD_BIN" ]; then
  echo "   ERROR: esbuild not found (set ESBUILD_BIN)"; exit 1
fi
cp "$ROOT/extensions/utils.ts" "$WORK/utils.ts"
sed 's#@earendil-works/pi-tui#./pi-tui-stub.ts#g' "$ROOT/extensions/index.ts" > "$WORK/index.ts"
sed 's#@earendil-works/pi-coding-agent#./pi-coding-agent-stub.ts#g' "$ROOT/extensions/model-preference.ts" > "$WORK/model-preference.ts"
sed \
  -e 's#@earendil-works/pi-coding-agent#./pi-coding-agent-stub.ts#g' \
  -e 's#@earendil-works/pi-tui#./pi-tui-stub.ts#g' \
  "$ROOT/extensions/claude-editor.ts" > "$WORK/claude-editor.ts"
cp "$VERIFY/pi-tui-stub.ts" "$WORK/pi-tui-stub.ts"
cp "$VERIFY/pi-coding-agent-stub.ts" "$WORK/pi-coding-agent-stub.ts"
cp "$VERIFY/smoke.mjs" "$WORK/smoke.mjs"
node "$ESBUILD_BIN" "$WORK/index.ts" --bundle --format=esm --platform=node --outfile="$WORK/bundle.mjs" --log-level=warning
echo "   ok: bundled to $WORK/bundle.mjs"

echo "== Smoke test (Claude-style UI v2) =="
cd "$WORK" && node smoke.mjs
