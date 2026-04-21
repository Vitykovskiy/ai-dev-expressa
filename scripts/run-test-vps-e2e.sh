#!/usr/bin/env bash

set -uo pipefail

MODE="run"
ARTIFACT_DIR="${TEST_E2E_ARTIFACT_DIR:-artifacts/test-vps-e2e}"

while [[ "$#" -gt 0 ]]; do
  case "$1" in
    --preflight-only)
      MODE="preflight"
      shift
      ;;
    --artifact-dir)
      if [[ -z "${2:-}" ]]; then
        echo "--artifact-dir requires a value."
        exit 2
      fi
      ARTIFACT_DIR="$2"
      shift 2
      ;;
    --help)
      cat <<'USAGE'
Usage:
  scripts/run-test-vps-e2e.sh [--preflight-only] [--artifact-dir <dir>]

Required environment:
  TEST_E2E_BACKEND_BASE_URL       Public or routable backend base URL for test VPS.
                                  Falls back to TEST_SMOKE_BACKEND_BASE_URL or http://127.0.0.1:${PORT:-3000}.
  TEST_E2E_BACKOFFICE_ORIGIN      Published backoffice origin for test VPS.
                                  Falls back to BACKOFFICE_PUBLIC_URL or first BACKOFFICE_CORS_ORIGINS value.
  TEST_E2E_TELEGRAM_ID            Test-mode Telegram id allowed on the test backend.
                                  Falls back to ADMIN_TELEGRAM_ID.
  TEST_E2E_SCENARIO               Allowlisted QA-owned e2e scenario.
                                  Supported value: menu-catalog-vps.
  TEST_E2E_COMMAND                QA-owned e2e command. Required unless TEST_E2E_SCENARIO
                                  maps to a command or --preflight-only is used.
  TEST_E2E_COMMAND_B64            Base64-encoded QA-owned e2e command. Kept for local
                                  debug/backward compatibility.

Optional environment:
  TEST_E2E_ENV_FILE               Optional env file to source before resolving route variables.
                                  Falls back to ENV_FILE when present.
  TEST_E2E_ARTIFACT_DIR           Artifact directory. Defaults to artifacts/test-vps-e2e.
  TEST_E2E_HEALTH_PATH            Backend health path. Defaults to /health.
  TEST_E2E_API_PROBE_PATH         Test-mode API probe path. Defaults to /backoffice/orders.
  TEST_E2E_FRONTEND_PATH          Frontend path to check. Defaults to /.
  TEST_E2E_CURL_TIMEOUT           Curl timeout in seconds. Defaults to 10.
  TEST_E2E_STAND_COMMIT           Explicit deployed commit/version for evidence.
  TEST_E2E_REMOTE_SSH_TARGET      Optional user@host for deployed commit lookup.
  TEST_E2E_REMOTE_SSH_PORT        Optional SSH port for deployed commit lookup.
  TEST_E2E_REMOTE_APP_DIR         Optional app directory for deployed commit lookup.
USAGE
      exit 0
      ;;
    *)
      echo "Unknown argument: $1"
      exit 2
      ;;
  esac
done

TIMESTAMP="$(date -u +"%Y%m%dT%H%M%SZ")"
mkdir -p "$ARTIFACT_DIR"
LOG_FILE="$ARTIFACT_DIR/test-vps-e2e-$TIMESTAMP.log"
SUMMARY_FILE="$ARTIFACT_DIR/test-vps-e2e-$TIMESTAMP.summary.md"

log() {
  printf "%s %s\n" "$(date -u +"%Y-%m-%dT%H:%M:%SZ")" "$*" | tee -a "$LOG_FILE"
}

fail() {
  log "FAIL: $*"
  write_summary "failed" "${1:-failed before e2e command}"
  log "Summary: $SUMMARY_FILE"
  log "Log: $LOG_FILE"
  exit 1
}

require_env() {
  local name="$1"

  if [[ -z "${!name:-}" ]]; then
    fail "$name is required."
  fi
}

source_env_file() {
  local env_file="${TEST_E2E_ENV_FILE:-${ENV_FILE:-}}"

  if [[ -z "$env_file" ]]; then
    return 0
  fi

  if [[ ! -f "$env_file" ]]; then
    fail "Env file not found: $env_file"
  fi

  set -a
  # shellcheck disable=SC1090
  source "$env_file"
  set +a
}

first_csv_value() {
  local value="$1"
  value="${value%%,*}"
  trim_whitespace "$value"
}

resolve_route_env() {
  TEST_E2E_BACKEND_BASE_URL="$(trim_whitespace "${TEST_E2E_BACKEND_BASE_URL:-${TEST_SMOKE_BACKEND_BASE_URL:-}}")"

  if [[ -z "$TEST_E2E_BACKEND_BASE_URL" ]]; then
    TEST_E2E_BACKEND_BASE_URL="http://127.0.0.1:${PORT:-${SERVER_PORT:-3000}}"
  fi

  TEST_E2E_BACKOFFICE_ORIGIN="$(trim_whitespace "${TEST_E2E_BACKOFFICE_ORIGIN:-${BACKOFFICE_PUBLIC_URL:-}}")"

  if [[ -z "$TEST_E2E_BACKOFFICE_ORIGIN" && -n "${BACKOFFICE_CORS_ORIGINS:-}" ]]; then
    TEST_E2E_BACKOFFICE_ORIGIN="$(first_csv_value "$BACKOFFICE_CORS_ORIGINS")"
  fi

  TEST_E2E_TELEGRAM_ID="$(trim_whitespace "${TEST_E2E_TELEGRAM_ID:-${ADMIN_TELEGRAM_ID:-}}")"
}

