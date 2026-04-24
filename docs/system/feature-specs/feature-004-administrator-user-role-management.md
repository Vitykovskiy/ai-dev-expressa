# Feature Spec: `FEATURE-004` Administrator User Role Management

## Карточка документа

- Feature: `FEATURE-004`
- Parent sprint: `SPRINT-001`
- Feature spec: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`
- Test scenarios: `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`
- Status: `ready-for-architecture`
- Related roles: `Системный аналитик`, `Архитектор`, `Frontend`, `Backend`, `QA`
- Affected interfaces: `backoffice users screen`, `assign user role contract`, `identity and access boundary`
- Last consistency check: `2026-04-24`

## Source Trace

### Business input

- `tasks/FEATURE-004-administrator-user-role-management.md`

### System sources

- `use-cases`: `docs/system/use-cases/administrator-manage-users-and-roles.md`
- `contracts`: `docs/system/contracts/user-role-and-blocking-management.md`
- `domain-model`: `docs/system/domain-model/identity-and-access.md`
- `state-models`: `n/a`
- `ui-behavior-mapping`: `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`

### UI sources

- `ui-contract`: `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `versioned design sources`: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`
- `prototype verification status`: `verified`

## Feature Boundary

### Included scope

- Просмотр списка пользователей во вкладке `Пользователи` backoffice.
- Поиск и фильтрация списка пользователей как часть пользовательского сценария выбора цели назначения роли.
- Открытие формы добавления пользователя как UI entrypoint для операции назначения роли.
- Назначение пользователю роли `barista` любым `administrator` с capability `users`.
- Назначение пользователю роли `administrator` только главным `administrator`, совпадающим с `ADMIN_TELEGRAM_ID`.
- Пересчет доступа пользователя к вкладкам backoffice после успешного назначения роли.
- Явная фиксация зависимости от постоянного хранения пользователей, ролей и `blocked state` в `PostgreSQL`.

### Explicitly excluded scope

- Блокировка пользователя.
- Разблокировка пользователя.
- Изменение роли `customer`.
- Отзыв уже выданной роли.
- Изменение визуального канона экрана `Пользователи` вне зафиксированного референса.

### Business outcome

- `Система должна предоставлять administrator законченный сценарий просмотра пользователей и назначения роли barista или administrator с пересчетом доступа к вкладкам backoffice в рамках подтвержденных системных правил.`

### Dependencies

- `docs/system/domain-model/identity-and-access.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/use-cases/administrator-manage-users-and-roles.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `docs/architecture/stack.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`
- `FEATURE-001`

## Contract Boundary

### Read users list

- Operation: `GET /backoffice/users`
- Canonical contract: `docs/system/contracts/user-role-and-blocking-management.md#contract-read-users-list`
- Purpose in feature flow: загрузить наблюдаемый список пользователей для экрана `Пользователи` без изменения ролей или `blocked state`.
- Query parameters in scope: `search`, `role`, `blocked`
- Success semantics: `200 OK` возвращает `items[]` с `userId`, `displayName`, `telegramUsername`, `roles`, `blocked`, `availableRoleAssignments` и `meta.total`.
- Error semantics: `401 Unauthorized` с кодом auth boundary, `403 Forbidden` + `backoffice-capability-forbidden`, `500 Internal Server Error` + `identity-access-read-failed`.

### Assign user role

- Operation: `PATCH /backoffice/users/{userId}/role`
- Canonical contract: `docs/system/contracts/user-role-and-blocking-management.md#contract-assign-user-role`
- Purpose in feature flow: изменить набор ролей целевого пользователя и вернуть пересчитанный доступ к вкладкам backoffice.
- Request body in scope: `{ "role": "barista" | "administrator" }`
- Success semantics: `200 OK` возвращает `userId`, фактически сохраненный набор `roles` и `backofficeAccess.capabilities`.
- Error semantics: `401 Unauthorized` с кодом auth boundary, `403 Forbidden` + `backoffice-capability-forbidden | administrator-role-required | administrator-role-assignment-forbidden`, `404 Not Found` + `user-not-found`, `422 Unprocessable Entity` + `role-not-assignable`, `500 Internal Server Error` + `identity-access-write-failed`.

