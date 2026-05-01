# Карточка задачи

## Карточка задачи

- Идентификатор: `BE-006`
- Родительская задача: `FEATURE-004`
- Заголовок: `Серверное управление ролями пользователей`
- Единица поставки: `FEATURE-004`
- Роль: `Бэкенд`
- Контурная карта: `docs/architecture/application-map/backend-access.md`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Цель

`Реализовать server-side boundary чтения пользователей и назначения ролей barista/administrator с пересчетом capabilities и guard главного administrator.`

## Границы задачи

- Входит `GET /backoffice/user-management/users` для списка пользователей вкладки `Пользователи`.
- Входит `PATCH /backoffice/user-management/users/:userId/role` для назначения роли `barista` или `administrator`.
- Входит static capability guard `users` для обоих endpoint boundaries.
- Входит guard главного administrator для назначения роли `administrator`.
- Входит расширение repository contract только в пределах текущего in-memory identity/access adapter.
- Маршрут чтения шире обычного BE read set, потому что задача связывает role-management contract, auth headers/body, capability guard и feature QA scenarios.
- Не входит постоянное хранилище, миграции БД, блокировка/разблокировка пользователей, создание пользователя и снятие роли `barista`.
- Не входит frontend UI, browser e2e suite, deployment route или системные документы.

## Зона ответственности

### Разрешенная зона правок

- `backend/src/identity-access/**`
- `backend/test/*user-role-management*.spec.ts`
- `backend/test/backoffice-role-guard.spec.ts` только если нужно расширить guard evidence для capability `users`
- `backend/test/backoffice-entry.integration.spec.ts` только если изменение затрагивает shared auth/guard contract

### Запрещенная зона правок

- `frontend/**`
- `e2e/**`
- `docs/system/**`
- `docs/business/**`
- `.references/**`
- Deployment/runtime configuration
- Storage replacement beyond current in-memory repository adapter

## Маршрут чтения

- `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/interfaces.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/domain-model/identity-and-access.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/application-map/backend-access.md`

## Справочные ссылки

- `docs/architecture/application-map/delivery-and-runtime.md` — только если executor считает, что найденное изменение затрагивает runtime/test-mode route; иначе не требуется.

## Результат готовности

`Backend возвращает список пользователей для administrator, назначает роли barista/administrator по контракту, сохраняет customer и blocked state, пересчитывает target capabilities и отклоняет forbidden/invalid/not-found сценарии с documented errors.`

## Проверки

- `npm --prefix backend run lint`
- `npm --prefix backend run format:check`
- `npm --prefix backend run typecheck`
- `npm --prefix backend test`
- `npm --prefix backend run build`
- Focused backend tests для `F004-SC-001`, `F004-SC-003`, `F004-SC-005`, `F004-SC-006` и `F004-SC-007`.

## Результат выполнения

`2026-05-01 — Выполнено. Реализованы GET /backoffice/user-management/users и PATCH /backoffice/user-management/users/:userId/role внутри identity-access boundary; добавлены repository lookup/list по userId, назначение barista/administrator с сохранением customer и blocked state, пересчет capabilities, static capability guard users и guard главного administrator. Проверки пройдены: npm --prefix backend test -- user-role-management; npm --prefix backend run lint; npm --prefix backend run format:check; npm --prefix backend run typecheck; npm --prefix backend test; npm --prefix backend run build. Новые дефекты не создавались.`
