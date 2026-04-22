#!/usr/bin/env bash
set -Eeuo pipefail

ARTIFACT_DIR="${LOCAL_E2E_ARTIFACT_DIR:-artifacts/qa-005-local-e2e}"
IMAGE_TAG="${LOCAL_E2E_IMAGE_TAG:-expressa-local-e2e:qa-005}"
DEFAULT_BASE_IMAGE="mcr.microsoft.com/playwright:v1.59.1-noble"
CACHED_BASE_IMAGE="mcr.microsoft.com/playwright:v1.55.0-noble"
BASE_IMAGE="${LOCAL_E2E_BASE_IMAGE:-}"
CHROMIUM_EXECUTABLE_PATH="${LOCAL_E2E_CHROMIUM_EXECUTABLE_PATH:-}"
TEST_COMMAND="${LOCAL_E2E_TEST_COMMAND:-npm --prefix e2e test}"
RUN_ID="${LOCAL_E2E_RUN_ID:-$(date -u +%Y%m%dT%H%M%SZ)}"
NO_CACHE_FLAG=()

usage() {
  cat <<'USAGE'
Usage:
  scripts/run-local-container-e2e.sh [--smoke-only] [--artifact-dir <dir>] [--no-cache]

Environment:
  LOCAL_E2E_ARTIFACT_DIR   Artifact directory. Defaults to artifacts/qa-005-local-e2e.
  LOCAL_E2E_IMAGE_TAG      Docker image tag. Defaults to expressa-local-e2e:qa-005.
  LOCAL_E2E_BASE_IMAGE     Docker base image. Defaults to the current Playwright image.
  LOCAL_E2E_TEST_COMMAND   Command executed inside the container. Defaults to npm --prefix e2e test.
  LOCAL_E2E_RUN_ID         Evidence run id. Defaults to UTC timestamp.
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --artifact-dir)
      ARTIFACT_DIR="${2:?--artifact-dir requires a value}"
      shift 2
      ;;
    --smoke-only)
      TEST_COMMAND="npm --prefix e2e run test:smoke"
      shift
      ;;
    --no-cache)
      NO_CACHE_FLAG=(--no-cache)
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

mkdir -p "$ARTIFACT_DIR"
ARTIFACT_ABS="$(cd "$ARTIFACT_DIR" && pwd)"
HOST_LOG="$ARTIFACT_ABS/local-e2e-$RUN_ID.host.log"
HOST_SUMMARY="$ARTIFACT_ABS/local-e2e-$RUN_ID.host.summary.md"

exec > >(tee -a "$HOST_LOG") 2>&1

write_host_summary() {
  local status="$1"
  local detail="$2"
  {
    echo "# QA-005 local container e2e host summary"
    echo
    echo "- Status: \`$status\`"
    echo "- Detail: $detail"
    echo "- Run id: \`$RUN_ID\`"
    echo "- Image: \`$IMAGE_TAG\`"
    echo "- Base image: \`${BASE_IMAGE:-not selected}\`"
    echo "- Test command: \`$TEST_COMMAND\`"
    echo "- Host log: \`$HOST_LOG\`"
    echo "- Container summary: \`$ARTIFACT_ABS/local-e2e-$RUN_ID.container.summary.md\`"
  } > "$HOST_SUMMARY"
}

docker_volume_path() {
  if command -v cygpath >/dev/null 2>&1; then
    cygpath -w "$ARTIFACT_ABS"
    return
  fi

  echo "$ARTIFACT_ABS"
}

if ! command -v docker >/dev/null 2>&1; then
  write_host_summary "failed" "docker command is unavailable"
  exit 1
fi

if ! docker info >/dev/null 2>&1; then
  write_host_summary "failed" "docker daemon is unavailable"
  exit 1
fi

SOURCE_COMMIT="${LOCAL_E2E_SOURCE_COMMIT:-unknown}"
if [[ "$SOURCE_COMMIT" == "unknown" ]] && command -v git >/dev/null 2>&1; then
  SOURCE_COMMIT="$(git rev-parse HEAD 2>/dev/null || echo unknown)"
fi

if [[ -z "$BASE_IMAGE" ]]; then
  BASE_IMAGE="$DEFAULT_BASE_IMAGE"
  if ! docker image inspect "$DEFAULT_BASE_IMAGE" >/dev/null 2>&1 \
    && docker image inspect "$CACHED_BASE_IMAGE" >/dev/null 2>&1; then
    BASE_IMAGE="$CACHED_BASE_IMAGE"
    CHROMIUM_EXECUTABLE_PATH="/ms-playwright/chromium-1187/chrome-linux/chrome"
  fi
fi

echo "Building local e2e image $IMAGE_TAG."
if ! docker build \
  -f Dockerfile.e2e \
  --build-arg "LOCAL_E2E_BASE_IMAGE=$BASE_IMAGE" \
  --build-arg "LOCAL_E2E_SOURCE_COMMIT=$SOURCE_COMMIT" \
  --build-arg "LOCAL_E2E_CHROMIUM_EXECUTABLE_PATH=$CHROMIUM_EXECUTABLE_PATH" \
  -t "$IMAGE_TAG" \
  "${NO_CACHE_FLAG[@]}" \
  .; then
  write_host_summary "failed" "docker build failed"
  exit 1
fi

echo "Running local e2e container."
CONTAINER_EXIT=0
docker run --rm \
  -e "LOCAL_E2E_RUN_ID=$RUN_ID" \
  -e "LOCAL_E2E_TEST_COMMAND=$TEST_COMMAND" \
  -e "LOCAL_E2E_SOURCE_COMMIT=$SOURCE_COMMIT" \
  -v "$(docker_volume_path):/artifacts" \
  "$IMAGE_TAG" || CONTAINER_EXIT=$?

if [[ "$CONTAINER_EXIT" -ne 0 ]]; then
  write_host_summary "failed" "container exited with $CONTAINER_EXIT"
  exit "$CONTAINER_EXIT"
fi

write_host_summary "passed" "containerized e2e completed"
echo "Local container e2e completed. Summary: $HOST_SUMMARY"