resolve_command_env() {
  log "Command resolver: TEST_E2E_SCENARIO=${TEST_E2E_SCENARIO:-unset}"
  log "Command resolver: TEST_E2E_COMMAND present: $(present_value "${TEST_E2E_COMMAND:-}")"
  log "Command resolver: TEST_E2E_COMMAND_B64 present: $(present_value "${TEST_E2E_COMMAND_B64:-}")"

  if [[ -n "${TEST_E2E_COMMAND_B64:-}" ]]; then
    log "Command resolver: TEST_E2E_COMMAND_B64 length $(value_length "$TEST_E2E_COMMAND_B64"), sha256 $(value_sha256 "$TEST_E2E_COMMAND_B64")"
  fi

  if [[ "$MODE" == "preflight" ]]; then
    return 0
  fi

  if [[ -n "${TEST_E2E_COMMAND:-}" ]]; then
    TEST_E2E_COMMAND="$(trim_whitespace "$TEST_E2E_COMMAND")"
    return 0
  fi

  if [[ -n "${TEST_E2E_COMMAND_B64:-}" ]]; then
    if ! TEST_E2E_COMMAND="$(printf "%s" "$TEST_E2E_COMMAND_B64" | base64 --decode 2>/dev/null)"; then
      fail "TEST_E2E_COMMAND_B64 is invalid base64."
    fi
    TEST_E2E_COMMAND="$(trim_whitespace "$TEST_E2E_COMMAND")"
    return 0
  fi

  if [[ -n "${TEST_E2E_SCENARIO:-}" ]]; then
    case "$TEST_E2E_SCENARIO" in
      menu-catalog-vps)
        TEST_E2E_COMMAND="npm run test:e2e:menu-catalog:vps --workspace @expressa/backend"
        ;;
      *)
        fail "Unsupported TEST_E2E_SCENARIO: $TEST_E2E_SCENARIO"
        ;;
    esac
  fi
}

present_value() {
  if [[ -n "$1" ]]; then
    printf "yes"
  else
    printf "no"
  fi
}

value_length() {
  printf "%s" "$1" | wc -c | tr -d '[:space:]'
}

value_sha256() {
  if command -v sha256sum >/dev/null 2>&1; then
    printf "%s" "$1" | sha256sum | awk '{print $1}'
    return 0
  fi

  if command -v shasum >/dev/null 2>&1; then
    printf "%s" "$1" | shasum -a 256 | awk '{print $1}'
    return 0
  fi

  printf "unavailable"
}

trim_whitespace() {
  local value="$1"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf "%s" "$value"
}

trim_trailing_slash() {
  local value="$1"
  printf "%s" "${value%/}"
}

