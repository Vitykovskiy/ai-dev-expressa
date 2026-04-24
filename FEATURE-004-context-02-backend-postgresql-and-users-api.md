# Шаблон контекстного пакета подзадачи

## Карточка контекста

- Исходная задача: `tasks/BE-001-feature-004-users-postgresql-and-role-api.md`
- Подзадача: `02 — backend contract и PostgreSQL persistence`
- Роль исполнителя: `Бэкенд`
- Зона ответственности: `backend/src/**`, `backend/test/**`, `docs/architecture/application-map/backend-access.md`, `AR-007-execution-plan.md`
- Связанный план: `AR-007-execution-plan.md`

## Цель подзадачи

`Реализовать server-side users boundary по contract FEATURE-004 с production-ready PostgreSQL persistence и явным BootstrapAdministrator guard для назначения роли administrator.`

## Поведенческий промпт исполнителя

```text
You operate as backend.

Complete only the backend PostgreSQL and users API subtask within the source task AR-007.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `tasks/BE-001-feature-004-users-postgresql-and-role-api.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/architecture/stack.md`
- `docs/architecture/application-map/backend-access.md`
- `FEATURE-004-context-02-backend-postgresql-and-users-api.md`

## Ключевые факты из источников

- `feature-004-administrator-user-role-management.md`: scope backend ограничен чтением списка пользователей и назначением ролей `barista` или `administrator`; `block_user` и `unblock_user` исключены.
- `user-role-and-blocking-management.md`: `GET /backoffice/users` должен возвращать `items[].availableRoleAssignments`, а `PATCH /backoffice/users/{userId}/role` должен менять только ролевое назначение и `backofficeAccess`.
- `user-role-and-blocking-management.md`: только `BootstrapAdministrator`, совпадающий с `ADMIN_TELEGRAM_ID`, может назначить роль `administrator`; обычный `administrator` получает `administrator-role-assignment-forbidden`.
- `stack.md`: production-ready handoff не допускает итоговое in-memory хранение пользователей, ролей и `blocked state`; источником истины должна быть `PostgreSQL`.
- `backend-access.md`: server runtime и auth/capability guard остаются в контуре `identity-access`; consumer-facing contract нельзя восстанавливать из frontend-кода.

## Разрешенная зона правок

- `backend/src/**`
- `backend/test/**`
- `docs/architecture/application-map/backend-access.md`
- `AR-007-execution-plan.md`

## Запрещенная зона правок

- `frontend/**`
- `e2e/**`
- `docs/system/**`
- `.references/**`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/architecture/deployment-map.md`

## Входы и зависимости

- `Вход`: завершенный шаг 1 плана с актуальным архитектурным handoff.
- `Выход`: server-side implementation и tests, на которые опираются шаги 4-6.

## Ожидаемый результат

`Backend реализует GET /backoffice/users и PATCH /backoffice/users/{userId}/role по contract, хранит пользователей в PostgreSQL и воспроизводит BootstrapAdministrator guard и error mapping автоматическими проверками.`

## Проверки

- `npm --prefix backend run lint`
- `npm --prefix backend run format:check`
- `npm --prefix backend run typecheck`
- `npm --prefix backend test`
- `npm --prefix backend run build`

## Критерии готовности

- `GET /backoffice/users` и `PATCH /backoffice/users/{userId}/role` соответствуют contract без чтения frontend production-кода.
- `PostgreSQL` используется как runtime storage path для users boundary.
- `AR-007-execution-plan.md` обновлен: шаг 2 имеет статус `done`.

## Риски и запреты

- `Риск`: существующий in-memory repository может скрыть незавершенный production runtime path.
- `Запрет`: нельзя расширять backend scope до block/unblock behavior или менять системный смысл auth contract.

## Открытые вопросы

- `нет`
