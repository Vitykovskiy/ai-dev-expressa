# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-011`
- Родительская задача: `FEATURE-008`
- Заголовок: `E2E tooling-first regression`
- Единица поставки: `FEATURE-008`
- Роль: `Тестирование`
- Контурная карта: `docs/architecture/application-map/qa-access.md`; `docs/architecture/application-map/qa-menu-catalog.md`; `docs/architecture/application-map/qa-slot-settings.md`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Цель

`Обновить при необходимости и выполнить browser e2e regression suite после tooling-first alignment с mapping на stable scenario IDs затронутых фич.`

## Границы задачи

### Behavioral Requirements

- Система должна использовать Playwright как штатный e2e-инструмент для browser regression.
- Система должна запускать e2e suite через каноническую команду `npm run test:e2e`.
- Система должна связывать e2e evidence с stable scenario IDs из feature test scenarios.
- Система должна использовать shared e2e fixtures/helpers в `support/`, если helper нужен нескольким spec-файлам одного контура.
- Система должна фиксировать воспроизводимые дефекты как `BUG-*` с явной меткой контура причины.

### Назначенные инструменты и официальная документация

- Playwright tests: `https://playwright.dev/docs/intro`
- Playwright fixtures: `https://playwright.dev/docs/test-fixtures`
- Playwright best practices: `https://playwright.dev/docs/best-practices`

### Scope Constraints

- Задача охватывает QA-owned browser e2e tests, fixtures, reports, evidence и defect handoff.
- Изменение frontend production code, backend production code, runtime/deployment route, system contracts и approved UI source находится вне области задачи.

### Safety Constraints

- E2E QA не заменяет ручную приемку UI parity из `QA-010`.
- E2E QA не утверждает новое поведение по фактическому production-коду.
- E2E QA фиксирует blocker, если scenario IDs или expected assertions отсутствуют в назначенных источниках.

## Зона ответственности

### Разрешенная зона правок

- `e2e/**`
- `tasks/QA-011-e2e-tooling-first-regression.md`
- `tasks/BUG-*.md` только для воспроизводимых дефектов, найденных при e2e regression

### Запрещенная зона правок

- `frontend/**`
- `backend/**`
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
- `docs/architecture/application-map/delivery-and-runtime.md`
- `https://playwright.dev/docs/intro`

## Справочные ссылки

- `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.test-scenarios.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `https://playwright.dev/docs/test-fixtures`
- `https://playwright.dev/docs/best-practices`

## Результат готовности

`E2E QA выполняет browser regression suite через npm run test:e2e, фиксирует pass/fail evidence и mapping между stable scenario IDs, test files, test titles и required assertions.`

## Проверки

- `npm run test:e2e`
- Coverage mapping должен перечислять затронутые scenario IDs, test files, test titles и required assertions.
- Проверить, что новые или измененные helpers находятся в `e2e/**/support/**`, если используются несколькими spec-файлами.

## Результат выполнения

`не заполнено`
