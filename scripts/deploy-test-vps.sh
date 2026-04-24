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

smoke_json_route() {
  local url="$1"
  shift

  local headers_file
  local body_file
  headers_file="$(mktemp)"
  body_file="$(mktemp)"

  if ! curl --fail --silent --show-error --location -D "$headers_file" -o "$body_file" "$@" "$url"; then
    rm -f "$headers_file" "$body_file"
    return 1
  fi

  if ! grep -qi '^content-type:[[:space:]]*application/json' "$headers_file"; then
    local content_type
    content_type="$(grep -i '^content-type:' "$headers_file" | tail -n 1 | tr -d '\r' || true)"
    echo "Expected JSON response from $url, got ${content_type:-missing content-type}."
    echo "Response preview:"
    head -c 200 "$body_file" || true
    echo
    rm -f "$headers_file" "$body_file"
    return 1
  fi

  rm -f "$headers_file" "$body_file"
}

run_backend_node() {
  docker_compose run --rm --no-deps -T backend node "$@"
}

confirm_postgresql_ready() {
  run_backend_node <<'NODE'
const { Pool } = require("pg");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required for PostgreSQL readiness.");
  process.exit(1);
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const pool = new Pool({ connectionString: databaseUrl });

(async () => {
  try {
    for (let attempt = 1; attempt <= 30; attempt += 1) {
      try {
        await pool.query("SELECT 1");
        console.log("PostgreSQL readiness confirmed.");
        return;
      } catch (error) {
        if (attempt === 30) {
          throw error;
        }

        await sleep(2000);
      }
    }
  } finally {
    await pool.end();
  }
})().catch((error) => {
  console.error("PostgreSQL readiness failed.");
  console.error(error);
  process.exit(1);
});
NODE
}

apply_users_schema() {
  run_backend_node <<'NODE'
const { Pool } = require("pg");
const { applyUsersSchema } = require("./dist/identity-access/users/postgresql/users-schema.js");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required for users schema migration.");
  process.exit(1);
}

const pool = new Pool({ connectionString: databaseUrl });

(async () => {
  try {
    await applyUsersSchema({
      query: (queryText, values = []) => pool.query(queryText, [...values]),
    });
    console.log("Users boundary schema migration applied.");
  } finally {
    await pool.end();
  }
})().catch((error) => {
  console.error("Users boundary schema migration failed.");
  console.error(error);
  process.exit(1);
});
NODE
}

seed_feature004_e2e_preconditions() {
  if [[ "$DEPLOY_STAND_SLUG" != "test-e2e" ]]; then
    return 0
  fi

  run_backend_node <<'NODE'
const { Pool } = require("pg");

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DATABASE_URL is required for FEATURE-004 e2e preconditions.");
  process.exit(1);
}

const fixtures = [
  {
    userId: "feature004-target-user",
    telegramId: "9404002",
    displayName: "Ivan Petrov",
    telegramUsername: "@ivan_petrov",
    roles: ["customer"],
  },
  {
    userId: "feature004-ordinary-admin",
    telegramId: "9404008",
    displayName: "Ordinary Administrator",
    telegramUsername: "@ordinary_admin",
    roles: ["administrator"],
  },
  {
    userId: "feature004-barista-actor",
    telegramId: "9404006",
    displayName: "Barista Guard Actor",
    telegramUsername: "@barista_guard",
    roles: ["barista"],
  },
];

const pool = new Pool({ connectionString: databaseUrl });