join_url() {
  local base
  local path

  base="$(trim_trailing_slash "$1")"
  path="$2"

  if [[ "$path" != /* ]]; then
    path="/$path"
  fi

  printf "%s%s" "$base" "$path"
}

http_probe() {
  local label="$1"
  local url="$2"
  shift 2

  log "Preflight: $label -> $url"

  local status
  local curl_error_file
  local curl_exit_code

  curl_error_file="$(mktemp)"
  status="$(
    curl \
      --location \
      --silent \
      --show-error \
      --output /dev/null \
      --write-out "%{http_code}" \
      --max-time "$CURL_TIMEOUT" \
      "$@" \
      "$url" 2>"$curl_error_file"
  )"
  curl_exit_code="$?"

  if [[ -s "$curl_error_file" ]]; then
    while IFS= read -r line; do
      log "Preflight: $label curl: $line"
    done <"$curl_error_file"
  fi

  rm -f "$curl_error_file"

  if [[ "$curl_exit_code" -ne 0 && -z "$status" ]]; then
    status="000"
  fi

  if [[ "$curl_exit_code" -eq 0 && "$status" =~ ^[23] ]]; then
    log "Preflight: $label passed with HTTP $status."
    return 0
  fi

  log "Preflight: $label failed with HTTP $status."
  return 1
}

lookup_stand_commit() {
  if [[ -n "${TEST_E2E_STAND_COMMIT:-}" ]]; then
    printf "%s" "$TEST_E2E_STAND_COMMIT"
    return 0
  fi

  if [[ -n "${TEST_E2E_REMOTE_SSH_TARGET:-}" && -n "${TEST_E2E_REMOTE_APP_DIR:-}" ]]; then
    local ssh_port_args=()

    if [[ -n "${TEST_E2E_REMOTE_SSH_PORT:-}" ]]; then
      ssh_port_args=(-p "$TEST_E2E_REMOTE_SSH_PORT")
    fi

    ssh "${ssh_port_args[@]}" "$TEST_E2E_REMOTE_SSH_TARGET" \
      "cd '$TEST_E2E_REMOTE_APP_DIR' && git rev-parse HEAD" 2>>"$LOG_FILE" || true
    return 0
  fi

  if git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    git rev-parse HEAD 2>>"$LOG_FILE" || true
    return 0
  fi

  printf "unknown"
}

write_summary() {
  local status="$1"
  local reason="${2:-}"

  cat >"$SUMMARY_FILE" <<SUMMARY
# Test VPS E2E Evidence

- Status: \`$status\`
- Reason: \`$reason\`
- Timestamp UTC: \`$TIMESTAMP\`
- Stand commit/version: \`${STAND_COMMIT:-unknown}\`
- Backend base URL: \`${TEST_E2E_BACKEND_BASE_URL:-unset}\`
- Backoffice origin: \`${TEST_E2E_BACKOFFICE_ORIGIN:-unset}\`
- Test Telegram id: \`${TEST_E2E_TELEGRAM_ID:-unset}\`
- Mode: \`$MODE\`
- E2E scenario: \`${TEST_E2E_SCENARIO:-unset}\`
- E2E command: \`${TEST_E2E_COMMAND:-not-run}\`
- Log: \`$LOG_FILE\`
SUMMARY
}

CURL_TIMEOUT="${TEST_E2E_CURL_TIMEOUT:-10}"
HEALTH_PATH="${TEST_E2E_HEALTH_PATH:-/health}"
API_PROBE_PATH="${TEST_E2E_API_PROBE_PATH:-/backoffice/orders}"
FRONTEND_PATH="${TEST_E2E_FRONTEND_PATH:-/}"

log "Test VPS e2e wrapper entered."
log "Mode requested: $MODE"
log "Artifact directory: $ARTIFACT_DIR"
log "Summary path: $SUMMARY_FILE"
log "Log path: $LOG_FILE"

source_env_file
resolve_route_env
resolve_command_env

require_env "TEST_E2E_BACKEND_BASE_URL"
require_env "TEST_E2E_BACKOFFICE_ORIGIN"
require_env "TEST_E2E_TELEGRAM_ID"

if [[ "$MODE" != "preflight" ]]; then
  require_env "TEST_E2E_COMMAND"
fi

STAND_COMMIT="$(lookup_stand_commit)"
BACKEND_BASE_URL="$(trim_trailing_slash "$TEST_E2E_BACKEND_BASE_URL")"
BACKOFFICE_ORIGIN="$(trim_trailing_slash "$TEST_E2E_BACKOFFICE_ORIGIN")"
HEALTH_URL="$(join_url "$BACKEND_BASE_URL" "$HEALTH_PATH")"
API_PROBE_URL="$(join_url "$BACKEND_BASE_URL" "$API_PROBE_PATH")"
FRONTEND_URL="$(join_url "$BACKOFFICE_ORIGIN" "$FRONTEND_PATH")"

log "Test VPS e2e route started."
log "Stand commit/version: ${STAND_COMMIT:-unknown}"
log "Backend base URL: $BACKEND_BASE_URL"
log "Backoffice origin: $BACKOFFICE_ORIGIN"
log "Mode: $MODE"

http_probe "backend health" "$HEALTH_URL" || fail "backend health preflight failed."
http_probe "test-mode backoffice API" "$API_PROBE_URL" \
  --header "x-test-telegram-id: $TEST_E2E_TELEGRAM_ID" || fail "test-mode API preflight failed."
http_probe "published backoffice origin" "$FRONTEND_URL" || fail "backoffice origin preflight failed."

if [[ "$MODE" == "preflight" ]]; then
  write_summary "passed" "preflight-only completed"
  log "Preflight-only route completed."
  log "Summary: $SUMMARY_FILE"
  log "Log: $LOG_FILE"
  exit 0
fi

log "Running QA-owned e2e command."
log "QA-owned e2e command: $TEST_E2E_COMMAND"

export E2E_BACKEND_BASE_URL="$BACKEND_BASE_URL"
export E2E_BACKOFFICE_ORIGIN="$BACKOFFICE_ORIGIN"
export E2E_TEST_TELEGRAM_ID="$TEST_E2E_TELEGRAM_ID"
export E2E_STAND_COMMIT="${STAND_COMMIT:-unknown}"

bash -lc "$TEST_E2E_COMMAND" 2>&1 | tee -a "$LOG_FILE"
E2E_EXIT_CODE="${PIPESTATUS[0]}"

if [[ "$E2E_EXIT_CODE" -ne 0 ]]; then
  write_summary "failed" "e2e command exited with $E2E_EXIT_CODE"
  log "E2E command failed with exit code $E2E_EXIT_CODE."
  log "Summary: $SUMMARY_FILE"
  log "Log: $LOG_FILE"
  exit "$E2E_EXIT_CODE"
fi

write_summary "passed" "preflight and e2e command completed"
log "E2E route completed."
log "Summary: $SUMMARY_FILE"
log "Log: $LOG_FILE"
