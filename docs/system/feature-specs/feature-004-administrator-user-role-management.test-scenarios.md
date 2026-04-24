# Feature Test Scenarios: FEATURE-004 Administrator User Role Management

## Карточка документа

- Feature: `FEATURE-004`
- Feature spec: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`
- Статус сценариев: `updated-after-analysis`
- Источники: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`
- Последняя проверка согласованности: `2026-04-24`

## Coverage Matrix

| Scenario ID   | Название                                                       | Тип             | Manual QA  | E2E QA     | Приоритет  | Источник                                                                                                                  |
| ------------- | -------------------------------------------------------------- | --------------- | ---------- | ---------- | ---------- | ------------------------------------------------------------------------------------------------------------------------- |
| `FTS-004-001` | Отображение списка пользователей и entrypoint назначения роли  | `main`          | `required` | `required` | `critical` | `feature spec`, `administrator-manage-users-and-roles.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`   |
| `FTS-004-002` | Успешное назначение роли `barista` новому пользователю         | `main`          | `required` | `required` | `critical` | `feature spec`, `user-role-and-blocking-management.md`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx` |
| `FTS-004-003` | Поиск и фильтрация списка перед выбором пользователя           | `alternative`   | `required` | `optional` | `high`     | `feature spec`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`                                              |
| `FTS-004-004` | Пустое состояние списка пользователей                          | `alternative`   | `required` | `optional` | `medium`   | `feature spec`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`                                              |
| `FTS-004-005` | Ошибка при недопустимой назначаемой роли                       | `negative`      | `required` | `required` | `critical` | `feature spec`, `user-role-and-blocking-management.md`                                                                    |
| `FTS-004-006` | Guard доступа к назначению роли без административных прав      | `guard`         | `required` | `required` | `critical` | `feature spec`, `user-role-and-blocking-management.md`, `backoffice-ui-binding.md`                                        |
| `FTS-004-007` | Успешное назначение роли `administrator` главным administrator | `main`          | `required` | `required` | `critical` | `feature spec`, `administrator-manage-users-and-roles.md`, `user-role-and-blocking-management.md`                         |
| `FTS-004-008` | Guard назначения роли `administrator` не главным administrator | `guard`         | `required` | `required` | `critical` | `feature spec`, `administrator-manage-users-and-roles.md`, `user-role-and-blocking-management.md`                         |
| `FTS-004-009` | UI boundary: сценарий не расширяется до `unblock_user`         | `visual-parity` | `required` | `n/a`      | `medium`   | `feature spec`, `backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`                  |

## Сценарии

### `FTS-004-001` — Отображение списка пользователей и entrypoint назначения роли

- Цель: подтвердить, что `administrator` видит экран `Пользователи`, список пользователей и рабочий entrypoint для назначения роли.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Main workflow`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- Предусловия: пользователь аутентифицирован в backoffice как `administrator`; capability `users` доступна.
- Тестовые данные: минимум один пользователь в списке.
- Шаги:
  1. Открыть backoffice под ролью `administrator`.
  2. Перейти во вкладку `Пользователи`.
  3. Проверить наличие списка пользователей и кнопки `Добавить пользователя`.
- Ожидаемый результат:
  1. `Система должна отобразить вкладку Пользователи только в административном контуре users screen.`
  2. `Система должна получить список пользователей через GET /backoffice/users и показать его как наблюдаемый набор для выбора цели назначения роли.`
  3. `Система должна предоставить entrypoint открытия формы назначения роли через кнопку Добавить пользователя.`
- Проверяемые инварианты:
  - Рабочий сценарий назначения роли доступен только при наличии capability `users`.
  - Отображение списка пользователей не изменяет набор ролей до подтверждения операции.
- E2E mapping:
  - Test file: `будет определен в e2e QA`
  - Test title / ID: `FTS-004-001 users screen and role assignment entrypoint`
  - Required assertions: `проверка наличия вкладки users для administrator, проверка успешного чтения GET /backoffice/users, проверка отображения списка пользователей, проверка доступности кнопки Добавить пользователя`

### `FTS-004-002` — Успешное назначение роли `barista` новому пользователю

