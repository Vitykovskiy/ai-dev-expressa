# План работы `FEATURE-004`

## Контекст

- Исходная задача: `tasks/FEATURE-004-administrator-user-role-management.md`
- Цель: подготовить канонический package системной аналитики для `FEATURE-004`, включая `feature spec`, sibling `test scenarios` и обновление task-card для handoff архитектору.
- Формат исполнения: последовательная работа субагентов по одной подзадаче за итерацию.

## Подзадачи

### `01` — Анализ источников и подготовка feature spec

- Статус: `completed`
- Контекст: `FEATURE-004-context-01-feature-spec.md`
- Зависимости: `нет`
- Результат: создан или обновлен `docs/system/feature-specs/feature-004-administrator-user-role-management.md` с зафиксированными границами фичи, workflows, validations, errors, edge cases, design readiness и blocker по назначению роли `administrator`.

### `02` — Подготовка сценариев тестирования фичи

- Статус: `pending`
- Контекст: `FEATURE-004-context-02-test-scenarios.md`
- Зависимости: `01`
- Результат: создан или обновлен `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md` со stable scenario IDs, manual route, e2e coverage expectation и required assertions.

### `03` — Обновление навигации и task-card

- Статус: `pending`
- Контекст: `FEATURE-004-context-03-navigation-and-task-card.md`
- Зависимости: `01`, `02`
- Результат: обновлены `docs/system/README.md` и `tasks/FEATURE-004-administrator-user-role-management.md` для ссылки на готовые системные артефакты и передачи `FEATURE-004` архитектору.

## Порядок исполнения

1. Передать субагенту следующую подзадачу со статусом `pending`.
2. После завершения подзадачи сообщить субагенту: `Сделай коммит, после отметь подзадачу выполненной`.
3. Дождаться фиксации результата и обновления статуса подзадачи в этом плане.
4. Перейти к следующей подзадаче.

## Критерии завершения плана

- Все подзадачи имеют статус `completed`.
- В `docs/system/feature-specs/` существуют оба документа `FEATURE-004`.
- `docs/system/README.md` содержит навигационную ссылку на `FEATURE-004`.
- Карточка `FEATURE-004` ссылается на оба документа и готова к handoff архитектору.
