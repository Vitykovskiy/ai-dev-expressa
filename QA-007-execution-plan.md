# QA-007 Execution Plan

## Source Task

- Task card: `tasks/QA-007-e2e-administrator-slot-settings-management.md`
- Parent feature: `FEATURE-003`
- QA lane: `E2E`
- Required scenario IDs: `FTS-003-001`, `FTS-003-003`, `FTS-003-004`, `FTS-003-005`, `FTS-003-006`
- Canonical feature scenarios: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`
- Final documented runner: local containerized QA runner from `npm run test:e2e:local`

## Work Rules

- Each executor takes only the next subtask with status `pending`.
- Each executor reads the matching root context package before changing files.
- Each executor changes only the allowed edit area from the matching context package.
- Each executor updates this plan after completing its own subtask.
- Each executor creates a Conventional Commit for its own completed subtask.
- Reproducible blocking product or launch failures are recorded as `BUG-*` tasks under `FEATURE-003` only when the cause contour is clear.

## Subtasks

### 01 - E2E Positive Save And Slot Generation

- Status: `completed`
- Context package: `QA-007-context-01-positive-save-and-slot-generation.md`
- Role: `Тестирование`
- Scope: create the FEATURE-003 Playwright test file and cover `FTS-003-001` and `FTS-003-006`.
- Expected result: browser e2e coverage saves valid working hours/capacity through `/settings`, verifies success feedback and persisted form values, then verifies `/customer/slots` uses the saved working hours, 10-minute intervals, current-day date, and saved capacity.
- Allowed edit area: `e2e/slot-settings/**`, `e2e/package.json` only if needed for an existing script-compatible test path.
- Checks: focused Playwright run for the new slot settings spec when environment is available; otherwise record why the runner is unavailable.

### 02 - E2E Negative Validation And Access Guard

- Status: `completed`
- Context package: `QA-007-context-02-negative-validation-and-access-guard.md`
- Role: `Тестирование`
- Scope: extend FEATURE-003 Playwright coverage for `FTS-003-003`, `FTS-003-004`, and `FTS-003-005`.
- Expected result: browser e2e coverage verifies invalid working hours, invalid slot capacity, hidden settings navigation for a user without `settings`, and protected state for direct `/settings` access.
- Allowed edit area: `e2e/slot-settings/**`.
- Checks: focused Playwright run for the slot settings spec when environment is available; otherwise record why the runner is unavailable.

### 03 - Coverage Mapping, Evidence, Acceptance Run

- Status: `pending`
- Context package: `QA-007-context-03-coverage-mapping-and-evidence.md`
- Role: `Тестирование`
- Scope: record scenario mapping, runner evidence, browser report path, pass/fail status, and update QA navigation only if the slot settings e2e route or fixtures changed.
- Expected result: `QA-007` contains explicit mapping from each required scenario ID to test file, test title, required assertions and final runner evidence, with any blocking failures captured as BUG tasks or explicitly absent.
- Allowed edit area: `tasks/QA-007-e2e-administrator-slot-settings-management.md`, `docs/architecture/application-map/qa-slot-settings.md` only if test route, fixtures, coverage mapping, or acceptance path changed.
- Checks: `npm run test:e2e:local`; if Docker or published dependencies are unavailable, record exact attempted command and blocker/evidence status in `QA-007`.

## Completion Criteria

- All subtasks have status `completed`.
- Required e2e scenarios `FTS-003-001`, `FTS-003-003`, `FTS-003-004`, `FTS-003-005`, `FTS-003-006` have mapped browser tests.
- `QA-007` records runner summary, browser report, pass/fail status, and BUG task links or explicit absence of blocking failures.
- The last subtask confirms whether `npm run test:e2e:local` completed successfully or records why it could not be completed.
