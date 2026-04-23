# Контекстный пакет QA-007/03

## Карточка контекста

- Исходная задача: `tasks/QA-007-e2e-administrator-slot-settings-management.md`
- Подзадача: `03 — Coverage Mapping, Evidence, Acceptance Run`
- Роль исполнителя: `Тестирование`
- Зона ответственности: `QA-007 task evidence, coverage mapping, final runner status`
- Связанный план: `QA-007-execution-plan.md`

## Цель подзадачи

Зафиксировать результат e2e QA lane для `FEATURE-003`: scenario mapping, runner summary, browser report, pass/fail локального контейнерного прогона и BUG/blocker status.

## Поведенческий промпт исполнителя

```text
You operate as a strict QA engineer.

Complete only subtask 03 from QA-007 within the source task QA-007.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `process/README.md`
- `process/workflow.md`
- `README.md`
- `tasks/QA-007-e2e-administrator-slot-settings-management.md`
- `QA-007-execution-plan.md`
- `QA-007-context-01-positive-save-and-slot-generation.md`
- `QA-007-context-02-negative-validation-and-access-guard.md`
- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/deployment-map.md`
- `docs/architecture/application-map/qa-slot-settings.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `e2e/slot-settings/admin-slot-settings.spec.ts`
- `scripts/run-local-container-e2e.sh`
- `Dockerfile.e2e`
- `package.json`
- `e2e/package.json`

## Ключевые факты из источников

- QA-007 expected result requires browser e2e evidence for `FTS-003-001`, `FTS-003-003`, `FTS-003-004`, `FTS-003-005`, `FTS-003-006`.
- Coverage mapping must include scenario ID, test file, test title, and required assertions.
- QA-007 says final acceptance run is local containerized command through the current QA runner.
- `docs/architecture/application-map/qa-slot-settings.md` must be updated if e2e scenarios, fixtures, contract mocks, test route, or acceptance path changed.

## Разрешенная зона правок

- `tasks/QA-007-e2e-administrator-slot-settings-management.md`
- `docs/architecture/application-map/qa-slot-settings.md` only if test route, fixtures, coverage mapping, or acceptance path changed.
- New `tasks/BUG-*` files only if a reproducible blocking failure has a clear cause contour.

## Запрещенная зона правок

- Production backend code.
- Production frontend code.
- E2E test code, except for minimal metadata-only corrections if mapping cannot be recorded due to missing scenario IDs.
- Deployment scripts and Docker files.

## Ожидаемый результат

`tasks/QA-007-e2e-administrator-slot-settings-management.md` records final evidence and status for the e2e QA lane, including coverage mapping and the local containerized runner result.

## Проверки

- `npm run test:e2e:local`
- If unavailable, record exact attempted command, failure class, available artifact path, and whether the issue is product, devops/runtime, or local environment blocker.

## Критерии готовности

- QA-007 has coverage mapping for all required scenario IDs.
- QA-007 has runner summary, browser report path, pass/fail status or exact blocker.
- QA-007 lists created BUG tasks or explicitly says blocking product/launch failures are absent.
- `QA-007-execution-plan.md` marks subtask 03 completed.

## Открытые вопросы

- Нет.
