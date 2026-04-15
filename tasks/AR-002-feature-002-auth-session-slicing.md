# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-002`
- Родительская задача: `FEATURE-002`
- Заголовок: `Зафиксировать архитектурный контур FEATURE-002`
- Описание: `На основе `Sprint-001`, `FEATURE-002` и архитектурной рамки `DU-01` зафиксировать контур auth/session-среза `DU-01.F02`: какие runtime-контуры, entrypoints, shared contracts, env vars, persistence и smoke-маршруты обязательны, чтобы administrator мог открыть backoffice через `Telegram backoffice-бота` или через test mode при `DISABLE_TG_AUTH=true`. Нужно заранее отделить session bootstrap и administrator guard от следующих capability `menu-management`, `user-access-management` и `slot-settings`, а также зафиксировать, где именно стартуют `apps/backoffice-bot`, `PostgreSQL` и auth/session-модули в `apps/api`, `apps/backoffice-web` и `packages/shared-types`. После завершения `AR-002` исполнители `BE-002`, `FE-002` и `DO-002` не должны принимать самостоятельных контурных решений по этой фиче.`
- Единица поставки: `DU-01.F02`
- Роль: `Архитектор`
- Изменяемый контур: `architecture`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-users-and-roles.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-002-administrator-auth-session.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/du-01/features/feature-002-auth-session.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `нет`
- Минимальный read set: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-002-administrator-auth-session.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/architecture/du-01/features/feature-002-auth-session.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `Для `FEATURE-002` зафиксирован отдельный independently reviewable auth/session-slice с явными границами для backend, frontend и devops, включая Telegram/test-mode вход, bootstrap главного administrator и administrator guard.`
- Проверки: `Обновлены релевантные архитектурные артефакты при необходимости; контур `FEATURE-002` допускает отдельный smoke входа через `Telegram backoffice-бота` или test mode; scope фичи не включает управление меню, ролями пользователей и слотами.`
- Обновление карты приложения: `Обязательно при изменении модулей, entrypoints, env/config, persistence contour, run/test/deploy path: docs/architecture/application-map.md, docs/architecture/README.md, README.md при изменении корневой навигации.`
- Критерии готовности: `После завершения `AR-002` задачи `BE-002`, `FE-002` и `DO-002` могут реализовывать auth/session-срез без догадок о runtime-границах, shared-контрактах, bot entrypoint и smoke-пути фичи.`
