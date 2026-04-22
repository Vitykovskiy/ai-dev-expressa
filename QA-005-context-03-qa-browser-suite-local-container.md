# Контекстный пакет подзадачи

## Карточка контекста

- Исходная задача: `tasks/QA-005-e2e-administrator-menu-catalog-management.md`
- Подзадача: `03 — QA browser suite on local container`
- Роль исполнителя: `Тестирование`
- Зона ответственности: `FEATURE-002 browser e2e scenarios, fixtures, assertions, local evidence`
- Связанный план: `QA-005-execution-plan.md`

## Цель подзадачи

Система должна иметь QA-owned browser e2e suite для `FEATURE-002`, который запускается через локальный containerized runner и покрывает сценарии управления каталогом меню administrator.

## Поведенческий промпт исполнителя

```text
You operate as a strict QA engineer.

Complete only the QA browser suite local-container subtask within QA-005.

Follow the read and edit boundaries from this context package. Use the local container runner contract produced by DevOps. Do not change product code to make tests pass. If the runner is unavailable, record a blocker instead of switching back to VPS.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `README.md`
- `QA-005-execution-plan.md`
- `QA-005-context-01-task-docs-realignment.md`
- `QA-005-context-02-local-e2e-container-runner.md`
- `tasks/QA-005-e2e-administrator-menu-catalog-management.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/qa-menu-catalog.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/domain-model/menu-catalog.md`
- `docs/system/use-cases/administrator-manage-menu.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`

## Ключевые факты из источников

- `QA-005` requires browser e2e coverage for administrator menu catalog management.
- `docs/system/use-cases/administrator-manage-menu.md` defines the main flow: create categories, create products, set prices, define `S/M/L` drink prices, create option groups through menu group flow, create paid/free options, assign option groups to categories.
- `docs/system/contracts/menu-and-availability-management.md` defines API boundaries and errors: `invalid-drink-size-model`, `invalid-option-group-rule`, and capability requirement `menu`.
- `docs/system/contracts/backoffice-auth-and-capability-access.md` defines test-mode entry through `NODE_ENV=test`, `DISABLE_TG_AUTH=true`, `ADMIN_TELEGRAM_ID` and `x-test-telegram-id`.
- `docs/architecture/application-map/qa-menu-catalog.md` defines required e2e scenarios and states that backend endpoint suites are integration evidence, not feature-level e2e.
- New workflow decision: final e2e evidence for `QA-005` must come from local containerized run, not VPS.

## Разрешенная зона правок

- `e2e/**` or `frontend/e2e/**` for QA-owned feature tests, fixtures and helpers
- Playwright or equivalent e2e config files required by the local runner contract
- `frontend/package.json`, `package.json`, lockfiles only if the DevOps runner contract delegates e2e scripts to QA-owned package scripts
- `artifacts/**` only for generated evidence when the repository intentionally stores local evidence artifacts
- `tasks/QA-005-e2e-administrator-menu-catalog-management.md` only to record final QA evidence, blockers and defect links

## Запрещенная зона правок

- `backend/src/**`
- `frontend/src/**`
- DevOps runner implementation owned by subtask 02
- VPS e2e scripts or workflows
- Required PR/deploy gates

## Входы и зависимости

- Depends on subtask 01 for corrected instructions.
- Depends on subtask 02 for a runnable local container command and environment contract.
- Feeds subtask 04 with pass/fail evidence and reproducible failure details.

## Ожидаемый результат

QA-owned browser e2e tests cover `FEATURE-002` through the local containerized runner. Evidence shows the local command, app targets inside Docker runtime, browser report path, pass/fail status and defect links.

## Проверки

- Run the local containerized e2e command from subtask 02.
- Positive scenario: administrator opens backoffice and completes menu catalog flow.
- Negative scenario: incomplete drink size model is rejected.
- Negative scenario: invalid option group rule is rejected.
- Access scenario: user without capability `menu` is denied through documented route/API.
- Evidence review: browser report and summary are generated locally.

## Критерии готовности

- Feature e2e tests are owned by QA and separated from DevOps smoke test.
- Tests use documented system contracts instead of deriving expected behavior from production code.
- Final acceptance evidence comes from local containerized run.
- Failing scenarios have enough detail for `BUG-*` creation.
- `QA-005` records pass/fail result, artifacts and defect links.

## Риски и запреты

- Риск: закрыть `QA-005` по backend integration tests instead of browser e2e.
- Риск: обойти local container runner and run against host dev servers.
- Риск: fix product code inside QA task.
- Запрет: возвращать VPS route as fallback acceptance.

## Открытые вопросы

- Exact selectors and stable test ids may require coordination with frontend if current UI lacks stable automation anchors.
