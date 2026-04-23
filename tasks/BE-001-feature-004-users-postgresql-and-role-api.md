# Карточка задачи

## Карточка задачи

- Идентификатор: `BE-001`
- Родительская задача: `FEATURE-004`
- Заголовок: `Backend contract и PostgreSQL persistence для управления ролями пользователей`
- Описание: `Нужно реализовать server-side boundary чтения списка пользователей и назначения роли в контуре identity-access по contract GET /backoffice/users и PATCH /backoffice/users/{userId}/role. Задача охватывает постоянное хранение пользователей, ролей и blocked state в PostgreSQL, idempotent bootstrap главного administrator, transport/business error mapping и capability guard users. Поведение назначения роли administrator не финализируется догадкой: при отсутствии согласованного правила backend должен сохранить blocker через 409 administrator-assignment-rule-unresolved.`
- Единица поставки: `FEATURE-004`
- Роль: `Бэкенд`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/contracts/user-role-and-blocking-management.md`
- Архитектурные артефакты: `docs/architecture/stack.md`
- Контурная карта: `docs/architecture/application-map/backend-access.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `FEATURE-004-context-01-backend-postgresql-and-users-api.md`

## Примечания

- Зависимости: `нет; задача может выполняться параллельно с FE-001 по зафиксированному contract boundary`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/architecture/stack.md`, `docs/architecture/application-map/backend-access.md`, `FEATURE-004-context-01-backend-postgresql-and-users-api.md`
- Ожидаемый результат для ревью: `Backend возвращает список пользователей через GET /backoffice/users и обрабатывает PATCH /backoffice/users/{userId}/role по каноническому contract без чтения frontend-кода; данные пользователей, ролей и blocked state хранятся в PostgreSQL; blocker назначения administrator выражен через 409 administrator-assignment-rule-unresolved.`
- Проверки: `npm --prefix backend run lint`, `npm --prefix backend run format:check`, `npm --prefix backend run typecheck`, `npm --prefix backend test`, `npm --prefix backend run build`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/backend-access.md; индекс и корневая навигация не требуются, если маршрут карт не меняется`
- Критерии готовности: `Consumer-facing endpoints GET /backoffice/users и PATCH /backoffice/users/{userId}/role реализованы и соответствуют contract; in-memory хранение не является итоговым runtime path для FEATURE-004; error mapping и capability guard users воспроизводимы автоматическими проверками`