- Цель: подтвердить основной happy path назначения допустимой роли `barista`.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Main workflow`, `feature spec / Назначение роли barista`, `docs/system/contracts/user-role-and-blocking-management.md`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`
- Предусловия: пользователь аутентифицирован как `administrator`; экран `Пользователи` открыт; целевой пользователь может быть однозначно идентифицирован.
- Тестовые данные: `name=Иван Петров`, `telegramUsername=@ivan_petrov`, `role=barista`
- Шаги:
  1. Нажать `Добавить пользователя`.
  2. Заполнить обязательные поля `Имя` и `Telegram Username`.
  3. Выбрать роль `Бариста`.
  4. Нажать `Добавить пользователя`.
- Ожидаемый результат:
  1. `Система должна принять заполненную форму с допустимой ролью barista.`
  2. `Система должна отправить PATCH /backoffice/users/{userId}/role с body role=barista и сохранить новое ролевое назначение без частичного результата.`
  3. `Система должна вернуть success response с фактически сохраненным набором roles и пересчитанным backofficeAccess.capabilities.`
  4. `Система должна пересчитать доступ пользователя так, чтобы после успешного назначения были доступны только вкладки Заказы и Доступность в рамках подтвержденной доменной модели.`
  5. `Система должна показать наблюдаемое уведомление об успешной административной операции.`
- Проверяемые инварианты:
  - Обязательные поля формы должны быть заполнены до подтверждения операции.
  - Изменение роли `customer` не входит в сценарий и не выполняется этой операцией.
- E2E mapping:
  - Test file: `будет определен в e2e QA`
  - Test title / ID: `FTS-004-002 assign barista role`
  - Required assertions: `проверка успешной отправки PATCH /backoffice/users/{userId}/role с role=barista, проверка success notification, проверка response roles и backofficeAccess.capabilities, проверка обновленного набора доступных вкладок для целевого пользователя`

### `FTS-004-003` — Поиск и фильтрация списка перед выбором пользователя

- Цель: подтвердить, что поиск и фильтры помогают выбрать целевого пользователя без побочного изменения ролей.
- Тип: `alternative`
- Покрытие: `Manual QA: required; E2E QA: optional`
- Источники: `feature spec / Alternative workflows`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- Предусловия: пользователь аутентифицирован как `administrator`; в списке есть несколько пользователей с разными ролями или статусами.
- Тестовые данные: поисковый запрос по имени или `Telegram username`; фильтр `Все` или `Баристы`.
- Шаги:
  1. Открыть экран `Пользователи`.
  2. Открыть поиск через `TopBar.search` и ввести поисковый запрос.
  3. Переключить фильтр списка.
  4. Проверить, что из отфильтрованного результата можно перейти к назначению роли.
- Ожидаемый результат:
  1. `Система должна сузить отображаемый набор пользователей в соответствии с поиском и выбранным фильтром.`
  2. `Система должна сохранить доступность entrypoint назначения роли в рамках отфильтрованного результата.`
  3. `Система должна не изменять роли пользователей до явного подтверждения отдельной операции назначения роли.`
- Проверяемые инварианты:
  - Поиск и фильтрация не выполняют административную операцию сами по себе.
  - Список остается в пределах экрана `Пользователи`.
- E2E mapping:
  - Test file: `будет определен в e2e QA`
  - Test title / ID: `FTS-004-003 users search and filter`
  - Required assertions: `проверка сужения списка после поиска и фильтра, проверка сохранения entrypoint назначения роли`

### `FTS-004-004` — Пустое состояние списка пользователей

- Цель: подтвердить, что отсутствие пользователей отображается как допустимое пустое состояние без скрытого назначения роли.
- Тип: `alternative`
- Покрытие: `Manual QA: required; E2E QA: optional`
- Источники: `feature spec / System-relevant UI states`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- Предусловия: в системе нет доступных пользовательских записей.
- Тестовые данные: пустой список пользователей.
- Шаги:
  1. Открыть экран `Пользователи` в окружении без пользовательских записей.
  2. Проверить отображаемое состояние экрана.
- Ожидаемый результат:
  1. `Система должна показать пустое состояние списка пользователей с сообщением о появлении пользователей после активации бота.`
  2. `Система должна не подменять пустое состояние скрытым частичным списком пользователей.`
  3. `Система должна сохранять сценарий назначения роли недоступным до появления идентифицируемого пользователя.`
- Проверяемые инварианты:
  - Пустое состояние является допустимым состоянием users screen.
  - Операция назначения роли требует наличия целевого пользователя.
- E2E mapping:
  - Test file: `будет определен в e2e QA`
  - Test title / ID: `FTS-004-004 empty users state`
  - Required assertions: `проверка empty state и отсутствия доступного назначения роли при пустом списке`

