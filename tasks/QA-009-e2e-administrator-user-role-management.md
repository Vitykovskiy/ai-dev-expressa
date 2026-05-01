# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-009`
- Родительская задача: `FEATURE-004`
- Заголовок: `E2E управление ролями пользователей`
- Единица поставки: `FEATURE-004`
- Роль: `Тестирование`
- Контурная карта: `docs/architecture/application-map/qa-access.md`
- Приоритет: `Критический`
- Статус: `Готова к работе`

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

`не заполнено`
