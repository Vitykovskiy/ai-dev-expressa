# Контекстный пакет подзадачи

## Карточка контекста

- Исходная задача: `tasks/QA-005-e2e-administrator-menu-catalog-management.md`
- Подзадача: `04 — e2e defect handoff`
- Роль исполнителя: `Тестирование`
- Зона ответственности: `BUG task creation and QA-005 evidence update after local containerized e2e run`
- Связанный план: `QA-005-execution-plan.md`

## Цель подзадачи

Система должна фиксировать каждую воспроизводимую ошибку, найденную локальным containerized e2e-прогоном, как `BUG-*` задачу. Это включает product failures и ошибки запуска теста.

## Поведенческий промпт исполнителя

```text
You operate as a strict QA engineer.

Complete only the e2e defect handoff subtask within QA-005.

Use local containerized e2e evidence as the source of observed failures. Create BUG tasks only for reproducible failures with enough evidence. If the cause contour is unclear, record a blocker in QA-005 instead of guessing.

Before creating BUG tasks, read the mandatory read set. After creating BUG tasks, update QA-005 with evidence links and the defect list.
```

## Обязательный read set

- `README.md`
- `QA-005-execution-plan.md`
- `tasks/QA-005-e2e-administrator-menu-catalog-management.md`
- `templates/task-template.md`
- `templates/task-template-instruction.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/qa-menu-catalog.md`
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- Local e2e summary, log and browser report from subtask 03

## Ключевые факты из источников

- `templates/task-template-instruction.md` requires reproducible defects to be оформлены as `BUG-*` with contour label `frontend`, `backend` or `devops`.
- `docs/architecture/qa-standards.md` says QA creates `BUG-*` under the same `FEATURE-*` when the cause contour is clear.
- `docs/architecture/qa-standards.md` says unclear contour or separate delivery unit should be recorded as blocker instead of creating a new `FEATURE-*`.
- Product failures in `FEATURE-002` include UI/client behavior, API/contract/server mismatch, validations or capability access mismatches.
- Launch failures in the new workflow include Docker build failure, local container startup failure, env/config failure, preflight failure, browser dependency failure, test runner crash or missing report artifact.
- User explicitly requires bugs for errors, including errors of test launch.

## Разрешенная зона правок

- `tasks/BUG-*.md` for newly created defect cards
- `tasks/QA-005-e2e-administrator-menu-catalog-management.md` for evidence summary, defect list and blockers
- `artifacts/**` only if evidence artifacts are intentionally stored in repository for handoff

## Запрещенная зона правок

- Product implementation files
- DevOps runner implementation
- E2E test implementation
- Architecture standards, unless a contradiction blocks defect handoff and a separate task is created

## Входы и зависимости

- Depends on subtask 02 for local runner evidence format.
- Depends on subtask 03 for actual browser e2e run output.
- Produces BUG cards that may become inputs to Frontend, Backend or DevOps fix tasks.

## Ожидаемый результат

`QA-005` contains a concise result of the local containerized e2e run, links or paths to evidence artifacts, and a list of created `BUG-*` tasks. Every reproducible launch failure has a `BUG-*` with contour `devops`; every reproducible product failure has a `BUG-*` with contour `frontend` or `backend` when the contour is clear.

## Проверки

- Review local e2e summary and browser report.
- For each failure, reproduce or confirm deterministic reproduction from evidence.
- Create `BUG-*` cards using `templates/task-template.md`.
- Verify each `BUG-*` has parent `FEATURE-002`, clear contour label, expected/actual, steps, evidence and role matching the contour.
- Update `QA-005` with pass/fail status and defect list.

## Критерии готовности

- No reproducible failure remains only in logs.
- Launch failures are represented as `BUG-*` with `devops` contour or blocker if cause is unclear.
- Product failures are represented as `BUG-*` with `frontend` or `backend` contour when clear.
- `QA-005` records created defects or states that no defects were found.
- Unclear ownership is recorded as blocker, not guessed.

## Риски и запреты

- Риск: оформить runner launch failure как QA note instead of actionable `BUG-*`.
- Риск: guess frontend/backend ownership without enough evidence.
- Риск: create duplicate BUG cards for the same root cause.
- Запрет: исправлять дефекты в этой подзадаче.

## Открытые вопросы

- Следующий свободный `BUG-*` идентификатор нужно определить перед созданием defect cards.