## User Workflows

### Main workflow

1. `Administrator` открывает вкладку `Пользователи` в backoffice.
2. `Система должна вызвать contract Read users list через GET /backoffice/users и отобразить список пользователей, доступный для выбора цели назначения роли.`
3. `Administrator` при необходимости использует поиск или фильтр для уточнения списка.
4. `Administrator` инициирует действие добавления пользователя или выбора роли для существующего пользователя.
5. Система должна предоставить форму с выбором допустимой назначаемой роли из набора `barista` и `administrator` в соответствии с `availableRoleAssignments` для целевого пользователя и инициатора.
6. `Administrator` подтверждает назначение роли.
7. `Система должна отправить contract Assign user role через PATCH /backoffice/users/{userId}/role с выбранной ролью.`
8. `Система должна проверить административные права инициатора, capability users, допустимость назначаемой роли и право назначения роли administrator только для BootstrapAdministrator.`
9. `Система должна сохранить новое ролевое назначение в постоянном хранилище.`
10. `Система должна пересчитать доступ целевого пользователя к вкладкам backoffice согласно обновленному набору ролей и вернуть его в success response.`
11. `Система должна подтвердить успешное завершение операции наблюдаемым пользовательским уведомлением.`

### Alternative workflows

#### `Поиск и фильтрация перед назначением роли`

1. `Administrator` вводит поисковый запрос или выбирает фильтр списка пользователей.
2. `Система должна сузить отображаемый набор пользователей без изменения ролей до подтверждения целевой операции.`
3. `Система должна сохранить возможность перейти к назначению роли из отфильтрованного результата.`

#### `Назначение роли barista`

1. `Administrator` выбирает в форме значение `barista`.
2. `Система должна принять это значение как допустимую назначаемую роль.`
3. Система должна пересчитать доступ пользователя так, чтобы ему были доступны только вкладки `Заказы` и `Доступность` в рамках доменной модели доступа.

#### `Назначение роли administrator главным administrator`

1. `BootstrapAdministrator` выбирает в форме значение `administrator`.
2. `Система должна принять это значение как допустимую назначаемую роль только для инициатора, совпадающего с ADMIN_TELEGRAM_ID.`
3. `Система должна сохранить роль administrator и вернуть success response с пересчитанным набором backoffice capabilities целевого пользователя.`

### Exception workflows

#### `Недопустимая назначаемая роль`

1. `Administrator` или клиентский UI передает значение роли вне набора `barista`, `administrator`.
2. `Система должна отклонить изменение роли.`
3. Система должна вернуть `422 Unprocessable Entity` с бизнес-ошибкой `role-not-assignable` без изменения набора ролей пользователя.

#### `Инициатор не имеет административных прав`

1. Операцию назначения роли инициирует пользователь без административных прав.
2. `Система должна отклонить изменение роли.`
3. Система должна вернуть `403 Forbidden` с ошибкой `administrator-role-required` или `backoffice-capability-forbidden` без изменения ролей целевого пользователя в зависимости от точки отклонения запроса.

#### `Назначение administrator инициировано не главным administrator`

1. Обычный `administrator` инициирует назначение роли `administrator`.
2. `Система должна отклонить изменение роли без изменения ролей целевого пользователя.`
3. `Система должна возвращать 403 Forbidden с ошибкой administrator-role-assignment-forbidden.`

### System-relevant UI states

