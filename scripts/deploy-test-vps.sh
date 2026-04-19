#!/usr/bin/env bash

set -euo pipefail

APP_DIR="${APP_DIR:-$(pwd)}"
RESTART_COMMAND="${DEPLOY_RESTART_COMMAND:-}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"

if [[ -z "$RESTART_COMMAND" ]]; then
  echo "DEPLOY_RESTART_COMMAND is required."
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Environment file not found: $ENV_FILE"
  exit 1
fi

cd "$APP_DIR"

if [[ "${SKIP_GIT_PULL:-false}" != "true" ]]; then
  git fetch --prune origin
  git pull --ff-only origin main
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

if [[ -z "${ADMIN_TELEGRAM_ID:-}" ]]; then
  echo "ADMIN_TELEGRAM_ID is required in $ENV_FILE."
  exit 1
fi

if [[ "${NODE_ENV:-}" != "test" ]]; then
  echo "NODE_ENV must be set to test on the test VPS."
  exit 1
fi

if [[ "${DISABLE_TG_AUTH:-}" != "true" ]]; then
  echo "DISABLE_TG_AUTH must be true on the test VPS."
  exit 1
fi

rm -rf backend/node_modules frontend/node_modules
npm install --prefix backend
npm install --prefix frontend
npm run build --prefix backend
npm run build --prefix frontend

eval "$RESTART_COMMAND"

BACKEND_BASE_URL="${SMOKE_BACKEND_BASE_URL:-http://127.0.0.1:${PORT:-3000}}"

curl --fail --silent --show-error "$BACKEND_BASE_URL/health" >/dev/null
curl \
  --fail \
  --silent \
  --show-error \
  --header "x-test-telegram-id: ${ADMIN_TELEGRAM_ID}" \
  "$BACKEND_BASE_URL/backoffice/orders" >/dev/null

node <<'NODE'
const path = require("node:path");
const runtimeModulePath = path.join(process.cwd(), "backend", "dist", "identity-access", "config", "access-config.js");
const { ConfigValidationError, loadAccessConfig } = require(runtimeModulePath);

try {
  loadAccessConfig({
    NODE_ENV: "production",
    ADMIN_TELEGRAM_ID: process.env.ADMIN_TELEGRAM_ID,
    DISABLE_TG_AUTH: "true"
  });
  console.error("Expected production-like bypass to be rejected.");
  process.exit(1);
} catch (error) {
  if (!(error instanceof ConfigValidationError)) {
    throw error;
  }
}
NODE
