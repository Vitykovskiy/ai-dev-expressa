#!/usr/bin/env bash

set -uo pipefail

MODE="run"
ARTIFACT_DIR="${TEST_E2E_ARTIFACT_DIR:-artifacts/remote-e2e}"

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
  TEST_E2E_BASE_URL               Published frontend origin for remote e2e stand.
                                  Falls back to E2E_BASE_URL or https://expressa-e2e-test.vitykovskiy.ru.
  TEST_E2E_TELEGRAM_ID            Test-mode Telegram id allowed on the remote stand.
                                  Falls back to E2E_TEST_TELEGRAM_ID or ADMIN_TELEGRAM_ID.

Optional environment:
  TEST_E2E_ENV_FILE               Optional env file to source before resolving route variables.
                                  Falls back to ENV_FILE when present.
  TEST_E2E_ARTIFACT_DIR           Artifact directory. Defaults to artifacts/remote-e2e.
  TEST_E2E_COMMAND                Local Playwright command. Defaults to npm --prefix e2e test.
  TEST_E2E_API_PROBE_PATH         Test-mode API probe path. Defaults to /backoffice/orders.
  TEST_E2E_FRONTEND_PATH          Frontend path to check. Defaults to /menu.
  TEST_E2E_CURL_TIMEOUT           Curl timeout in seconds. Defaults to 10.
  TEST_E2E_STAND_COMMIT           Explicit deployed commit/version for evidence.
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

resolve_route_env() {
  TEST_E2E_BASE_URL="${TEST_E2E_BASE_URL:-${E2E_BASE_URL:-https://expressa-e2e-test.vitykovskiy.ru}}"
  TEST_E2E_TELEGRAM_ID="${TEST_E2E_TELEGRAM_ID:-${E2E_TEST_TELEGRAM_ID:-${ADMIN_TELEGRAM_ID:-123456789}}}"
  TEST_E2E_COMMAND="${TEST_E2E_COMMAND:-npm --prefix e2e test}"
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
  status="$(
    curl \
      --location \
      --silent \
      --show-error \
      --output /dev/null \
      --write-out "%{http_code}" \
      --max-time "$CURL_TIMEOUT" \
      "$@" \
      "$url" 2>>"$LOG_FILE"
  )"

  if [[ "$status" =~ ^[23] ]]; then
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
- Base URL: \`${TEST_E2E_BASE_URL:-unset}\`
- Test Telegram id: \`${TEST_E2E_TELEGRAM_ID:-unset}\`
- Mode: \`$MODE\`
- E2E command: \`${TEST_E2E_COMMAND:-not-run}\`
- Log: \`$LOG_FILE\`
SUMMARY
}

CURL_TIMEOUT="${TEST_E2E_CURL_TIMEOUT:-10}"
API_PROBE_PATH="${TEST_E2E_API_PROBE_PATH:-/backoffice/orders}"
FRONTEND_PATH="${TEST_E2E_FRONTEND_PATH:-/menu}"

source_env_file
resolve_route_env

require_env "TEST_E2E_BASE_URL"

STAND_COMMIT="$(lookup_stand_commit)"
BASE_URL="$(trim_trailing_slash "$TEST_E2E_BASE_URL")"
API_PROBE_URL="$(join_url "$BASE_URL" "$API_PROBE_PATH")"
FRONTEND_URL="$(join_url "$BASE_URL" "$FRONTEND_PATH")"

log "Remote e2e route started."
log "Stand commit/version: ${STAND_COMMIT:-unknown}"
log "Base URL: $BASE_URL"
log "Mode: $MODE"

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

export E2E_BASE_URL="$BASE_URL"
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