- Empty state: `Система должна показывать пустое состояние списка пользователей с сообщением о появлении пользователей после активации бота, если в системе нет доступных записей пользователей.`
- Loading state: `Система должна скрывать рабочие действия назначения роли до загрузки списка пользователей и доступных действий.`
- Success state: `Система должна подтверждать успешное назначение роли пользовательским уведомлением.`
- Error state: `Система должна сохранять текущее состояние экрана и показывать наблюдаемую ошибку, если назначение роли отклонено.`
- Disabled state: `Система должна держать подтверждение формы недоступным, пока обязательные поля формы нового пользователя не заполнены.`
- Hidden state: Система должна скрывать административные вкладки и действия от пользователя без capability `users`.
- Guarded state: `Система должна запрещать выполнение сценария назначения роли пользователю без административных прав даже при прямом доступе к маршруту или API.`
- Confirmation state: `Система должна выполнять сохранение роли только после явного подтверждения формы назначения.`
- Notification state: `Система должна выдавать наблюдаемое уведомление после успешной административной операции назначения роли.`
- Inline error state: `Система должна сохранять встроенное состояние ошибки в форме, если обязательные данные пользователя не заполнены или роль недопустима для назначения.`

## Entity View

### Entities

- `User`
- `Role`
- `BootstrapAdministrator`

### Relations

- `User` хранит набор ролей `roles`.
- `administrator` назначает роли другим `User`.
- `BootstrapAdministrator` назначает роль `administrator` другим `User`.
- `User` с операционной ролью получает доступ к backoffice по вычисленному набору вкладок.
- `BootstrapAdministrator` задает главного `administrator` через `ADMIN_TELEGRAM_ID`.

### Invariants

- Система должна считать допустимыми назначаемыми ролями в этой фиче только `barista` и `administrator`.
- Система должна сохранять роль `customer` вне операций назначения роли этой фичи.
- `Система должна вычислять доступ к вкладкам backoffice на основании фактического набора ролей пользователя.`
- `Система должна разрешать назначение роли administrator только BootstrapAdministrator.`
- Система должна хранить пользователей, роли и `blocked state` в `PostgreSQL` как в постоянном источнике истины для production-уровня handoff.

### Identity and ownership

- `User.userId` является внутренним идентификатором пользователя.
- `User.telegramId` является внешним идентификатором, используемым как основа идентификации.
- Источником истины по ролям и доступу является backend boundary `identity-access`.
- Жизненный цикл главного `administrator` зависит от конфигурации `ADMIN_TELEGRAM_ID`.

## UI Element Action Sequence

### Screen or surface

- `users`

### Element-to-action mapping

| UI element                       | User action     | System reaction                                                                                                    | Related source                                                                                                                  |
| -------------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `TopBar.search`                  | `toggle search` | `Система должна открывать и закрывать поиск по списку пользователей без изменения ролей.`                          | `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`                                                                    |
| `FilterTabs`                     | `select filter` | `Система должна ограничивать отображаемый список пользователей выбранным фильтром.`                                | `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`                                                                    |
| `Button "Добавить пользователя"` | `open dialog`   | `Система должна открывать форму ввода нового пользователя и выбора роли.`                                          | `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx` |
| `Dialog.name`                    | `enter text`    | `Система должна принимать имя как обязательное поле формы.`                                                        | `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`                                                               |
| `Dialog.telegramUsername`        | `enter text`    | `Система должна принимать Telegram username как обязательное поле формы.`                                          | `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`                                                               |
| `Dialog.role`                    | `select value`  | Система должна ограничивать выбор роли значениями `barista` и `administrator`.                                     | `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`, `docs/system/contracts/user-role-and-blocking-management.md` |
| `Dialog.confirm`                 | `submit form`   | `Система должна выполнить проверку прав инициатора, допустимости роли и сохранение ролевого назначения.`           | `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`, `docs/system/contracts/user-role-and-blocking-management.md` |
| `User row menu`                  | `open actions`  | Система должна предоставлять entrypoint для административного действия по роли только в рамках capability `users`. | `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`        |

### Interaction notes

