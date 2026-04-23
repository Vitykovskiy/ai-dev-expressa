# Context 01: Canonical e2e command and runner artifact removal

## Objective

Make the repository expose exactly one canonical e2e command for QA:

```text
npm run test:e2e
```

That command must delegate to the QA-owned Playwright package:

```text
npm --prefix e2e test
```

## Current Facts

- `package.json` already contains `test:e2e`.
- `e2e/package.json` already contains only `test`.
- `e2e/playwright.config.ts` defaults `baseURL` to `https://expressa-e2e-test.vitykovskiy.ru`.
- `.github/workflows/deploy-test.yml` publishes both `test` and `test-e2e`; this workflow must stay.
- `scripts/deploy-test-vps.sh` and `docker-compose.deploy.yml` are deploy publication artifacts and must stay.
- The working tree may already contain deletions for old runner files. Do not restore them.

## Remove From E2E Flow

- `test:e2e:remote`
- `test:e2e:remote:preflight`
- `ops:e2e:remote:preflight`
- `test:e2e:local`
- `scripts/run-test-vps-e2e.sh`
- `scripts/run-local-container-e2e.sh`
- `scripts/local-e2e-container-entrypoint.sh`
- `Dockerfile.e2e`
- `Dockerfile.e2e.dockerignore`
- `.github/workflows/test-vps-e2e.yml`
- `e2e/smoke/local-container-runner-smoke.spec.ts`

## Preserve

- `.github/workflows/deploy-test.yml`
- `scripts/deploy-test-vps.sh`
- `docker-compose.deploy.yml`
- `frontend/nginx.conf`

## Expected Result

The root script layer has one e2e entrypoint and no runner-specific scripts or workflow files remain.

## Verification

Run:

```text
npm run test:e2e -- --list
rg -n "test:e2e:remote|test:e2e:remote:preflight|ops:e2e:remote:preflight|test:e2e:local|run-test-vps-e2e|run-local-container-e2e|local-e2e-container-entrypoint|Dockerfile\\.e2e|test-vps-e2e" -S --glob "!node_modules/**" --glob "!e2e/node_modules/**"
```
