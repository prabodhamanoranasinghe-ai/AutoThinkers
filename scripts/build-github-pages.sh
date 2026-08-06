#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

API_DIR="src/app/api"
RSS_ROUTE="src/app/rss.xml"
ADMIN_DIR="src/app/admin"
BACKUP_DIR=".static-export-backup"

rm -rf "$BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

if [ -d "$API_DIR" ]; then
  mv "$API_DIR" "$BACKUP_DIR/api"
fi

if [ -d "$RSS_ROUTE" ]; then
  mv "$RSS_ROUTE" "$BACKUP_DIR/rss.xml"
fi

# Keep the draft studio local-only — never ship /admin to public Pages.
if [ -d "$ADMIN_DIR" ]; then
  mv "$ADMIN_DIR" "$BACKUP_DIR/admin"
fi

cleanup() {
  if [ -d "$BACKUP_DIR/api" ]; then
    mv "$BACKUP_DIR/api" "$API_DIR"
  fi
  if [ -d "$BACKUP_DIR/rss.xml" ]; then
    mv "$BACKUP_DIR/rss.xml" "$RSS_ROUTE"
  fi
  if [ -d "$BACKUP_DIR/admin" ]; then
    mv "$BACKUP_DIR/admin" "$ADMIN_DIR"
  fi
  rm -rf "$BACKUP_DIR"
}
trap cleanup EXIT

export GITHUB_PAGES=true
export NEXT_PUBLIC_STATIC_EXPORT=true
export NEXT_PUBLIC_BASE_PATH="${NEXT_PUBLIC_BASE_PATH:-/AutoThinkers}"
export NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://prabodhamanoranasinghe-ai.github.io/AutoThinkers}"

node scripts/generate-rss.mjs
npm run build

# GitHub Pages should not run Jekyll on underscore paths
touch out/.nojekyll
