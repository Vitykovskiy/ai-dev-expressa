# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-001`
- Родительская задача: `Sprint-001`
- Заголовок: `Зафиксировать архитектурную рамку DU-01 и backlog фич Sprint-001`
- Описание: `На основе утвержденных бизнес- и системных артефактов по `DU-01` зафиксировать применимый архитектурный контур для первой административной поставки Expressa v1, актуализировать `docs/architecture/` под нужды `Sprint-001` и нарезать спринт на independently reviewable `FEATURE-*`. Role-specific child-задачи создаются только для активной фичи и не должны появляться для всего спринта заранее.`
- Единица поставки: `DU-01`
- Роль: `Архитектор`
- Изменяемый контур: `architecture`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-menu.md`, `docs/business/scenarios/administrator-manage-slot-settings.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`, `docs/business/scenarios/administrator-block-user.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/menu-catalog-and-options.md`, `docs/business/business-rules/pickup-slots-and-capacity.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`

## Примечания

- Зависимости: `нет`
- Минимальный read set: `tasks/Sprint-001-administration-foundation.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/slot-settings-management.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Для `Sprint-001` зафиксированы архитектурные ограничения `DU-01`, определен feature backlog и созданы только те downstream-задачи, которые нужны для старта `FEATURE-001`.`
- Проверки: `Обновлены релевантные документы в docs/architecture; созданы `FEATURE-001..005`; role-specific child-задачи существуют только для активной `FEATURE-001`.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map.md, docs/architecture/README.md, README.md при изменении корневой навигации.`
- Критерии готовности: `Архитектурная рамка `DU-01` не оставляет разработчикам решений по стеку, кодстайлу и feature-декомпозиции; после ее фиксации создан backlog `Sprint-001`, а `AR/FE/BE/DO` заведены только для активной `FEATURE-001`.`

## Результат

- `docs/architecture/du-01-administration.md` — зафиксирована архитектурная рамка, backlog фич `Sprint-001` и правила feature-декомпозиции `DU-01`.
- `tasks/FEATURE-001-foundation-runtime-bootstrap.md`
- `tasks/FEATURE-002-administrator-auth-session.md`
- `tasks/FEATURE-003-menu-management.md`
- `tasks/FEATURE-004-user-access-management.md`
- `tasks/FEATURE-005-slot-settings.md`
- `tasks/AR-002-feature-001-foundation-slicing.md`
- `tasks/FE-001-frontend-foundation-for-feature-001.md`
- `tasks/BE-001-backend-foundation-for-feature-001.md`
- `tasks/DO-001-runtime-foundation-for-feature-001.md`
- `tasks/QA-001-acceptance-for-sprint-001.md`
