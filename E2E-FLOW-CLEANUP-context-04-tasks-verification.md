# Context 04: Task/archive cleanup and final verification

## Objective

Clean active task cards and archive-only historical e2e runner data for the e2e flow, then run final verification.

## Active Task Files

- `tasks/QA-007-e2e-administrator-slot-settings-management.md`
- `tasks/DO-009-publish-backend-base-url-for-slot-settings-e2e.md`

These task cards must reference the canonical local QA route:

```text
npm run test:e2e -- <scope>
```

or:

```text
npm --prefix e2e test -- <scope>
```

They must not require runner scripts, preflight workflows or local containerized e2e runners.

## Archive Cleanup

Delete archive cards/descriptions that exist only as historical e2e runner flow data, including:

```text
tasks/archive/DO-003-test-vps-e2e-runner-for-qa.md
```

Remove archive references to:

- historical/deprecated e2e baseline
- local containerized e2e acceptance
- remote e2e route
- VPS e2e runner
- preflight runner flow

## Preserve

- Generic historical feature facts that are not runner-flow descriptions may stay.
- Generic e2e QA lane references may stay.
- Do not touch unrelated task history outside e2e flow cleanup.

## Final Verification

Run:

```text
npm run build
npm run quality
npm run test:e2e -- --list
```

If the deployed stand is reachable, also run:

```text
npm run test:e2e
```

Then run:

```text
rg -n "test:e2e:remote|test:e2e:remote:preflight|ops:e2e:remote:preflight|test:e2e:local|run-test-vps-e2e|run-local-container-e2e|local-e2e-container-entrypoint|Dockerfile\\.e2e|test-vps-e2e|remote e2e route|local containerized e2e|historical/deprecated e2e|QA-005 runner|preflight published e2e|debug/fallback route" -S --glob "!node_modules/**" --glob "!backend/node_modules/**" --glob "!frontend/node_modules/**" --glob "!e2e/node_modules/**"
```
