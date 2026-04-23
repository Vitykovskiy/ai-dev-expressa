#!/usr/bin/env bash

set -euo pipefail

APP_DIR="${APP_DIR:-$(pwd)}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"
COMPOSE_FILE_INPUT="${DEPLOY_COMPOSE_FILE:-docker-compose.deploy.yml}"
TIMESTAMP="$(date -u +"%Y%m%dT%H%M%SZ")"

show_help() {
  cat <<'USAGE'
Usage:
  scripts/deploy-test-vps.sh

Required environment:
  APP_DIR                 Repo root on VPS. Defaults to current directory.
  ENV_FILE                Runtime env file for the deployed stand.
  DEPLOY_BACKEND_IMAGE    Versioned backend image ref for the selected stand.
  DEPLOY_FRONTEND_IMAGE   Versioned frontend image ref for the selected stand.

Optional environment:
  DEPLOY_COMPOSE_FILE     Compose file for merge-driven deploy. Defaults to docker-compose.deploy.yml.
  DEPLOY_ARTIFACT_DIR     Artifact directory for deploy summaries and rollback files.
                          Defaults to artifacts/deploy-test/<stand-slug>.
  DEPLOY_PROJECT_NAME     Docker compose project name. Defaults to expressa-test.
  DEPLOY_STAND_SLUG       Stand slug for artifact separation and summaries.
                          Defaults to the normalized compose project name.
  DEPLOY_REGISTRY         Registry hostname used for docker login when credentials are provided.
  DEPLOY_REGISTRY_USERNAME
  DEPLOY_REGISTRY_PASSWORD
                          Optional registry pull credentials for VPS rollout.
  TEST_DEPLOY_HOST_BACKEND_PORT
                          Host loopback port for backend container. Defaults to PORT or 3000.
  TEST_DEPLOY_HOST_FRONTEND_PORT
                          Host port for frontend container. Defaults to 8080.
  SMOKE_BACKEND_BASE_URL  Optional backend smoke base URL override.
  SMOKE_FRONTEND_BASE_URL Optional frontend smoke base URL override.
  SKIP_GIT_PULL           Skip git fetch/pull when repository is already synced.
USAGE
}

if [[ "${1:-}" == "--help" ]]; then
  show_help
  exit 0
fi

require_env() {
  local name="$1"

  if [[ -z "${!name:-}" ]]; then
    echo "$name is required."
    exit 1
  fi
}

require_command() {
  local name="$1"

  if ! command -v "$name" >/dev/null 2>&1; then
    echo "Required command is not available: $name"
    exit 1
  fi
}

