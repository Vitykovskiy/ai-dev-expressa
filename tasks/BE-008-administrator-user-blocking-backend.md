# Карточка задачи

## Карточка задачи

- Идентификатор: `BE-008`
- Родительская задача: `FEATURE-005`
- Заголовок: `Backend блокировки пользователя`
- Единица поставки: `FEATURE-005`
- Роль: `Бэкенд`
- Контурная карта: `docs/architecture/application-map/backend-access.md`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Цель

`Реализовать server-side операцию блокировки пользователя и применение blocked access state по архитектурному handoff FEATURE-005.`

## Границы задачи

- Зависит от завершения `AR-009`.
- Входит backend endpoint or operation boundary для `Block user`, сохранение `blocked=true`, error mapping `administrator-role-required` и `user-not-found`, а также запрет доступа пользователя с `blocked=true`.
- Входит backend unit/integration evidence для успешной блокировки, guard отказа, отсутствующего пользователя и blocked access denial.
- Не входит UI, browser e2e, runtime/deployment configuration и разблокировка пользователя.
- Не входит специальное accepted behavior для повторной блокировки уже заблокированного пользователя.
- Если `docs/architecture/application-map/backend-access.md` после `AR-009` не содержит route/DTO/error mapping для `Block user`, задача фиксирует blocker вместо угадывания API shape.

## Зона ответственности

### Разрешенная зона правок

- `backend/src/identity-access/**`
- `backend/test/user-blocking*.spec.ts`
- `backend/test/backoffice-role-guard*.spec.ts` только для affected blocked-access guard coverage.
- `docs/architecture/application-map/backend-access.md` только если реализация выявляет расхождение карты с фактическим backend handoff.
- `tasks/BE-008-administrator-user-blocking-backend.md`

### Запрещенная зона правок

- `frontend/**`
- `e2e/**`
- `.github/**`, `docker-compose.deploy.yml`, `scripts/**`, `package.json`, lock files, `.env*`
- `.references/**`
- `docs/system/**`
- `tasks/archive/**`
- Задачи других feature scope.

## Маршрут чтения

- `process/prompts/backend/prompt.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/application-map/backend-access.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/index.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/behavior.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/interfaces.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/domain-model/identity-and-access.md`

## Справочные ссылки

- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/test-scenarios.md`

## Результат готовности

`Backend returns and persists blocked user state for administrator block flow, denies access for blocked users, preserves documented errors, and has focused backend evidence.`

## Проверки

- `cd backend && npm run lint`
- `cd backend && npm run format:check`
- `cd backend && npm run typecheck`
- `cd backend && npm test`
- `cd backend && npm run build`
- Проверить, что `unblock_user` не реализован в рамках задачи.

## Результат выполнения

`2026-05-04: Backend blocking behavior implemented. Added PATCH /backoffice/user-management/users/:userId/block in identity-access, service/domain blocked state mutation preserving target roles, and focused backend coverage in backend/test/user-blocking.integration.spec.ts for success, blocked access denial, non-administrator guard denial and missing target. Checks passed: npm run lint, npm run format:check, npm run typecheck, npm test (15 files / 56 tests), npm run build. Manual check: rg unblock/unblock_user in backend/src/identity-access and backend/test returned no matches.`
