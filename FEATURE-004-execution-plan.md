# План выполнения `FEATURE-004`

## Цель

Довести системный handoff `FEATURE-004` до состояния, в котором transport/API boundary, feature-level сценарии и task-level blockers выражены в канонических артефактах без обращения исполнителей к production-коду соседнего контура.

## Правила выполнения

- Работать только в границах `FEATURE-004`.
- Брать подзадачи строго последовательно.
- После завершения подзадачи исполнитель делает commit по `Conventional Commits`, затем отмечает подзадачу выполненной в этом плане.
- Если подзадача выявляет противоречие, исполнитель фиксирует blocker вместо догадки.

## Подзадачи

1. `01` `Transport/API contract for users management`
   - Статус: `done`
   - Контекст: `FEATURE-004-context-01-transport-api-contract.md`
   - Результат: в `docs/system/contracts/user-role-and-blocking-management.md` появляется явный consumer-facing contract для чтения списка пользователей и назначения роли; связанные `use-case` и `domain-model` синхронизированы только при необходимости.

2. `02` `Feature handoff alignment`
   - Статус: `done`
   - Контекст: `FEATURE-004-context-02-feature-handoff-alignment.md`
   - Зависимость: `01`
   - Результат: `feature spec` и `test scenarios` используют явный contract boundary, сохраняют blocker по праву назначения `administrator` и не оставляют скрытых пробелов handoff.

3. `03` `Task and navigation sync`
   - Статус: `pending`
   - Контекст: `FEATURE-004-context-03-task-and-navigation-sync.md`
   - Зависимость: `01`, `02`
   - Результат: карточка `FEATURE-004`, `docs/system/README.md` и этот план синхронизированы с обновленным handoff и фиксируют следующий архитектурный маршрут без скрытых предположений.

## Текущий статус

- Активная подзадача: `03`
- Общее состояние: `in_progress`

## Открытые blockers

- Не согласовано, может ли любой `administrator` назначать роль `administrator`, или это право ограничено только главным `administrator`.

## Критерий завершения плана

План завершен, когда все три подзадачи отмечены `done`, соответствующие изменения закоммичены исполнителями, а `FEATURE-004` содержит явный и самодостаточный системный handoff для следующего этапа.
