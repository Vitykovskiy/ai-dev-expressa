# Context 02: E2E Playwright suite normalization

## Objective

Keep the Playwright suite QA-owned and locally runnable from the repository while targeting the deployed e2e stand by default:

```text
https://expressa-e2e-test.vitykovskiy.ru
```

## Current Facts

- `e2e/playwright.config.ts` sets:

```text
baseURL = process.env.E2E_BASE_URL ?? "https://expressa-e2e-test.vitykovskiy.ru"
```

- Slot settings tests use backend JSON calls and may require `E2E_BACKEND_BASE_URL`.
- The intended deployed-origin setup proxies `/customer/*` through frontend nginx, so the backend base URL can be the same origin as the frontend for deployed e2e.
- `frontend/nginx.conf` has current uncommitted changes and must not be reverted.

## Required Shape

- `e2e/package.json` keeps only:

```json
{
  "scripts": {
    "test": "playwright test"
  }
}
```

- No `test:smoke` script.
- No local-container smoke spec.
- Tests stay under `e2e/` and remain standard Playwright tests.
- QA can override target URL using `E2E_BASE_URL`.
- QA can override API origin using `E2E_BACKEND_BASE_URL` where the suite needs direct API requests.

## Expected Result

`npm run test:e2e -- --list` discovers the e2e tests without relying on VPS runner scripts, local Docker runner scripts or preflight wrappers.

## Verification

Run:

```text
npm run test:e2e -- --list
```
