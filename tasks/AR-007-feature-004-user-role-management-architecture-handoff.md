# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-007`
- Родительская задача: `FEATURE-004`
- Заголовок: `Архитектурный handoff управления ролями пользователей`
- Единица поставки: `FEATURE-004`
- Роль: `Архитектор`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`; `docs/architecture/application-map/backend-access.md`; `docs/architecture/application-map/qa-access.md`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Цель

`Подготовить архитектурный handoff FEATURE-004: зафиксировать клиентский, серверный и QA маршруты реализации управления ролями пользователей до старта FE/BE/QA задач.`

## Границы задачи

- Входит обновление архитектурных карт для вкладки `Пользователи`, role-management API и QA access-проверок.
- Входит фиксация отсутствия `DO-*` задачи для FEATURE-004, потому что фича не меняет runtime variables, deployment route или smoke-check.
- Не входит production-code implementation.
- Не входит изменение feature package или системных контрактов.

## Зона ответственности

### Разрешенная зона правок

- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/qa-access.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/backend-architecture.md`
- `tasks/FEATURE-004-administrator-user-role-management.md`

### Запрещенная зона правок

- `frontend/**`
- `backend/**`
- `e2e/**`
- `docs/system/**`
- `.references/**`

## Маршрут чтения

- `tasks/FEATURE-004-administrator-user-role-management.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/interfaces.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/ui-behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/qa-access.md`

## Справочные ссылки

- `docs/system/domain-model/identity-and-access.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx`
- `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`

## Результат готовности

`Архитектурные карты задают FE/BE/QA handoff FEATURE-004, а дочерние задачи могут стартовать без восстановления API shape, guard semantics или UI parity из production-кода.`

## Проверки

- `rg "FEATURE-004" docs/architecture`
- Ручная проверка, что endpoint namespace FEATURE-004 не конфликтует с `GET /backoffice/:capability`.
- Ручная проверка, что `DO-*` задача не требуется по `interfaces.md` и `delivery-and-runtime.md`.

## Результат выполнения

`2026-05-01 — Обновлены архитектурные карты frontend, backend и QA для FEATURE-004. Зафиксирован endpoint namespace /backoffice/user-management/users, чтобы не конфликтовать с capability check /backoffice/users. DO-задача не создана, потому что runtime/deployment route не меняется.`
