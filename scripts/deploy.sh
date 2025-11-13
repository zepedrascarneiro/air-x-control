#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

echo "Running deployment helper (local builder)..."
cd "$ROOT_DIR"

echo "Installing dependencies..."
npm install

echo "Running lint..."
npm run lint

echo "Running build..."
npm run build

if [[ -n "${DO_API_TOKEN:-}" && -n "${DO_APP_ID:-}" && -f "$ROOT_DIR/digitalocean/app.yaml" ]]; then
  echo "Detected DigitalOcean config. Deploying via doctl..."
  if ! command -v doctl >/dev/null 2>&1; then
    echo "doctl CLI not found. Install it from https://docs.digitalocean.com/reference/doctl/" >&2
    exit 1
  fi
  doctl auth init --access-token "$DO_API_TOKEN"
  doctl apps update "$DO_APP_ID" --spec "$ROOT_DIR/digitalocean/app.yaml"
else
  echo "DigitalOcean deployment skipped. Provide DO_API_TOKEN, DO_APP_ID and digitalocean/app.yaml if you want automatic deployment."
fi