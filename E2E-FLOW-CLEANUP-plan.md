# E2E Flow Cleanup Work Plan

## Source Requirements

1. Application is published on merge/push to `main` at `https://expressa-e2e-test.vitykovskiy.ru`.
2. QA creates and runs Playwright e2e tests locally from the repository; tests use the deployed e2e application URL by default.
3. VPS/remote/local-container scripts that run e2e tests are removed and no longer mentioned.
4. E2E flow cleanup removes historical runner data, references and descriptions from the repository.

## Status Legend

- `[ ]` Pending
- `[~]` In progress
- `[x]` Done

## Subtasks

### 01. Canonical e2e command and runner artifact removal

- Status: `[x]`
- Context: `E2E-FLOW-CLEANUP-context-01-runner-artifacts.md`
- Goal: keep only the canonical local QA command `npm run test:e2e` -> `npm --prefix e2e test`, preserve deploy-to-e2e publication, and remove runner artifacts/scripts/workflow files.
- Allowed write scope:
  - `package.json`
  - `e2e/package.json`
  - `Dockerfile.e2e`
  - `Dockerfile.e2e.dockerignore`
  - `.github/workflows/test-vps-e2e.yml`
  - `scripts/run-test-vps-e2e.sh`
  - `scripts/run-local-container-e2e.sh`
  - `scripts/local-e2e-container-entrypoint.sh`
  - `e2e/smoke/local-container-runner-smoke.spec.ts`
- Required checks:
  - `npm run test:e2e -- --list`
  - `rg -n "test:e2e:remote|test:e2e:remote:preflight|ops:e2e:remote:preflight|test:e2e:local|run-test-vps-e2e|run-local-container-e2e|local-e2e-container-entrypoint|Dockerfile\\.e2e|test-vps-e2e" -S --glob "!node_modules/**" --glob "!e2e/node_modules/**"`

### 02. E2E Playwright suite normalization

- Status: `[x]`
- Context: `E2E-FLOW-CLEANUP-context-02-playwright-suite.md`
- Goal: keep QA-owned Playwright tests runnable locally against `https://expressa-e2e-test.vitykovskiy.ru` by default, with `E2E_BASE_URL` and `E2E_BACKEND_BASE_URL` as local QA overrides where existing tests require them.
- Allowed write scope:
  - `e2e/package.json`
  - `e2e/playwright.config.ts`
  - `e2e/**/*.spec.ts`
  - `e2e/**/support/**/*.ts`
- Required checks:
  - `npm run test:e2e -- --list`

### 03. Active documentation cleanup

- Status: `[x]`
- Context: `E2E-FLOW-CLEANUP-context-03-active-docs.md`
- Goal: rewrite active documentation so the e2e route is local QA Playwright execution against `https://expressa-e2e-test.vitykovskiy.ru`; remove runner, preflight, fallback/debug and historical route mentions from active docs.
- Allowed write scope:
  - `README.md`
  - `docs/architecture/deployment-map.md`
  - `docs/architecture/devops-standards.md`
  - `docs/architecture/qa-standards.md`
  - `docs/architecture/application-map/delivery-and-runtime.md`
  - `docs/architecture/application-map/qa-menu-catalog.md`
  - `docs/architecture/application-map/qa-slot-settings.md`
  - `docs/architecture/application-map.md`
  - `process/templates/task-template-instruction.md` only for point removal of stale VPS/local-container e2e route requirements.
  - `process/prompts/qa/prompt.md` only for point removal of stale VPS/local-container e2e route requirements.
- Required checks:
  - `rg -n "remote e2e route|VPS e2e runner|preflight|local containerized|containerized e2e|fallback route|debug/fallback|QA-005 runner|historical/deprecated|test:e2e:remote|test:e2e:local|run-test-vps-e2e|run-local-container-e2e|Dockerfile\\.e2e" -S README.md docs process --glob "!node_modules/**"`

### 04. Task/archive cleanup and final verification

- Status: `[ ]`
- Context: `E2E-FLOW-CLEANUP-context-04-tasks-verification.md`
- Goal: update active e2e task context for `QA-007` and `DO-009`, remove archive-only e2e runner historical data, and run final repository-level verification.
- Allowed write scope:
  - `tasks/QA-007-e2e-administrator-slot-settings-management.md`
  - `tasks/DO-009-publish-backend-base-url-for-slot-settings-e2e.md`
  - `tasks/archive/DO-003-test-vps-e2e-runner-for-qa.md`
  - Other `tasks/archive/*.md` files only when they contain historical/deprecated e2e runner flow references.
- Required checks:
  - `npm run build`
  - `npm run quality`
  - `npm run test:e2e -- --list`
  - If the deployed stand is reachable: `npm run test:e2e`
  - `rg -n "test:e2e:remote|test:e2e:remote:preflight|ops:e2e:remote:preflight|test:e2e:local|run-test-vps-e2e|run-local-container-e2e|local-e2e-container-entrypoint|Dockerfile\\.e2e|test-vps-e2e|remote e2e route|local containerized e2e|historical/deprecated e2e|QA-005 runner|preflight published e2e|debug/fallback route" -S --glob "!node_modules/**" --glob "!backend/node_modules/**" --glob "!frontend/node_modules/**" --glob "!e2e/node_modules/**"`

## Global Constraints

- Preserve `scripts/deploy-test-vps.sh`, `docker-compose.deploy.yml` and `.github/workflows/deploy-test.yml`.
- Preserve publication of `test-e2e` at `https://expressa-e2e-test.vitykovskiy.ru`.
- Preserve `frontend/nginx.conf` proxy support for `/customer/*`.
- Do not revert unrelated uncommitted changes.
- Use Conventional Commits.