- Система должна использовать экран `Пользователи` и диалог `Новый пользователь` как канонический UI-вход для назначения роли без проектирования новой отдельной визуальной схемы.
- `Система должна сохранять поиск, фильтры и список пользователей в пределах сценария выбора цели назначения роли.`
- `Система должна рассматривать блокировку и разблокировку как отдельный системный контур вне этой фичи, даже если визуальный референс показывает смежные action entrypoints.`

## Input Constraints

### Required inputs

- `целевой пользователь`
- `назначаемая роль`
- `name` в форме нового пользователя
- `telegramUsername` в форме нового пользователя
- `userId` в path операции `PATCH /backoffice/users/{userId}/role`

### Allowed values

- `назначаемая роль`: `barista`, `administrator`
- `AccessChannel` для операционных ролей: `backoffice-telegram-entry`
- `query.role` для `GET /backoffice/users`: `barista`, `administrator`
- `query.blocked` для `GET /backoffice/users`: `true`, `false`

### Cross-field constraints

- `Система должна выполнять операцию назначения роли только для пользователя, которого можно однозначно идентифицировать в identity-access boundary.`
- `Система должна принимать сохранение формы нового пользователя только при наличии одновременно имени, Telegram username и выбранной роли.`

### Boundary values

- Пустое имя в форме нового пользователя.
- Пустой `telegramUsername` в форме нового пользователя.
- Роль вне допустимого множества.
- Повторный запуск приложения после bootstrap главного `administrator`.

## Validations

### Field validations

- Система должна считать поле `name` обязательным для подтверждения формы нового пользователя.
- Система должна считать поле `telegramUsername` обязательным для подтверждения формы нового пользователя.

### Business validations

- Система должна отклонять назначение роли вне допустимого множества `barista`, `administrator`.
- `Система должна пересчитывать доступ к вкладкам backoffice только после успешного сохранения новой роли пользователя.`
- `Система должна использовать PostgreSQL как постоянное хранилище пользователей, ролей и blocked state при архитектурной декомпозиции этой фичи.`

### Role or capability validations

- `Система должна разрешать операцию назначения роли только пользователю с административными правами.`
- Система должна ограничивать видимость вкладки `Пользователи` и связанных действий пользователями с capability `users`.
- `Система должна разрешать назначение роли administrator только BootstrapAdministrator.`

## Errors

### User-facing errors

- `administrator-role-required` — `Система должна сообщать, что операция назначения роли требует административных прав.`
- `administrator-role-assignment-forbidden` — `Система должна сообщать, что роль administrator может назначать только главный administrator.`
- `role-not-assignable` — `Система должна сообщать, что выбранная роль не может быть назначена в рамках этой операции.`

### System errors

- `user-not-found` — `Система должна отклонять изменение роли без сохранения частичного результата, если целевой пользователь не найден.`
- `identity-access-read-failed` — `Система должна отклонять чтение списка пользователей без частичного результата.`
- `identity-access-write-failed` — `Система должна отклонять изменение роли без частичного результата при ошибке сохранения.`

### Error mapping

| Condition                                                                              | User-visible outcome                                                                                     | Source                                                       |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `GET /backoffice/users -> 403 backoffice-capability-forbidden`                         | `Система должна не показывать рабочий список пользователей и сохранять защищенное состояние доступа.`    | `docs/system/contracts/user-role-and-blocking-management.md` |
| `PATCH /backoffice/users/{userId}/role -> 403 administrator-role-required`             | `Система должна показать отказ в административной операции.`                                             | `docs/system/contracts/user-role-and-blocking-management.md` |
| `PATCH /backoffice/users/{userId}/role -> 403 administrator-role-assignment-forbidden` | `Система должна сообщить, что роль administrator доступна для назначения только главному administrator.` | `docs/system/contracts/user-role-and-blocking-management.md` |
| `PATCH /backoffice/users/{userId}/role -> 422 role-not-assignable`                     | `Система должна показать ошибку недопустимой роли.`                                                      | `docs/system/contracts/user-role-and-blocking-management.md` |
| `PATCH /backoffice/users/{userId}/role -> 404 user-not-found`                          | `Система должна сохранить экран пользователя без подтверждения операции.`                                | `docs/system/contracts/user-role-and-blocking-management.md` |

