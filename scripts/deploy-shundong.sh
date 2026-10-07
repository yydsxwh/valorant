#!/usr/bin/env bash
# Publish 瞬懂 to www.yydsxwh.com/products/shundong/ — same path 日事 uses for /products/days/
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
KEY="${DEPLOY_SSH_KEY_FILE:-$HOME/.ssh/yyds_aliyun}"
HOST="${DEPLOY_SSH_HOST:-${DEPLOY_HOST:-}}"
if [[ -z "$HOST" ]]; then
  echo "缺少 DEPLOY_SSH_HOST 或 DEPLOY_HOST，例如 admin@your-server" >&2
  exit 1
fi
DEST="${DEPLOY_REMOTE_DIR:-/var/www/yyds-course-platform/public/products/shundong}"

if [[ ! -f "$KEY" ]]; then
  echo "Missing SSH key at $KEY" >&2
  exit 1
fi

ssh -i "$KEY" -o IdentitiesOnly=yes "$HOST" "mkdir -p '$DEST'"
scp -i "$KEY" -o IdentitiesOnly=yes -r "$ROOT/docs/." "$HOST:$DEST/"
echo "Published $HOST:$DEST"
echo "Open https://www.yydsxwh.com/products/shundong/"
echo "Listing: https://www.yydsxwh.com/products"
