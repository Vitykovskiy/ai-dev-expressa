#!/usr/bin/env bash

set -euo pipefail

APP_DIR="${APP_DIR:-$(pwd)}"
RESTART_COMMAND="${DEPLOY_RESTART_COMMAND:-}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"

require_env() {
  local name="$1"

  if [[ -z "${!name:-}" ]]; then
    echo "$name is required in $ENV_FILE."
    exit 1
  fi
}

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

require_env "ADMIN_TELEGRAM_ID"
require_env "BACKOFFICE_CORS_ORIGINS"

if [[ "${NODE_ENV:-}" != "test" ]]; then
  echo "NODE_ENV must be set to test on the test VPS."
  exit 1
fi

if [[ "${DISABLE_TG_AUTH:-}" != "true" ]]; then
  echo "DISABLE_TG_AUTH must be true on the test VPS."
  exit 1
fi

npm ci --prefix backend
npm ci --prefix frontend
npm run build --prefix backend
npm run build --prefix frontend

eval "$RESTART_COMMAND"

BACKEND_BASE_URL="${SMOKE_BACKEND_BASE_URL:-http://127.0.0.1:${PORT:-3000}}"

for attempt in {1..30}; do
  if curl --fail --silent "$BACKEND_BASE_URL/health" >/dev/null; then
    break
  fi

  if [[ "$attempt" -eq 30 ]]; then
    curl --fail --silent --show-error "$BACKEND_BASE_URL/health" >/dev/null
  fi

  sleep 2
done

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