### `FTS-004-005` — Ошибка при недопустимой назначаемой роли

- Цель: подтвердить защиту от назначения роли вне допустимого множества `barista`, `administrator`.
- Тип: `negative`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Exception workflows`, `docs/system/contracts/user-role-and-blocking-management.md`
- Предусловия: пользователь аутентифицирован как `administrator`; экран назначения роли доступен; клиентский UI или запрос передает роль вне допустимого множества.
- Тестовые данные: `role=customer` или иное значение вне `barista`, `administrator`
- Шаги:
  1. Инициировать назначение роли с недопустимым значением.
  2. Подтвердить операцию назначения.
- Ожидаемый результат:
  1. `Система должна отклонить изменение роли через 422 Unprocessable Entity с ошибкой role-not-assignable.`
  2. `Система должна сохранить текущее состояние экрана и формы без ложного success state.`
  3. `Система должна не изменять набор ролей целевого пользователя.`
- Проверяемые инварианты:
  - Допустимые назначаемые роли ограничены `barista` и `administrator`.
  - Ошибка назначения роли не должна приводить к частичному сохранению.
- E2E mapping:
  - Test file: `будет определен в e2e QA`
  - Test title / ID: `FTS-004-005 invalid assignable role`
  - Required assertions: `проверка transport status 422, проверка business error role-not-assignable, проверка отсутствия success notification, проверка неизменности набора ролей пользователя`

### `FTS-004-006` — Guard доступа к назначению роли без административных прав

- Цель: подтвердить, что пользователь без административных прав не может выполнить сценарий назначения роли ни через UI, ни через прямой доступ.
- Тип: `guard`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Exception workflows`, `feature spec / System-relevant UI states`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Предусловия: пользователь аутентифицирован без роли `administrator`; capability `users` отсутствует либо серверная операция назначения роли отклоняет актор как неадминистратора.
- Тестовые данные: `barista` или иной пользователь без административных прав.
- Шаги:
  1. Открыть backoffice под недопустимой ролью.
  2. Проверить доступность вкладки `Пользователи`.
  3. Попытаться перейти к users route напрямую или инициировать вызов назначения роли.
- Ожидаемый результат:
  1. `Система должна скрыть административную вкладку Пользователи и связанные действия назначения роли.`
  2. `Система должна отклонить прямую попытку входа в защищенный контур или вызов операции назначения роли через 403 Forbidden.`
  3. `Система должна вернуть ошибку backoffice-capability-forbidden или administrator-role-required без изменения ролей целевого пользователя в зависимости от точки отклонения запроса.`
- Проверяемые инварианты:
  - Клиентское скрытие вкладки не заменяет серверный guard.
  - Назначение роли доступно только пользователю с административными правами.
- E2E mapping:
  - Test file: `будет определен в e2e QA`
  - Test title / ID: `FTS-004-006 role assignment access guard`
  - Required assertions: `проверка отсутствия вкладки users, проверка protected или forbidden state при прямом доступе, проверка transport status 403, проверка business error backoffice-capability-forbidden или administrator-role-required`

### `FTS-004-007` — Успешное назначение роли `administrator` главным administrator

- Цель: подтвердить happy path назначения роли `administrator` только главным administrator.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Alternative workflows`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/contracts/user-role-and-blocking-management.md`
- Предусловия: пользователь аутентифицирован как `BootstrapAdministrator`; capability `users` доступна; целевой пользователь существует и допускает назначение роли `administrator`.
- Тестовые данные: `role=administrator`
- Шаги:
  1. Открыть экран `Пользователи` под главным administrator.
  2. Открыть форму назначения роли.
  3. Выбрать роль `Администратор`.
  4. Подтвердить операцию.
- Ожидаемый результат:
  1. `Система должна принять роль administrator как допустимую для инициатора, совпадающего с ADMIN_TELEGRAM_ID.`
  2. `Система должна отправить PATCH /backoffice/users/{userId}/role с body role=administrator и сохранить ролевое назначение без частичного результата.`
  3. `Система должна вернуть success response с фактически сохраненным набором roles и пересчитанным backofficeAccess.capabilities целевого пользователя.`
  4. `Система должна показать наблюдаемое уведомление об успешной административной операции.`
- Проверяемые инварианты:
  - Назначение роли `administrator` доступно только `BootstrapAdministrator`.
  - Shape успешного ответа совпадает с contract `Assign user role`.
