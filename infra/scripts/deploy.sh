#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd -- "${SCRIPT_DIR}/../.." && pwd)"
COMPOSE_DIR="${REPO_ROOT}/infra/docker"
COMPOSE_FILE="${COMPOSE_DIR}/compose.yml"

for required_file in "${COMPOSE_DIR}/.env" "${COMPOSE_DIR}/.env.server"; do
  if [[ ! -f "${required_file}" ]]; then
    echo "Missing required deployment file: ${required_file}" >&2
    exit 1
  fi
done

cd "${COMPOSE_DIR}"

docker compose -f "${COMPOSE_FILE}" config >/dev/null
docker compose -f "${COMPOSE_FILE}" up -d --build --remove-orphans
