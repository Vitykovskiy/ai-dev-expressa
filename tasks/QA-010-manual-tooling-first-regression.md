# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-010`
- Родительская задача: `FEATURE-008`
- Заголовок: `Ручное тестирование tooling-first alignment`
- Единица поставки: `FEATURE-008`
- Роль: `Тестирование`
- Контурная карта: `docs/architecture/application-map/qa-access.md`; `docs/architecture/application-map/qa-menu-catalog.md`; `docs/architecture/application-map/qa-slot-settings.md`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Цель

`Провести ручную regression-приемку результата tooling-first alignment и подтвердить, что пользовательское поведение административного контура сохранено.`

## Границы задачи

### Behavioral Requirements

- Система должна проверить затронутые backoffice routes после `FE-008`, `BE-007` и `DO-010`.
- Система должна сравнить наблюдаемое поведение с текущими feature scenarios и QA application maps.
- Система должна проверить, что tooling-first рефакторинг не изменил auth/session bootstrap, capability guards, role-based navigation, menu catalog behavior, slot settings behavior и users role-management behavior.
- Система должна фиксировать воспроизводимые дефекты как `BUG-*` под `FEATURE-008` или исходной feature с явной меткой контура причины.

### Назначенные инструменты и официальная документация

- Playwright reports and traces: `https://playwright.dev/docs/test-reporters`
- Playwright trace viewer: `https://playwright.dev/docs/trace-viewer`
- QA standards: `docs/architecture/qa-standards.md`

### Scope Constraints

- Задача охватывает manual QA acceptance и defect handoff.
- Изменение production-кода, e2e tests, system contracts, architecture standards и approved UI source находится вне области задачи.

### Safety Constraints

- QA не утверждает новое поведение по production-коду.
- QA фиксирует blocker, если canonical scenario или contract не позволяет однозначно принять поведение.
- QA создает `BUG-*` только для воспроизводимых дефектов с установленным контуром причины.

## Зона ответственности

### Разрешенная зона правок

- `tasks/QA-010-manual-tooling-first-regression.md`
- `tasks/BUG-*.md` только для воспроизводимых дефектов, найденных при ручной приемке

### Запрещенная зона правок

- `frontend/**`
- `backend/**`
- `e2e/**`
- `.github/**`
- `scripts/**`
- `docs/system/**`
- `docs/architecture/**`
- `docs/business/**`
- `.references/**`

## Маршрут чтения

- `process/workflow.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/qa-access.md`
- `docs/architecture/application-map/qa-menu-catalog.md`
- `docs/architecture/application-map/qa-slot-settings.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/delivery-and-runtime.md`

## Справочные ссылки

- `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.test-scenarios.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `https://playwright.dev/docs/test-reporters`
- `https://playwright.dev/docs/trace-viewer`

## Результат готовности

`Manual QA подтверждает сохранение пользовательского поведения после tooling-first alignment либо создает воспроизводимые BUG-* задачи с контуром причины и ссылкой на affected scenario.`

## Проверки

- Ручная проверка входа administrator и отказа для недостаточных прав.
- Ручная проверка navigation visibility для `barista` и `administrator`.
- Ручная проверка `/menu` по основным сценариям управления каталогом без повторной постановки `BUG-004`.
- Ручная проверка `/settings` по сценарию чтения и сохранения настроек слотов.
- Ручная проверка `/users` по сценарию просмотра пользователей и назначения роли.
- Проверка, что все найденные дефекты оформлены как `BUG-*` или явно отсутствуют.

## Результат выполнения

`не заполнено`