- E2E mapping:
  - Test file: `будет определен в e2e QA`
  - Test title / ID: `FTS-004-007 assign administrator role by bootstrap administrator`
  - Required assertions: `проверка успешной отправки PATCH /backoffice/users/{userId}/role с role=administrator, проверка success notification, проверка response roles и backofficeAccess.capabilities, проверка отсутствия business error administrator-role-assignment-forbidden`

### `FTS-004-008` — Guard назначения роли `administrator` не главным administrator

- Цель: подтвердить, что обычный `administrator` не может назначить роль `administrator`.
- Тип: `guard`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Exception workflows`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/contracts/user-role-and-blocking-management.md`
- Предусловия: пользователь аутентифицирован как `administrator`, но не совпадает с `BootstrapAdministrator`; форма назначения роли допускает выбор `administrator`.
- Тестовые данные: `role=administrator`
- Шаги:
  1. Открыть форму назначения роли под обычным administrator.
  2. Выбрать роль `Администратор`.
  3. Подтвердить операцию.
- Ожидаемый результат:
  1. `Система должна отклонить изменение роли без изменения ролей целевого пользователя.`
  2. `Система должна вернуть 403 Forbidden с ошибкой administrator-role-assignment-forbidden.`
  3. `Система должна сохранить текущее состояние экрана без ложного success state.`
- Проверяемые инварианты:
  - Наличие опции `administrator` в UI не отменяет серверный guard `BootstrapAdministrator`.
  - Ошибка назначения роли `administrator` не приводит к частичному сохранению.
- E2E mapping:
  - Test file: `будет определен в e2e QA`
  - Test title / ID: `FTS-004-008 forbid administrator role assignment for non-bootstrap administrator`
  - Required assertions: `проверка transport status 403, проверка business error administrator-role-assignment-forbidden, проверка отсутствия success notification, проверка неизменности набора ролей пользователя`

### `FTS-004-009` — UI boundary: сценарий не расширяется до `unblock_user`

- Цель: зафиксировать границу фичи и исключить смешение назначения роли с блокировкой или разблокировкой пользователя.
- Тип: `visual-parity`
- Покрытие: `Manual QA: required; E2E QA: n/a`
- Источники: `feature spec / Scope Constraints`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- Предусловия: доступен UI reference users screen и канонические системные артефакты по `FEATURE-004`.
- Тестовые данные: `UsersScreen.tsx`
- Шаги:
  1. Сверить системные границы `FEATURE-004` с users UI reference.
  2. Проверить, что в QA-маршруте этой фичи нет шага по `block_user` или `unblock_user`.
- Ожидаемый результат:
  1. `Система должна сохранять в coverage только просмотр пользователей, назначение роли и связанные guards этой фичи.`
  2. `Система должна исключать действия block_user и unblock_user из канонического маршрута проверки FEATURE-004.`
  3. `Система должна передавать смежные user-management actions как отдельные границы фич, а не как часть назначения роли.`
- Проверяемые инварианты:
  - `FEATURE-004` не охватывает блокировку и разблокировку пользователя.
  - QA-маршрут не расширяет scope фичи из-за соседних UI entrypoints.
- E2E mapping:
  - Test file: `n/a`
  - Test title / ID: `n/a`
  - Required assertions: `n/a`

## Правила покрытия

- Каждый сценарий получает стабильный `Scenario ID`.
- Manual QA и e2e QA ссылаются на `Scenario ID` в результатах проверки.
- E2E-тесты используют `Scenario ID` в названии теста, annotation, tag или coverage-комментарии.
- Coverage mapping фиксирует тестовый файл, название теста и обязательные assertions для каждого e2e-covered сценария.
- Сценарий с `E2E QA: required` считается покрытым после появления browser e2e-теста с assertions из этого документа.
- Сценарий с `Manual QA: required` считается покрытым после ручного прохода по шагам и фиксации результата в QA evidence.

## Scope Constraints

- Один документ покрывает одну `FEATURE-*`.
- Сценарии описывают проверяемое поведение просмотра пользователей и назначения ролей `barista` или `administrator` в пределах подтвержденной аналитической границы.
- Manual evidence хранится в QA-задаче или QA evidence, а этот документ хранит канонический маршрут проверки.

## Safety Constraints

- Ожидаемые результаты сценариев сохраняют смысл feature spec, contract и use case этой фичи.
- Ослабление e2e assertions требует предварительного обновления сценария через системную аналитику.
- Blocker по праву назначения `administrator` сохраняется явным до отдельного согласованного источника.
