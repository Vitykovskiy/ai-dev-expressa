# Карточка задачи

## Карточка задачи

- Идентификатор: `BUG-004`
- Родительская задача: `FEATURE-004`
- Заголовок: `devops: test-e2e target user не сохраняет чистую precondition для назначения barista`
- Описание: `Во время QA-008 published test-e2e stand предоставил actor preconditions для FEATURE-004, но assignable target feature004-target-user уже находился в загрязненном состоянии roles=[administrator, barista, customer]. Из-за этого FTS-004-002 не может подтвердить чистый happy path назначения barista с пересчетом доступа только к вкладкам Заказы и Доступность. Нужно восстановить воспроизводимый seed/reset route для feature004-target-user перед QA-прогоном или обеспечить идемпотентное приведение target к исходному состоянию roles=[customer] без ручной мутации shared bootstrap administrator.`
- Единица поставки: `FEATURE-004`
- Роль: `Девопс`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/backend-access.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `tasks/QA-008-feature-004-repeat-manual-user-role-management-after-corrections.md`, `tasks/DO-011-feature-004-test-e2e-role-management-preconditions.md`

## Примечания

- Зависимости: `DO-011`, `QA-008`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `tasks/DO-011-feature-004-test-e2e-role-management-preconditions.md`, `tasks/QA-008-feature-004-repeat-manual-user-role-management-after-corrections.md`
- Ожидаемый результат для ревью: `Published test-e2e route перед ручной и e2e QA предоставляет feature004-target-user в чистом исходном состоянии для FTS-004-002: displayName=Ivan Petrov, telegramUsername=@ivan_petrov, roles=[customer], availableRoleAssignments содержит barista для bootstrap administrator.`
- Проверки: `GET /backoffice/users под bootstrap administrator показывает feature004-target-user с roles=[customer] до назначения`, `PATCH /backoffice/users/feature004-target-user/role с role=barista возвращает roles, содержащие customer и barista без administrator, и backofficeAccess.capabilities=[orders, availability]`, `повторный deploy/test-data step идемпотентно восстанавливает эту precondition на test-e2e`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/delivery-and-runtime.md, если меняется seed/reset route или smoke-check precondition`
- Критерии готовности: `QA может повторить FTS-004-002 без загрязненного target user и без ручного изменения ролей через production UI или прямой SQL`

## Детали дефекта

- Обнаружено в: `QA-008`, `2026-04-25`, published `test-e2e` stand.
- Affected scenario: `FTS-004-002`.
- Actual: `feature004-target-user` уже имел `roles=[administrator, barista, customer]` до проверки назначения `barista`.
- Expected: перед QA-прогоном target user находится в исходном состоянии `roles=[customer]`, а назначение `barista` подтверждает пересчет доступа только к `Заказы` и `Доступность`.
- Проверка исправления: после deploy/test-data step `GET /backoffice/users` под bootstrap administrator показывает `feature004-target-user` с `roles=[customer]`; затем `PATCH /backoffice/users/feature004-target-user/role` с `role=barista` возвращает роли без `administrator` и `backofficeAccess.capabilities=[orders, availability]`.
