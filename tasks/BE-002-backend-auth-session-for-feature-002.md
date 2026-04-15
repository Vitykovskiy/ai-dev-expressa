# Карточка задачи

## Карточка задачи

- Идентификатор: `BE-002`
- Родительская задача: `FEATURE-002`
- Заголовок: `Реализовать backend auth/session для FEATURE-002`
- Описание: `Реализовать backend-срез `FEATURE-002` на `NestJS`: поднять модуль `auth-session`, который валидирует Telegram init data или разрешает вход только в test mode при `DISABLE_TG_AUTH=true`, идемпотентно bootstrap-ит главного administrator из `ADMIN_TELEGRAM_ID`, использует persistence в `PostgreSQL` для поиска и хранения пользователя и возвращает typed административную сессию для `apps/backoffice-web`. Backend должен отдельно обрабатывать blocked-пользователя и пользователя без роли `administrator`, а policy-решения оставить на серверной стороне. Управление меню, ролями пользователей и слотами в scope этой задачи не входит; задача выпускает только reviewable auth/session slice и нужные shared DTO в `packages/shared-types`.`
- Единица поставки: `DU-01.F02`
- Роль: `Бэкенд`
- Изменяемый контур: `backend`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-users-and-roles.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-002-administrator-auth-session.md`, `tasks/AR-002-feature-002-auth-session-slicing.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/architecture/du-01/features/feature-002-auth-session.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `AR-002`
- Минимальный read set: `tasks/FEATURE-002-administrator-auth-session.md`, `tasks/AR-002-feature-002-auth-session-slicing.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/architecture/du-01/features/feature-002-auth-session.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Backend публикует воспроизводимый auth/session-контракт `DU-01.F02`: administrator проходит Telegram/test-mode bootstrap, получает валидную административную сессию, а blocked или non-administrator доступ корректно отклоняется.`
- Проверки: `Jest unit tests для Telegram/test-mode policy, bootstrap главного administrator и blocked/non-administrator веток; интеграционные проверки auth/session endpoint и идемпотентности bootstrap через `ADMIN_TELEGRAM_ID`; feature-smoke backend auth/session в runtime с `PostgreSQL`.`
- Обновление карты приложения: `Обязательно при изменении модулей `apps/api`, shared DTO, persistence path, env/config или backend entrypoints относительно `AR-002`: docs/architecture/application-map.md, docs/architecture/README.md, README.md при изменении корневой навигации.`
- Критерии готовности: `Backend auth/session-срез работает отдельно от последующих административных capability, использует `PostgreSQL` и shared DTO без дублирования контрактов и даёт стабильную серверную основу для administrator shell.`
