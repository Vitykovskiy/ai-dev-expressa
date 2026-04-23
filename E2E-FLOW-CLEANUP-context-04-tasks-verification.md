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

They must not require legacy runner scripts, old runner workflows or non-canonical e2e runners.

## Archive Cleanup

Delete archive cards/descriptions that exist only as historical e2e runner flow data.

Remove archive references to legacy e2e baselines, non-canonical acceptance routes, VPS-hosted e2e execution and runner diagnostic flows.

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
rg -n "<legacy-e2e-runner-patterns>" -S --glob "!node_modules/**" --glob "!backend/node_modules/**" --glob "!frontend/node_modules/**" --glob "!e2e/node_modules/**"
```