make_absolute_path() {
  local path="$1"

  if [[ "$path" = /* ]]; then
    printf "%s" "$path"
    return 0
  fi

  printf "%s/%s" "$APP_DIR" "$path"
}

docker_compose() {
  docker compose -f "$COMPOSE_FILE_PATH" -p "$COMPOSE_PROJECT_NAME" "$@"
}

inspect_running_image() {
  local service="$1"
  local container_id

  container_id="$(docker_compose ps -q "$service" 2>/dev/null || true)"

  if [[ -z "$container_id" ]]; then
    return 0
  fi

  docker inspect --format '{{.Config.Image}}' "$container_id" 2>/dev/null || true
}

docker_registry_login() {
  if [[ -z "${DEPLOY_REGISTRY_USERNAME:-}" || -z "${DEPLOY_REGISTRY_PASSWORD:-}" ]]; then
    return 0
  fi

  require_env "DEPLOY_REGISTRY"
  printf "%s" "$DEPLOY_REGISTRY_PASSWORD" | docker login "$DEPLOY_REGISTRY" --username "$DEPLOY_REGISTRY_USERNAME" --password-stdin
}

COMPOSE_PROJECT_NAME_INPUT="${DEPLOY_PROJECT_NAME:-expressa-test}"
COMPOSE_PROJECT_NAME="$(printf "%s" "$COMPOSE_PROJECT_NAME_INPUT" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-')"
DEPLOY_STAND_SLUG_INPUT="${DEPLOY_STAND_SLUG:-$COMPOSE_PROJECT_NAME}"
DEPLOY_STAND_SLUG="$(printf "%s" "$DEPLOY_STAND_SLUG_INPUT" | tr '[:upper:]' '[:lower:]' | tr -cs 'a-z0-9' '-')"
ARTIFACT_DIR_INPUT="${DEPLOY_ARTIFACT_DIR:-artifacts/deploy-test/$DEPLOY_STAND_SLUG}"
COMPOSE_FILE_PATH="$(make_absolute_path "$COMPOSE_FILE_INPUT")"
ARTIFACT_DIR="$(make_absolute_path "$ARTIFACT_DIR_INPUT")"
ROLLBACK_FILE="$ARTIFACT_DIR/rollback-$DEPLOY_STAND_SLUG-$TIMESTAMP.env"
SUMMARY_FILE="$ARTIFACT_DIR/deploy-test-$DEPLOY_STAND_SLUG-$TIMESTAMP.summary.md"

if [[ -z "${DEPLOY_BACKEND_IMAGE:-}" || -z "${DEPLOY_FRONTEND_IMAGE:-}" ]]; then
  echo "DEPLOY_BACKEND_IMAGE and DEPLOY_FRONTEND_IMAGE are required."
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

require_command "docker"
require_command "curl"

if ! docker compose version >/dev/null 2>&1; then
  echo "docker compose plugin is required."
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE_PATH" ]]; then
  echo "Compose file not found: $COMPOSE_FILE_PATH"
  exit 1
fi

mkdir -p "$ARTIFACT_DIR"

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

export ENV_FILE
export DEPLOY_STAND_SLUG
export DEPLOY_BACKEND_IMAGE
export DEPLOY_FRONTEND_IMAGE
export TEST_DEPLOY_HOST_BACKEND_PORT="${TEST_DEPLOY_HOST_BACKEND_PORT:-${PORT:-3000}}"
export TEST_DEPLOY_HOST_FRONTEND_PORT="${TEST_DEPLOY_HOST_FRONTEND_PORT:-8080}"

docker_registry_login

PREVIOUS_BACKEND_IMAGE="$(inspect_running_image backend)"
PREVIOUS_FRONTEND_IMAGE="$(inspect_running_image frontend)"

cat >"$ROLLBACK_FILE" <<ROLLBACK
DEPLOY_BACKEND_IMAGE=${PREVIOUS_BACKEND_IMAGE}
DEPLOY_FRONTEND_IMAGE=${PREVIOUS_FRONTEND_IMAGE}
DEPLOY_COMPOSE_FILE=${COMPOSE_FILE_PATH}
ENV_FILE=${ENV_FILE}
DEPLOY_PROJECT_NAME=${COMPOSE_PROJECT_NAME}
DEPLOY_STAND_SLUG=${DEPLOY_STAND_SLUG}
TEST_DEPLOY_HOST_BACKEND_PORT=${TEST_DEPLOY_HOST_BACKEND_PORT}
TEST_DEPLOY_HOST_FRONTEND_PORT=${TEST_DEPLOY_HOST_FRONTEND_PORT}
SMOKE_BACKEND_BASE_URL=${SMOKE_BACKEND_BASE_URL:-}
SMOKE_FRONTEND_BASE_URL=${SMOKE_FRONTEND_BASE_URL:-}
ROLLBACK

docker_compose config >/dev/null
docker_compose pull backend frontend
docker_compose up -d backend frontend

BACKEND_BASE_URL="${SMOKE_BACKEND_BASE_URL:-http://127.0.0.1:${TEST_DEPLOY_HOST_BACKEND_PORT}}"
FRONTEND_BASE_URL="${SMOKE_FRONTEND_BASE_URL:-http://127.0.0.1:${TEST_DEPLOY_HOST_FRONTEND_PORT}}"

for attempt in {1..30}; do
  if curl --fail --silent "$BACKEND_BASE_URL/health" >/dev/null; then
    break
  fi

  if [[ "$attempt" -eq 30 ]]; then
    curl --fail --silent --show-error "$BACKEND_BASE_URL/health" >/dev/null
  fi

  sleep 2
done

curl --fail --silent --show-error "$FRONTEND_BASE_URL/" >/dev/null

curl \
  --fail \
  --silent \
  --show-error \
  --header "x-test-telegram-id: ${ADMIN_TELEGRAM_ID}" \
  "$BACKEND_BASE_URL/backoffice/orders" >/dev/null

docker_compose exec -T backend node <<'NODE'
const { ConfigValidationError, loadAccessConfig } = require("./dist/identity-access/config/access-config.js");

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

cat >"$SUMMARY_FILE" <<SUMMARY
# Deploy Test Summary

- Timestamp UTC: \`$TIMESTAMP\`
- Stand slug: \`$DEPLOY_STAND_SLUG\`
- Compose project: \`$COMPOSE_PROJECT_NAME\`
- Compose file: \`$COMPOSE_FILE_PATH\`
- Env file: \`$ENV_FILE\`
- Backend image: \`$DEPLOY_BACKEND_IMAGE\`
- Frontend image: \`$DEPLOY_FRONTEND_IMAGE\`
- Backend URL: \`$BACKEND_BASE_URL\`
- Frontend URL: \`$FRONTEND_BASE_URL\`
- Rollback file: \`$ROLLBACK_FILE\`
SUMMARY
