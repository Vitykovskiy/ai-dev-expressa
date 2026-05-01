# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-008`
- Родительская задача: `FEATURE-004`
- Заголовок: `Ручное тестирование управления ролями пользователей`
- Единица поставки: `FEATURE-004`
- Роль: `Тестирование`
- Контурная карта: `docs/architecture/application-map/qa-access.md`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Цель

`Проверить вручную сценарии FEATURE-004: список пользователей, поиск/фильтры, назначение barista, guard administrator, guard главного administrator и UI parity вкладки Пользователи.`

## Границы задачи

- Входит ручной проход `F004-SC-001` ... `F004-SC-008`.
- Входит проверка UI parity с `.references/Expressa_admin` для вкладки `Пользователи`, меню `Назначить роль` и диалога назначения роли.
- Входит фиксация воспроизводимых дефектов как `BUG-*` под `FEATURE-004` с контуром причины, если причина ясна.
- Маршрут чтения шире обычного QA read set, потому что manual QA обязана проверить scenario IDs и UI parity по конкретным versioned reference files.
- Не входит написание browser e2e tests.
- Не входит изменение production-кода, feature package, системных документов или `.references`.

## Зона ответственности

### Разрешенная зона правок

- `tasks/QA-008-manual-administrator-user-role-management.md`
- `tasks/BUG-*.md` только для воспроизводимых дефектов под `FEATURE-004`
- QA evidence, если оно сохраняется в принятом проектом месте для результатов ручной проверки

### Запрещенная зона правок

- `frontend/**`
- `backend/**`
- `e2e/**`
- `docs/system/**`
- `docs/business/**`
- `.references/**`
- Deployment/runtime configuration

## Маршрут чтения

- `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/ui-behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/qa-access.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx`
- `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`

## Справочные ссылки

- `.references/Expressa_admin/src/app/components/AddUserDialog.tsx` — только для подтверждения, что создание пользователя находится вне acceptance FEATURE-004.

## Результат готовности

`Manual QA evidence фиксирует pass/fail по каждому F004 scenario ID, UI parity decision и список созданных BUG-* либо явное отсутствие воспроизводимых дефектов.`

## Проверки

- `F004-SC-001` — Administrator видит список пользователей.
- `F004-SC-002` — Поиск и фильтры списка пользователей.
- `F004-SC-003` — Administrator назначает роль `barista`.
- `F004-SC-004` — Доступ целевого пользователя пересчитан после назначения `barista`.
- `F004-SC-005` — Пользователь без `administrator` не управляет пользователями.
- `F004-SC-006` — Недопустимая назначаемая роль отклоняется.
- `F004-SC-007` — Назначение роли `administrator` ограничено главным administrator.
- `F004-SC-008` — UI parity вкладки `Пользователи` и диалога назначения роли.

## Блокеры

- Отсутствуют. `2026-05-01` — blocker снят: `tasks/FEATURE-004-administrator-user-role-management.md` переведена в `Статус: Ожидает тестирования` после подтверждения, что `AR-007`, `FE-007` и `BE-006` имеют `Статус: Выполнена`.

## Результат выполнения

`2026-05-01` — manual QA `FEATURE-004` выполнена на локальном QA runtime: frontend `http://127.0.0.1:5173`, backend `http://127.0.0.1:3000` с временно подготовленными test users `2002`, `3003`, `4004`, `5005` для покрытия ролей, фильтров и guard-сценариев.

- `F004-SC-001`: `PASS` — administrator видит вкладку `Пользователи`, список пользователей, роли и статусы.
- `F004-SC-002`: `PASS` — поиск по Telegram id, фильтр `Баристы`, фильтр `Заблокированные` и возврат к `Все` меняют только отображение списка; backend roles/status не меняются.
- `F004-SC-003`: `PASS` — administrator назначает `barista`; UI показывает `Роль назначена`, строка пользователя обновляется, backend сохраняет `customer` и добавляет `barista`.
- `F004-SC-004`: `PASS` — целевой пользователь после `barista` видит только `Заказы` и `Доступность`; прямой переход на `/users` ведёт в forbidden state `403`.
- `F004-SC-005`: `PASS` — пользователь без `administrator` не видит `Пользователи`, прямой route guard запрещает доступ, API operation boundary возвращает `administrator-role-required`.
- `F004-SC-006`: `PASS` — `assignedRole=customer` отклоняется с `role-not-assignable`; роли целевого пользователя остаются без изменений.
- `F004-SC-007`: `PASS` — обычный administrator получает `main-administrator-required`; главный administrator назначает `administrator`, целевой пользователь получает вкладки `Заказы`, `Доступность`, `Меню`, `Пользователи`, `Настройки`.
- `F004-SC-008`: `FAIL` — users screen, фильтры, список и role options присутствуют, но desktop parity диалога назначения роли нарушен: после выбора `Назначить роль` меню действий остаётся видимым под overlay, а dialog на viewport `1280x900` открывается как bottom sheet и не является полностью видимым центрированным desktop modal.

Созданные дефекты:

- `tasks/BUG-003-users-role-dialog-desktop-parity.md` — frontend defect по `F004-SC-008`.
