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
- Goal: keep only the canonical local QA command `npm run test:e2e` -> `npm --prefix e2e test`, preserve deploy-to-e2e publication, and remove legacy runner artifacts.
- Allowed write scope:
  - `package.json`
  - `e2e/package.json`
  - legacy Docker-only runner artifacts
  - legacy e2e runner workflow
  - legacy e2e runner scripts
  - legacy e2e runner smoke test
- Required checks:
  - `npm run test:e2e -- --list`
  - repository search for legacy e2e runner identifiers excluding dependency directories

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
- Goal: rewrite active documentation so the e2e route is local QA Playwright execution against `https://expressa-e2e-test.vitykovskiy.ru`; remove legacy runner and old diagnostic route mentions from active docs.
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
  - repository search for legacy e2e runner identifiers in active docs excluding dependency directories

### 04. Task/archive cleanup and final verification

- Status: `[x]`
- Context: `E2E-FLOW-CLEANUP-context-04-tasks-verification.md`
- Goal: update active e2e task context for `QA-007` and `DO-009`, remove archive-only e2e runner historical data, and run final repository-level verification.
- Allowed write scope:
  - `tasks/QA-007-e2e-administrator-slot-settings-management.md`
  - `tasks/DO-009-publish-backend-base-url-for-slot-settings-e2e.md`
  - archive cards that exist only as legacy e2e runner flow data
  - Other `tasks/archive/*.md` files only when they contain legacy e2e runner flow references.
- Required checks:
  - `npm run build`
  - `npm run quality`
  - `npm run test:e2e -- --list`
  - If the deployed stand is reachable: `npm run test:e2e`
  - repository search for legacy e2e runner identifiers excluding dependency directories

## Global Constraints

- Preserve `scripts/deploy-test-vps.sh`, `docker-compose.deploy.yml` and `.github/workflows/deploy-test.yml`.
- Preserve publication of `test-e2e` at `https://expressa-e2e-test.vitykovskiy.ru`.
- Preserve `frontend/nginx.conf` proxy support for `/customer/*`.
- Do not revert unrelated uncommitted changes.
- Use Conventional Commits.
