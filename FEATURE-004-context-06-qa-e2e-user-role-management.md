# Шаблон контекстного пакета подзадачи

## Карточка контекста

- Исходная задача: `tasks/QA-002-feature-004-e2e-user-role-management.md`
- Подзадача: `06 — e2e QA coverage`
- Роль исполнителя: `Тестирование`
- Зона ответственности: `e2e/**`, `tasks/QA-002-feature-004-e2e-user-role-management.md`, `AR-007-execution-plan.md`
- Связанный план: `AR-007-execution-plan.md`

## Цель подзадачи

`Собрать browser e2e coverage FEATURE-004 по обязательным scenario IDs и приложить mapping scenario -> test file -> test title -> assertions.`

## Поведенческий промпт исполнителя

```text
You operate as QA.

Complete only the e2e QA subtask within the source task AR-007.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `tasks/QA-002-feature-004-e2e-user-role-management.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/devops-standards.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`
- `FEATURE-004-context-06-qa-e2e-user-role-management.md`

## Ключевые факты из источников

- `feature-004-administrator-user-role-management.test-scenarios.md`: required e2e scenarios это `FTS-004-001`, `FTS-004-002`, `FTS-004-005`, `FTS-004-006`, `FTS-004-007`, `FTS-004-008`.
- `qa-standards.md`: e2e evidence обязано фиксировать mapping между scenario IDs, test files, test titles и required assertions.
- `devops-standards.md` и `deployment-map.md`: финальный feature-level прогон делается локально командой `npm run test:e2e` против опубликованного `https://expressa-e2e-test.vitykovskiy.ru`, если нет осознанного override.
- `feature-004-administrator-user-role-management.md`: e2e scope ограничен users list, role assignment и guards; `block_user` и `unblock_user` не входят в acceptance.
- `user-role-and-blocking-management.md`: negative/guard assertions должны опираться на documented transport and business errors.

## Разрешенная зона правок

- `e2e/**`
- `tasks/QA-002-feature-004-e2e-user-role-management.md`
- `AR-007-execution-plan.md`

## Запрещенная зона правок

- `frontend/src/**`
- `backend/src/**`
- `docs/system/**`
- `docs/architecture/**`
- `.references/**`

## Входы и зависимости

- `Вход`: завершенные шаги 1-4 плана и рабочий QA route.
- `Выход`: browser tests, full suite result и coverage mapping.

## Ожидаемый результат

`Browser e2e suite покрывает обязательные сценарии FEATURE-004, проходит командой npm run test:e2e и содержит явный coverage mapping по scenario IDs.`

## Проверки

- `npm run test:e2e`
- `Coverage mapping для FTS-004-001, FTS-004-002, FTS-004-005, FTS-004-006, FTS-004-007, FTS-004-008`

## Критерии готовности

- `Все required e2e scenarios покрыты browser tests и имеют явные assertions.`
- `Coverage mapping различает required и optional/non-e2e scenarios.`
- `AR-007-execution-plan.md` обновлен: шаг 6 имеет статус `done`.

## Риски и запреты

- `Риск`: published QA route и локальные overrides могут разойтись, если runtime path не согласован с шагом 4.
- `Запрет`: нельзя включать в coverage действия block_user или unblock_user как часть FEATURE-004.

## Открытые вопросы

- `нет`
