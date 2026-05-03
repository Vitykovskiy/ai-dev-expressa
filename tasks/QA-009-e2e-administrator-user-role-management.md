# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-009`
- Родительская задача: `FEATURE-004`
- Заголовок: `E2E управление ролями пользователей`
- Единица поставки: `FEATURE-004`
- Роль: `Тестирование`
- Контурная карта: `docs/architecture/application-map/qa-access.md`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Цель

`Добавить и выполнить browser e2e coverage для required сценариев FEATURE-004 с явным mapping между Scenario ID, test file, test title и required assertions.`

## Границы задачи

- Входит browser e2e coverage для required scenarios `F004-SC-001`, `F004-SC-003`, `F004-SC-004`, `F004-SC-005`, `F004-SC-006` и `F004-SC-007`.
- Входит optional e2e coverage для `F004-SC-002` и `F004-SC-008`, если устойчивые селекторы и тестовые данные позволяют сделать проверку без хрупкости.
- Входит фиксация coverage mapping в результате выполнения QA task.
- Входит фиксация воспроизводимых дефектов как `BUG-*` под `FEATURE-004` с контуром причины, если причина ясна.
- Маршрут чтения шире обычного QA read set, потому что e2e lane связывает package scenario IDs, frontend/backend application maps и published test-e2e runtime route.
- Не входит ручная приемка UI parity как замена e2e evidence.
- Не входит изменение production-кода, feature package, системных документов или `.references`.

## Зона ответственности

### Разрешенная зона правок

- `e2e/access/**`
- `e2e/**/support/**` только для shared helpers, необходимых FEATURE-004
- `tasks/QA-009-e2e-administrator-user-role-management.md`
- `tasks/BUG-*.md` только для воспроизводимых дефектов под `FEATURE-004`

### Запрещенная зона правок

- `frontend/**`
- `backend/**`
- `docs/system/**`
- `docs/business/**`
- `.references/**`
- Deployment/runtime configuration

## Маршрут чтения

- `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/interfaces.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/ui-behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/qa-access.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/delivery-and-runtime.md`

## Справочные ссылки

- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md` — только если optional UI parity e2e coverage требует сверки видимого users-flow.

## Результат готовности

`E2E QA добавляет tests для required F004 scenarios, выполняет полный browser suite командой npm run test:e2e и фиксирует coverage mapping: Scenario ID, test file, test title и required assertions.`

## Проверки

- `npm run test:e2e`
- Coverage mapping должен включать:
  - `F004-SC-001 administrator sees users list`
  - `F004-SC-003 administrator assigns barista`
  - `F004-SC-004 assigned barista capabilities`
  - `F004-SC-005 non administrator denied users management`
  - `F004-SC-006 invalid role rejected`
  - `F004-SC-007 main administrator assigns administrator`

## Результат выполнения

`2026-05-01 — добавлено browser e2e coverage FEATURE-004 и затем разнесено по focused spec-файлам e2e/access/administrator-user-role-*.spec.ts. Общие role-management fixtures/helpers вынесены в e2e/access/support/user-role-management-helpers.ts, общий access API/helper слой сохранен в e2e/access/support/access-helpers.ts. Команда npm run test:e2e выполнена против default published route https://expressa-e2e-test.vitykovskiy.ru: 31 passed. Focused check npm run test:e2e -- access/administrator-user-role: 6 passed. Новые BUG-* не созданы.`

`Примечание: published test-e2e users list на момент проверки содержит только главного administrator, поэтому сценарии, требующие отдельного target user или ordinary administrator, используют browser route fixtures с assertions request payload, response body и UI state без мутации bootstrap administrator; F004-SC-001 и F004-SC-006 дополнительно проверяют published backend boundary.`

### Coverage mapping

| Scenario ID   | Test file                                               | Test title                                              | Required assertions                                                                                                                                                                                                           |
| ------------- | ------------------------------------------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `F004-SC-001` | `e2e/access/administrator-user-role-list.spec.ts`       | `F004-SC-001 administrator sees users list`             | Вкладка `Пользователи` видима administrator; список или empty state отображен; `GET /backoffice/user-management/users` проходит в authenticated context и возвращает `200`.                                                   |
| `F004-SC-003` | `e2e/access/administrator-user-role-assignment.spec.ts` | `F004-SC-003 administrator assigns barista`             | Operation отправляет `assignedRole=barista`; response содержит роль `barista` и barista capabilities; строка пользователя обновляется до `Бариста`.                                                                           |
| `F004-SC-004` | `e2e/access/administrator-user-role-access.spec.ts`     | `F004-SC-004 assigned barista capabilities`             | Для barista видимы `Заказы` и `Доступность`; `Меню`, `Пользователи`, `Настройки` скрыты; прямой `/users` route приводит к forbidden state.                                                                                    |
| `F004-SC-005` | `e2e/access/administrator-user-role-access.spec.ts`     | `F004-SC-005 non administrator denied users management` | У barista нет вкладки `Пользователи`; прямой `/users` route запрещен; role assignment operation возвращает `administrator-role-required`.                                                                                     |
| `F004-SC-006` | `e2e/access/administrator-user-role-api.spec.ts`        | `F004-SC-006 invalid role rejected`                     | Invalid role отклоняется с `role-not-assignable`; роли target user остаются без изменений после повторного чтения списка.                                                                                                     |
| `F004-SC-007` | `e2e/access/administrator-user-role-assignment.spec.ts` | `F004-SC-007 main administrator assigns administrator`  | Обычный administrator получает `main-administrator-required`; роли target user не меняются после отказа; главный administrator успешно назначает `administrator`; response содержит `menu`, `users`, `settings` capabilities. |
