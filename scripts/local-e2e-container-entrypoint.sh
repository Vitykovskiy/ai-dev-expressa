#!/usr/bin/env bash
set -Eeuo pipefail

ARTIFACT_DIR="${LOCAL_E2E_ARTIFACT_DIR:-/artifacts}"
RUN_ID="${LOCAL_E2E_RUN_ID:-$(date -u +%Y%m%dT%H%M%SZ)}"
TEST_COMMAND="${LOCAL_E2E_TEST_COMMAND:-npm --prefix e2e test}"
BACKEND_BASE_URL="${E2E_BACKEND_BASE_URL:-http://127.0.0.1:3000}"
FRONTEND_BASE_URL="${E2E_BASE_URL:-http://127.0.0.1:4173}"
LOG_FILE="$ARTIFACT_DIR/local-e2e-$RUN_ID.container.log"
SUMMARY_FILE="$ARTIFACT_DIR/local-e2e-$RUN_ID.container.summary.md"
BACKEND_PID=""
FRONTEND_PID=""

export NODE_ENV="${NODE_ENV:-test}"
export PORT="${PORT:-3000}"
export ADMIN_TELEGRAM_ID="${ADMIN_TELEGRAM_ID:-123456789}"
export DISABLE_TG_AUTH="${DISABLE_TG_AUTH:-true}"
export BACKOFFICE_CORS_ORIGINS="${BACKOFFICE_CORS_ORIGINS:-http://127.0.0.1:4173,http://localhost:4173}"

mkdir -p "$ARTIFACT_DIR/playwright-report" "$ARTIFACT_DIR/test-results"
exec > >(tee -a "$LOG_FILE") 2>&1

write_summary() {
  local status="$1"
  local detail="$2"
  {
    echo "# QA-005 local container e2e summary"
    echo
    echo "- Status: \`$status\`"
    echo "- Detail: $detail"
    echo "- Run id: \`$RUN_ID\`"
    echo "- Source commit: \`${LOCAL_E2E_SOURCE_COMMIT:-unknown}\`"
    echo "- Backend target: \`$BACKEND_BASE_URL\`"
    echo "- Frontend target: \`$FRONTEND_BASE_URL\`"
    echo "- Test command: \`$TEST_COMMAND\`"
    echo "- Container log: \`$LOG_FILE\`"
    echo "- Browser report: \`$ARTIFACT_DIR/playwright-report/index.html\`"
    echo "- Test results: \`$ARTIFACT_DIR/test-results\`"
  } > "$SUMMARY_FILE"
}

cleanup() {
  if [[ -n "$FRONTEND_PID" ]] && kill -0 "$FRONTEND_PID" >/dev/null 2>&1; then
    kill "$FRONTEND_PID" >/dev/null 2>&1 || true
  fi
  if [[ -n "$BACKEND_PID" ]] && kill -0 "$BACKEND_PID" >/dev/null 2>&1; then
    kill "$BACKEND_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

wait_for_url() {
  local url="$1"
  local name="$2"
  local attempts="${3:-60}"

  for ((attempt = 1; attempt <= attempts; attempt += 1)); do
    if curl -fsS "$url" >/dev/null 2>&1; then
      echo "$name is ready at $url."
      return 0
    fi
    sleep 1
  done

  echo "$name did not become ready at $url." >&2
  return 1
}

echo "Starting backend."
npm --prefix backend run start &
BACKEND_PID="$!"

if ! wait_for_url "$BACKEND_BASE_URL/health" "backend"; then
  write_summary "failed" "backend preflight failed"
  exit 1
fi

echo "Starting frontend preview."
npm --prefix frontend run preview -- --host 127.0.0.1 --port 4173 &
FRONTEND_PID="$!"

if ! wait_for_url "$FRONTEND_BASE_URL" "frontend"; then
  write_summary "failed" "frontend preflight failed"
  exit 1
fi

echo "Checking test-mode backoffice session."
if ! curl -fsS \
  -H "content-type: application/json" \
  -d '{"testTelegramId":"123456789"}' \
  "$BACKEND_BASE_URL/backoffice/auth/session" \
  | grep -q '"capabilities"'; then
  write_summary "failed" "backoffice session preflight failed"
  exit 1
fi

echo "Running browser e2e command."
E2E_EXIT=0
PLAYWRIGHT_HTML_REPORT="$ARTIFACT_DIR/playwright-report" \
PLAYWRIGHT_TEST_RESULTS_DIR="$ARTIFACT_DIR/test-results" \
E2E_BASE_URL="$FRONTEND_BASE_URL" \
E2E_BACKEND_BASE_URL="$BACKEND_BASE_URL" \
bash -lc "$TEST_COMMAND" || E2E_EXIT=$?

if [[ "$E2E_EXIT" -ne 0 ]]; then
  write_summary "failed" "browser e2e command exited with $E2E_EXIT"
  exit "$E2E_EXIT"
fi

write_summary "passed" "preflight and browser e2e completed"
echo "Container summary: $SUMMARY_FILE"
