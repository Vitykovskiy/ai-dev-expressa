# Context 03: Active documentation cleanup

## Objective

Active documentation must describe exactly one e2e execution route:

```text
npm run test:e2e
```

The command is run locally by QA and targets:

```text
https://expressa-e2e-test.vitykovskiy.ru
```

## Active Docs In Scope

- `README.md`
- `docs/architecture/deployment-map.md`
- `docs/architecture/devops-standards.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/architecture/application-map/qa-menu-catalog.md`
- `docs/architecture/application-map/qa-slot-settings.md`
- `docs/architecture/application-map.md`

## Process Docs In Scope Only For Stale Route Removal

- `process/templates/task-template-instruction.md`
- `process/prompts/qa/prompt.md`

Do not remove generic process-layer rules that require e2e QA as a lane. Remove only obsolete requirements that force non-canonical e2e run paths.

## Remove Mentions

Remove all obsolete e2e runner route names, removed command names, removed script names, removed Docker-only runner artifact names, old fallback/debug route language, and historical baseline descriptions from active docs. Do not preserve the removed identifiers in active repository text.

## Preserve Mentions

- The deployed e2e URL: `https://expressa-e2e-test.vitykovskiy.ru`.
- Deployment publication to the `test-e2e` stand through `Deploy Test`.
- Generic e2e QA lane requirements.
- Standard package command `npm run test:e2e`.

## Documentation Semantics

- The application is published to the e2e URL on merge/push to `main`.
- QA writes and runs Playwright tests locally.
- E2E tests use the deployed e2e URL by default.
- `E2E_BASE_URL` remains a local override.
- `E2E_BACKEND_BASE_URL` remains a local override where tests need API calls.

## Verification

Run:

```text
rg -n "<legacy-e2e-runner-patterns>" -S README.md docs process --glob "!node_modules/**"
```
