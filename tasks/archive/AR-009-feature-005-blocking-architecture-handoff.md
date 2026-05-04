# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-009`
- Родительская задача: `FEATURE-005`
- Заголовок: `Architecture handoff для блокировки пользователя`
- Единица поставки: `FEATURE-005`
- Роль: `Архитектор`
- Контурная карта: `n/a`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Цель

`Подготовить архитектурный handoff для реализации блокировки пользователя: зафиксировать endpoint boundary, DTO, error mapping, контур применения blocked access state и QA preconditions без изменения системного scope.`

## Границы задачи

- Входит уточнение архитектурных карт для `Block user`, `Read users for role management` и применения `blocked=true` на access boundary.
- Входит маршрутизация FE/BE/QA child tasks через текущие feature package slices и профильные application maps.
- Входит решение, требуется ли отдельная `DO-*` задача для test target, seed, fixture или QA route.
- Не входит реализация frontend, backend, e2e или runtime-конфигурации.
- Не входит добавление `unblock_user` или специальной ветки повторной блокировки уже заблокированного пользователя.
- Расширенный маршрут чтения допустим, потому что задача одновременно уточняет backend, frontend и QA handoff boundaries.

## Зона ответственности

### Разрешенная зона правок

- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/qa-access.md`
- `docs/architecture/application-map/delivery-and-runtime.md` только если появляется runtime, seed, fixture, test target или e2e route change.
- `docs/architecture/application-map.md` только если меняется навигация карт.
- `tasks/AR-009-feature-005-blocking-architecture-handoff.md`

### Запрещенная зона правок

- `backend/**`
- `frontend/**`
- `e2e/**`
- `.github/**`, `docker-compose.deploy.yml`, `scripts/**`, `package.json`, lock files, `.env*`
- `.references/**`
- `docs/system/**`
- `tasks/archive/**`
- Задачи других feature scope.

## Маршрут чтения

- `process/prompts/architect/prompt.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/index.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/behavior.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/interfaces.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/test-scenarios.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/domain-model/identity-and-access.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/qa-access.md`

## Справочные ссылки

- `docs/architecture/application-map/delivery-and-runtime.md`

## Результат готовности

`Architecture maps contain an executable FEATURE-005 handoff for FE/BE/QA: route or operation boundary, DTO/response shape, error mapping, blocked access enforcement boundary, QA actor/data route, and explicit no-unblock scope.`

## Проверки

- Проверить, что FE и BE child tasks могут выполнить работу по архитектурным картам без чтения соседнего production-контура.
- Проверить, что `unblock_user` не назначен как accepted behavior.
- Проверить, что повторная блокировка уже заблокированного пользователя не превращена в новый accepted behavior.
- Проверить, создана ли `DO-*` задача или зафиксировано, что runtime/test-target work не требуется.

## Результат выполнения

`2026-05-04: Architecture handoff выполнен. docs/architecture/application-map/backend-access.md фиксирует PATCH /backoffice/user-management/users/:userId/block, response shape, error mapping, blocked access enforcement boundary и no-unblock/no-repeat-block constraints. docs/architecture/application-map/frontend-backoffice.md фиксирует /users UI/API binding для block_user без unblock behavior. docs/architecture/application-map/qa-access.md фиксирует FEATURE-005 QA route, actor/data preconditions, scenario coverage и resolver route для отсутствующих test actors/data. Отдельная DO-* задача не требуется на архитектурном handoff: новые env vars, deployment route, VPS stand и runtime config не назначены.`