(async () => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    for (const fixture of fixtures) {
      await client.query(
        `
          DELETE FROM identity_access_user_roles
          WHERE user_id IN (
            SELECT user_id
            FROM identity_access_users
            WHERE user_id = $1 OR telegram_id = $2
          )
        `,
        [fixture.userId, fixture.telegramId],
      );
      await client.query(
        `
          DELETE FROM identity_access_users
          WHERE user_id = $1 OR telegram_id = $2
        `,
        [fixture.userId, fixture.telegramId],
      );
      await client.query(
        `
          INSERT INTO identity_access_users (
            user_id,
            telegram_id,
            display_name,
            telegram_username,
            blocked
          )
          VALUES ($1, $2, $3, $4, FALSE)
        `,
        [
          fixture.userId,
          fixture.telegramId,
          fixture.displayName,
          fixture.telegramUsername,
        ],
      );

      for (const role of fixture.roles) {
        await client.query(
          `
            INSERT INTO identity_access_user_roles (user_id, role)
            VALUES ($1, $2)
          `,
          [fixture.userId, role],
        );
      }
    }

    await client.query("COMMIT");
    console.log("FEATURE-004 test-e2e preconditions seeded.");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
})().catch((error) => {
  console.error("FEATURE-004 test-e2e precondition seed failed.");
  console.error(error);
  process.exit(1);
});
NODE
}