## Edge Cases

- `Система должна сохранять пустое состояние списка пользователей как допустимый сценарий, в котором назначение роли недоступно до появления пользователя после активации бота.`
- `Система должна обрабатывать повторный запуск bootstrap главного administrator идемпотентно без создания дубликата пользователя или дублирования роли administrator.`
- `Система должна пересчитывать вкладки backoffice после назначения роли так, чтобы последующий вход пользователя отражал обновленный набор возможностей.`
- `Система должна не расширять поведение до разблокировки пользователя, даже если в UI-референсе присутствует смежное действие.`
- `Система должна считать незафиксированным сочетание нескольких операционных ролей сверх сочетания с ролью customer и не выводить дополнительное правило без отдельного источника.`

## Scope Constraints

- Фича охватывает только просмотр пользователей и назначение ролей `barista` или `administrator`.
- `Фича исключает блокировку и разблокировку пользователя.`
- Фича исключает изменение роли `customer`.
- Фича не задает новое визуальное решение вне канонического UI-референса `.references/Expressa_admin`.

## Safety Constraints

- Назначение роли `administrator` остается доступным только `BootstrapAdministrator`.
- `Постоянное хранение пользователей, ролей и blocked state сохраняется как обязательное условие production-ready handoff.`
- `Доступ к операции назначения роли сохраняется только за administrator и не определяется клиентом самостоятельно.`
- `Пересчет доступа к вкладкам backoffice сохраняется зависимым от серверного набора ролей пользователя.`

## Prototype Completeness Audit

### Current prototype status

- `partial`

### Audit checklist

- `UsersScreen` содержит список пользователей, поиск, фильтры и entrypoint добавления пользователя.
- `AddUserDialog` содержит обязательные поля имени, Telegram username и выбора роли.
- Прототип показывает выбор роли `administrator`, что соответствует контракту `Assign user role`.
- Прототип содержит соседние паттерны управления пользователями шире границы этой фичи.

### Design gaps and required prototype corrections

- Gap: `Экран пользователей в общей карте UI связывается также с блокировкой и разблокировкой, которые не входят в границы FEATURE-004.`
  - Required correction: При handoff в реализацию отделить операции назначения роли от блокировки и не считать `unblock_user` частью этой фичи.
  - Canonical source: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`

### Repeated verification result

- `Проверка повторена после BA-001 и обновления базовых system artifacts: визуальный выбор роли administrator остается допустимым, а guard BootstrapAdministrator зафиксирован в канонических system artifacts без открытых blocker по FEATURE-004.`

## Test Scenarios Link

- `Система должна ссылаться на sibling документ сценариев тестирования фичи: docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md.`
- `Sibling документ сценариев тестирования должен использовать тот же contract boundary GET /backoffice/users и PATCH /backoffice/users/{userId}/role с актуальными transport/business errors.`

## Architecture Handoff Checklist

- `Система должна иметь явную feature boundary.`
- `Система должна иметь перечисленные user workflows.`
- Система должна иметь UI interaction requirements для экрана `Пользователи` и формы назначения роли.
- `Система должна иметь input constraints, validations, errors и edge cases.`
- `Система должна иметь explicit Scope Constraints и Safety Constraints.`
- `Система должна иметь audit design readiness и documented prototype completeness status.`
- `Система должна иметь sibling test scenarios document со stable scenario IDs и coverage mapping.`
- `Система должна иметь ссылки на canonical system sources и versioned design sources.`
- `Система должна явно фиксировать transport/API boundary GET /backoffice/users и PATCH /backoffice/users/{userId}/role без обращения к production code.`
- `Система должна быть готова к архитектурной декомпозиции без обращения к production code после подготовки sibling test scenarios document и фиксации guard BootstrapAdministrator в system artifacts.`
