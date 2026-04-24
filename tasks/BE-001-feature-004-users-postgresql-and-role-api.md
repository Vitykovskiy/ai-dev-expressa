# Карточка задачи

## Карточка задачи

- Идентификатор: `BE-001`
- Родительская задача: `FEATURE-004`
- Заголовок: `Backend contract и PostgreSQL persistence для управления ролями пользователей`
- Описание: `Нужно реализовать server-side boundary чтения списка пользователей и назначения роли в контуре identity-access по contract GET /backoffice/users и PATCH /backoffice/users/{userId}/role. Задача охватывает users boundary на PostgreSQL как единственный persistent path для FEATURE-004, постоянное хранение пользователей, ролей и blocked state, idempotent bootstrap главного administrator, transport/business error mapping, availableRoleAssignments и capability guard users. Назначение роли administrator должно разрешаться только BootstrapAdministrator, совпадающему с ADMIN_TELEGRAM_ID, и возвращать administrator-role-assignment-forbidden для обычного administrator без догадок из соседнего контура или чтения production-кода.`
- Единица поставки: `FEATURE-004`
- Роль: `Бэкенд`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/contracts/user-role-and-blocking-management.md`
- Архитектурные артефакты: `docs/architecture/stack.md`
- Контурная карта: `docs/architecture/application-map/backend-access.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `FEATURE-004-context-02-backend-postgresql-and-users-api.md`

## Примечания

- Зависимости: `AR-007; после архитектурного handoff задача может выполняться параллельно с FE-001 и DO-010`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/architecture/stack.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `FEATURE-004-context-02-backend-postgresql-and-users-api.md`
- Ожидаемый результат для ревью: `Backend возвращает список пользователей через GET /backoffice/users и обрабатывает PATCH /backoffice/users/{userId}/role по каноническому contract без чтения frontend-кода или production-кода для восстановления правил; users boundary использует PostgreSQL как единственный runtime path; данные пользователей, ролей и blocked state хранятся в PostgreSQL; success path назначения administrator доступен только BootstrapAdministrator и error mapping соответствует contract.`
- Проверки: `npm --prefix backend run lint`, `npm --prefix backend run format:check`, `npm --prefix backend run typecheck`, `npm --prefix backend test`, `npm --prefix backend run build`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/backend-access.md; индекс и корневая навигация не требуются, если маршрут карт не меняется`
- Критерии готовности: `Consumer-facing endpoints GET /backoffice/users и PATCH /backoffice/users/{userId}/role реализованы и соответствуют contract; users boundary FEATURE-004 использует PostgreSQL как единственный runtime path; success path BootstrapAdministrator, availableRoleAssignments, error mapping и capability guard users воспроизводимы автоматическими проверками без восстановления правил из production-кода`