smoke_feature004_e2e_preconditions() {
  if [[ "$DEPLOY_STAND_SLUG" != "test-e2e" ]]; then
    return 0
  fi

  local users_url="${FRONTEND_BASE_URL%/}/backoffice/users"
  local session_url="${FRONTEND_BASE_URL%/}/backoffice/auth/session"
  local target_role_url="${users_url}/feature004-target-user/role"
  local body_file
  local status

  body_file="$(mktemp)"
  curl --fail --silent --show-error --location \
    --header "x-test-telegram-id: ${ADMIN_TELEGRAM_ID}" \
    -o "$body_file" \
    "$users_url"

  docker_compose exec -T \
    -e FEATURE004_USERS_BODY_JSON="$(cat "$body_file")" \
    backend node <<'NODE'
const body = JSON.parse(process.env.FEATURE004_USERS_BODY_JSON);
const items = Array.isArray(body.items) ? body.items : [];

function requireUser(userId, expected) {
  const user = items.find((item) => item.userId === userId);
  if (!user) {
    throw new Error(`Missing FEATURE-004 e2e precondition user: ${userId}`);
  }

  for (const [key, value] of Object.entries(expected)) {
    if (Array.isArray(value)) {
      const actual = Array.isArray(user[key]) ? user[key] : [];
      for (const expectedValue of value) {
        if (!actual.includes(expectedValue)) {
          throw new Error(`${userId}.${key} is missing ${expectedValue}`);
        }
      }
    } else if (user[key] !== value) {
      throw new Error(`${userId}.${key} expected ${value}, got ${user[key]}`);
    }
  }
}

requireUser("feature004-target-user", {
  telegramUsername: "@ivan_petrov",
  roles: ["customer"],
});
requireUser("feature004-ordinary-admin", {
  telegramUsername: "@ordinary_admin",
  roles: ["administrator"],
});
requireUser("feature004-barista-actor", {
  telegramUsername: "@barista_guard",
  roles: ["barista"],
});
NODE
  rm -f "$body_file"

  body_file="$(mktemp)"
  curl --fail --silent --show-error --location \
    --header "content-type: application/json" \
    --data '{"testTelegramId":"9404006"}' \
    -o "$body_file" \
    "$session_url"

  docker_compose exec -T \
    -e FEATURE004_SESSION_BODY_JSON="$(cat "$body_file")" \
    backend node <<'NODE'
const body = JSON.parse(process.env.FEATURE004_SESSION_BODY_JSON);
const capabilities = Array.isArray(body.capabilities) ? body.capabilities : [];

if (body.telegramId !== "9404006") {
  throw new Error(`Expected barista actor telegramId 9404006, got ${body.telegramId}`);
}

if (!capabilities.includes("orders") || !capabilities.includes("availability")) {
  throw new Error("Expected barista actor to expose orders and availability capabilities.");
}

if (capabilities.includes("users")) {
  throw new Error("Barista actor must not expose users capability.");
}
NODE
  rm -f "$body_file"

  body_file="$(mktemp)"
  status="$(curl --silent --show-error --location \
    --header "x-test-telegram-id: 9404006" \
    --output "$body_file" \
    --write-out "%{http_code}" \
    "$users_url")"
  if [[ "$status" != "403" ]]; then
    echo "Expected barista users access to return 403, got $status."
    cat "$body_file"
    rm -f "$body_file"
    exit 1
  fi

  docker_compose exec -T \
    -e FEATURE004_ERROR_BODY_JSON="$(cat "$body_file")" \
    -e FEATURE004_EXPECTED_ERROR="backoffice-capability-forbidden" \
    backend node <<'NODE'
const body = JSON.parse(process.env.FEATURE004_ERROR_BODY_JSON);
if (body.message !== process.env.FEATURE004_EXPECTED_ERROR) {
  throw new Error(`Expected ${process.env.FEATURE004_EXPECTED_ERROR}, got ${body.message}`);
}
NODE
  rm -f "$body_file"

  body_file="$(mktemp)"
  status="$(curl --silent --show-error --location \
    --request PATCH \
    --header "content-type: application/json" \
    --header "x-test-telegram-id: 9404008" \
    --data '{"role":"administrator"}' \
    --output "$body_file" \
    --write-out "%{http_code}" \
    "$target_role_url")"
  if [[ "$status" != "403" ]]; then
    echo "Expected ordinary administrator role assignment to return 403, got $status."
    cat "$body_file"
    rm -f "$body_file"
    exit 1
  fi

  docker_compose exec -T \
    -e FEATURE004_ERROR_BODY_JSON="$(cat "$body_file")" \
    -e FEATURE004_EXPECTED_ERROR="administrator-role-assignment-forbidden" \
    backend node <<'NODE'
const body = JSON.parse(process.env.FEATURE004_ERROR_BODY_JSON);
if (body.message !== process.env.FEATURE004_EXPECTED_ERROR) {
  throw new Error(`Expected ${process.env.FEATURE004_EXPECTED_ERROR}, got ${body.message}`);
}
NODE
  rm -f "$body_file"
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
require_env "DATABASE_URL"
require_env "POSTGRES_DB"
require_env "POSTGRES_USER"
require_env "POSTGRES_PASSWORD"

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
docker_compose pull postgres backend frontend
docker_compose up -d postgres
confirm_postgresql_ready
apply_users_schema
seed_feature004_e2e_preconditions
docker_compose up -d backend frontend

BACKEND_BASE_URL="${SMOKE_BACKEND_BASE_URL:-http://127.0.0.1:${TEST_DEPLOY_HOST_BACKEND_PORT}}"
FRONTEND_BASE_URL="${SMOKE_FRONTEND_BASE_URL:-http://127.0.0.1:${TEST_DEPLOY_HOST_FRONTEND_PORT}}"
PROXIED_BACKOFFICE_URL="${FRONTEND_BASE_URL%/}/backoffice/orders"
PROXIED_BACKOFFICE_USERS_URL="${FRONTEND_BASE_URL%/}/backoffice/users"
PROXIED_CUSTOMER_SLOTS_URL="${FRONTEND_BASE_URL%/}/customer/slots"

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

smoke_json_route \
  "$PROXIED_BACKOFFICE_URL" \
  --header "x-test-telegram-id: ${ADMIN_TELEGRAM_ID}" \
  >/dev/null

smoke_json_route \
  "$PROXIED_BACKOFFICE_USERS_URL" \
  --header "x-test-telegram-id: ${ADMIN_TELEGRAM_ID}" \
  >/dev/null

smoke_json_route "$PROXIED_CUSTOMER_SLOTS_URL" >/dev/null

smoke_feature004_e2e_preconditions

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
- Proxied backoffice smoke URL: \`$PROXIED_BACKOFFICE_URL\`
- Proxied users smoke URL: \`$PROXIED_BACKOFFICE_USERS_URL\`
- Proxied customer slots smoke URL: \`$PROXIED_CUSTOMER_SLOTS_URL\`
- Rollback file: \`$ROLLBACK_FILE\`
SUMMARY
