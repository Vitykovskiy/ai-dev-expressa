# QA E2E Scenarios Execution Plan

## Цель

Покрыть все сценарии `required` и `optional` из:

- `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.test-scenarios.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`

browser e2e-тестами в `e2e/` там, где покрытие отсутствует или не соответствует текущему workflow.

## Подзадачи

| ID   | Статус    | Подзадача                                                                                                                                                                          | Контекст                                                   |
| ---- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| `01` | `done`    | `FEATURE-001`: реализовать browser e2e-покрытие сценариев `FTS-001-001` ... `FTS-001-007` с required/optional статусами                                                            | `QA-E2E-SCENARIOS-context-01-feature-001-access.md`        |
| `02` | `done`    | `FEATURE-002`: довести browser e2e-покрытие menu catalog до полного соответствия required/optional сценариям `FTS-002-001` ... `FTS-002-009`, не трогая manual-only `FTS-002-010`  | `QA-E2E-SCENARIOS-context-02-feature-002-menu-catalog.md`  |
| `03` | `pending` | `FEATURE-003`: довести browser e2e-покрытие slot settings до полного соответствия required/optional сценариям `FTS-003-001` ... `FTS-003-006`, не трогая manual-only `FTS-003-007` | `QA-E2E-SCENARIOS-context-03-feature-003-slot-settings.md` |

## Порядок выполнения

1. Взять в работу подзадачу `01`.
2. После завершения подзадачи сделать commit и отметить её как `done`.
3. Взять в работу подзадачу `02`.
4. После завершения подзадачи сделать commit и отметить её как `done`.
5. Взять в работу подзадачу `03`.
6. После завершения подзадачи сделать commit и отметить её как `done`.

## Ограничения

- Каждый исполнитель работает только в границах своего контекста.
- Каждый исполнитель обновляет только свой статус в этом файле.
- Каждый commit оформляется в формате Conventional Commits.
