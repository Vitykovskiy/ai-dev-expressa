# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-011`
- Родительская задача: `FEATURE-004`
- Заголовок: `Test-e2e preconditions для ручной и e2e проверки управления ролями`
- Описание: `По итогам manual QA-001 стенд test-e2e не содержит данных и акторов, необходимых для mandatory scenarios FEATURE-004: отдельный target user для назначения barista, ordinary non-bootstrap administrator actor, authenticated non-administrator/barista actor и окружение для проверки canonical empty users state. Нужно подготовить воспроизводимый runtime/test-data route для стенда test-e2e, чтобы QA могла пройти FTS-004-002, FTS-004-004, FTS-004-006 и FTS-004-008 без ручной мутации shared bootstrap administrator и без расширения scope до block_user или unblock_user.`
- Единица поставки: `FEATURE-004`
- Роль: `Девопс`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/backend-access.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `tasks/QA-001-feature-004-manual-user-role-management.md`

## Примечания

- Зависимости: `DO-010`, `BE-001`, `QA-001`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/architecture/qa-standards.md`, `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/backend-access.md`, `tasks/QA-001-feature-004-manual-user-role-management.md`
- Ожидаемый результат для ревью: `Published test-e2e route предоставляет воспроизводимые preconditions для FTS-004-002, FTS-004-004, FTS-004-006 и FTS-004-008: отдельный assignable target user, ordinary administrator actor, non-admin/barista actor, документированный способ проверить empty users state или зафиксированное допустимое исключение для bootstrap administrator.`
- Проверки: `Документированная проверка seed/precondition route на test-e2e`, `GET /backoffice/users с test-mode actor для bootstrap administrator возвращает target user с заполненным telegramUsername`, `session/direct users access для non-admin actor позволяет проверить expected 403 guard semantics`, `ordinary administrator actor позволяет проверить administrator-role-assignment-forbidden`, `QA route npm run test:e2e остается опубликованным на https://expressa-e2e-test.vitykovskiy.ru`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/delivery-and-runtime.md; docs/architecture/deployment-map.md обновляется, если меняется deploy/test-data route; docs/architecture/application-map/backend-access.md обновляется, если меняется server runtime/config route`
- Критерии готовности: `QA-001 blockers QA-001-BLOCKER-002, QA-001-BLOCKER-003, QA-001-BLOCKER-004 и QA-001-BLOCKER-005 имеют воспроизводимый test-e2e route для повторной проверки`

## Результат выполнения

- `test-e2e` deploy route применяет idempotent `FEATURE-004` seed после users schema/migration step только при `DEPLOY_STAND_SLUG=test-e2e`.
- Published route предоставляет assignable target `feature004-target-user` (`telegramId=9404002`, `telegramUsername=@ivan_petrov`), ordinary administrator actor `x-test-telegram-id: 9404008` и non-admin/barista actor `x-test-telegram-id: 9404006`.
- Post-deploy smoke-check подтверждает target user через `GET /backoffice/users`, session/direct guard semantics для barista actor и `administrator-role-assignment-forbidden` для ordinary administrator actor.
- Canonical empty users state для shared `test-e2e` зафиксирован как допустимое runtime-исключение из-за обязательного bootstrap administrator; QA проверяет empty-state UI через zero-result search/filter responses.
