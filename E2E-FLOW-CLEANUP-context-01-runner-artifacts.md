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

Remove every legacy e2e runner command, wrapper, workflow, Docker-only runner artifact and runner smoke test. Do not preserve historical names for removed runner artifacts in active repository text.

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
rg -n "<legacy-e2e-runner-patterns>" -S --glob "!node_modules/**" --glob "!e2e/node_modules/**"
```
