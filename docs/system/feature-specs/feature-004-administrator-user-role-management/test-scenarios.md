# Test Scenarios: FEATURE-004 Administrator User Role Management

## Карточка документа

- Feature: `FEATURE-004`
- Package root: `docs/system/feature-specs/feature-004-administrator-user-role-management/`
- Index: `./index.md`
- Behavior: `./behavior.md`
- Interfaces: `./interfaces.md`
- UI behavior: `./ui-behavior.md`
- Статус сценариев: `draft`
- Источники: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx`, `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`
- Последняя проверка согласованности: `2026-05-01`

## Coverage Matrix

| Scenario ID   | Название                                                                  | Тип             | Manual QA  | E2E QA     | Приоритет  | Источник                                                                       |
| ------------- | ------------------------------------------------------------------------- | --------------- | ---------- | ---------- | ---------- | ------------------------------------------------------------------------------ |
| `F004-SC-001` | Administrator видит список пользователей                                  | `main`          | `required` | `required` | `critical` | `behavior.md`, `interfaces.md`, `ui-behavior.md`                               |
| `F004-SC-002` | Поиск и фильтры списка пользователей                                      | `alternative`   | `required` | `optional` | `medium`   | `ui-behavior.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx` |
| `F004-SC-003` | Administrator назначает роль `barista`                                    | `main`          | `required` | `required` | `critical` | `behavior.md`, `interfaces.md`                                                 |
| `F004-SC-004` | Доступ целевого пользователя пересчитан после назначения `barista`        | `main`          | `required` | `required` | `critical` | `identity-and-access.md`, `behavior.md`, `interfaces.md`                       |
| `F004-SC-005` | Пользователь без `administrator` не управляет пользователями              | `guard`         | `required` | `required` | `critical` | `identity-and-access.md`, `interfaces.md`                                      |
| `F004-SC-006` | Недопустимая назначаемая роль отклоняется                                 | `negative`      | `required` | `required` | `high`     | `user-role-and-blocking-management.md`, `interfaces.md`                        |
| `F004-SC-007` | Назначение роли `administrator` остается blocked до решения guard-правила | `blocked`       | `required` | `n/a`      | `critical` | `FEATURE-004` blocker, `behavior.md`                                           |
| `F004-SC-008` | UI parity вкладки `Пользователи` и диалога назначения роли                | `visual-parity` | `required` | `optional` | `high`     | `ui-behavior.md`, `.references/Expressa_admin`                                 |

## Сценарии

### `F004-SC-001` — Administrator видит список пользователей

- Цель: подтвердить, что administrator получает users-flow для выбора целевого пользователя.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `behavior.md`, `interfaces.md`, `ui-behavior.md`
- Предусловия: пользователь вошел во внутренний административный контур как `administrator`.
- Тестовые данные: минимум один пользователь в списке.
- Шаги:
  1. Открыть backoffice.
  2. Перейти на вкладку `Пользователи`.
  3. Дождаться отображения списка.
- Ожидаемый результат:
  1. Система должна показать вкладку `Пользователи` только пользователю с ролью `administrator`.
  2. Система должна показать список пользователей с ролью и статусом.
  3. Система должна сохранить доступ к другим administrator-вкладкам.
- Проверяемые инварианты:
  - Серверный source of truth определяет роли и доступ к вкладкам.
- E2E mapping:
  - Test file: `e2e/...` будет определен в e2e QA.
  - Test title / ID: `F004-SC-001 administrator sees users list`.
  - Required assertions: вкладка `Пользователи` видима administrator; список или empty state отображен; запрос списка проходит через authenticated context.

### `F004-SC-002` — Поиск и фильтры списка пользователей

- Цель: подтвердить экранную фильтрацию списка без изменения данных.
- Тип: `alternative`
- Покрытие: `Manual QA: required; E2E QA: optional`
- Источники: `ui-behavior.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- Предусловия: administrator находится на вкладке `Пользователи`, в списке есть пользователи с разными ролями или статусами.
- Тестовые данные: пользователь с ролью `barista`, пользователь со статусом `blocked`.
- Шаги:
  1. Ввести часть имени или Telegram-идентификатора в поиск.
  2. Выбрать фильтр `Баристы`.
  3. Выбрать фильтр `Заблокированные`.
  4. Вернуться к фильтру `Все`.
- Ожидаемый результат:
  1. Система должна фильтровать отображаемый список по введенному query.
  2. Система должна показывать пользователей `barista` при фильтре `Баристы`.
  3. Система должна показывать пользователей с `blocked=true` при фильтре `Заблокированные`.
  4. Система должна сохранять роли пользователей без изменений.
- Проверяемые инварианты:
  - Фильтры списка не являются операциями изменения ролей.
- E2E mapping:
  - Test file: `e2e/...` будет определен в e2e QA при выборе optional coverage.
  - Test title / ID: `F004-SC-002 users search and filters`.
  - Required assertions: фильтры меняют только отображаемые строки; данные пользователя не изменяются.

### `F004-SC-003` — Administrator назначает роль `barista`

- Цель: подтвердить основную операцию назначения роли `barista`.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `behavior.md`, `interfaces.md`, `ui-behavior.md`
- Предусловия: administrator находится на вкладке `Пользователи`; целевой пользователь существует.
- Тестовые данные: целевой пользователь без операционной роли `barista`.
- Шаги:
  1. Открыть меню действий целевого пользователя.
  2. Выбрать `Назначить роль`.
  3. Выбрать роль `Бариста`.
  4. Подтвердить назначение.
- Ожидаемый результат:
  1. Система должна сохранить роль `barista` для целевого пользователя.
  2. Система должна показать успешное подтверждение операции.
  3. Система должна обновить строку пользователя в списке.
- Проверяемые инварианты:
  - Роль `customer`, если она есть, сохраняется.
  - Назначение роли проходит через administrator guard.
- E2E mapping:
  - Test file: `e2e/...` будет определен в e2e QA.
  - Test title / ID: `F004-SC-003 administrator assigns barista`.
  - Required assertions: операция отправляет `assignedRole=barista`; в списке отображается `Бариста`; серверный ответ фиксирует обновленную роль.

### `F004-SC-004` — Доступ целевого пользователя пересчитан после назначения `barista`

- Цель: подтвердить связь role assignment с доступом к вкладкам.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `identity-and-access.md`, `behavior.md`, `interfaces.md`
- Предусловия: роль `barista` успешно назначена целевому пользователю.
- Тестовые данные: test-mode Telegram id целевого пользователя.
- Шаги:
  1. Войти во внутренний административный контур как целевой пользователь.
  2. Проверить состав доступных вкладок.
  3. Попробовать прямой переход на administrator-only вкладку.
- Ожидаемый результат:
  1. Система должна показать вкладки `Заказы` и `Доступность`.
  2. Система должна скрыть вкладки `Меню`, `Пользователи`, `Настройки`.
  3. Система должна отказать в прямом доступе к administrator-only вкладке.
- Проверяемые инварианты:
  - Пересчет доступа выполняется на основании серверного role/capability source of truth.
- E2E mapping:
  - Test file: `e2e/...` будет определен в e2e QA.
  - Test title / ID: `F004-SC-004 assigned barista capabilities`.
  - Required assertions: visible tabs match `barista`; direct route to `/users` or `/settings` returns forbidden state.

### `F004-SC-005` — Пользователь без `administrator` не управляет пользователями

- Цель: подтвердить guard вкладки и операции.
- Тип: `guard`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `identity-and-access.md`, `interfaces.md`, `ui-behavior.md`
- Предусловия: пользователь вошел как `barista`.
- Тестовые данные: test-mode Telegram id пользователя с ролью `barista`.
- Шаги:
  1. Открыть внутренний административный контур.
  2. Проверить навигацию.
  3. Выполнить прямой переход к вкладке `Пользователи`.
  4. Попытаться выполнить operation boundary назначения роли через прямой API route, если он доступен в реализации.
- Ожидаемый результат:
  1. Система должна скрыть вкладку `Пользователи`.
  2. Система должна показать отказ доступа при прямом переходе.
  3. Система должна отклонить operation boundary назначения роли.
- Проверяемые инварианты:
  - UI hiding не заменяет server-side guard.
- E2E mapping:
  - Test file: `e2e/...` будет определен в e2e QA.
  - Test title / ID: `F004-SC-005 non administrator denied users management`.
  - Required assertions: no `Пользователи` tab for barista; direct route forbidden; role assignment operation returns `administrator-role-required`.

### `F004-SC-006` — Недопустимая назначаемая роль отклоняется

- Цель: подтвердить validation `role-not-assignable`.
- Тип: `negative`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `user-role-and-blocking-management.md`, `interfaces.md`
- Предусловия: administrator authenticated context доступен.
- Тестовые данные: существующий целевой пользователь, назначаемая роль вне набора `barista` / `administrator`.
- Шаги:
  1. Отправить operation boundary назначения роли с недопустимым значением роли.
  2. Обновить список пользователей.
- Ожидаемый результат:
  1. Система должна отклонить назначение роли.
  2. Система должна вернуть ошибку `role-not-assignable`.
  3. Система должна сохранить роли целевого пользователя без изменений.
- Проверяемые инварианты:
  - Только `barista` и `administrator` являются назначаемыми ролями в FEATURE-004.
- E2E mapping:
  - Test file: `e2e/...` будет определен в e2e QA.
  - Test title / ID: `F004-SC-006 invalid role rejected`.
  - Required assertions: invalid role rejected; target user's roles unchanged after refresh.

### `F004-SC-007` — Назначение роли `administrator` остается blocked до решения guard-правила

- Цель: подтвердить, что QA не принимает финальное поведение назначения `administrator` до снятия blocker.
- Тип: `blocked`
- Покрытие: `Manual QA: required; E2E QA: n/a`
- Источники: `FEATURE-004` blocker, `behavior.md`, `interfaces.md`, `ui-behavior.md`
- Предусловия: package остается в status `draft`.
- Тестовые данные: пользователь, которому нужно назначить `administrator`.
- Шаги:
  1. Проверить package `index.md`, `behavior.md`, `interfaces.md` и `ui-behavior.md`.
  2. Проверить наличие blocker по guard-правилу назначения `administrator`.
- Ожидаемый результат:
  1. Система должна удерживать сценарий назначения `administrator` вне final acceptance до решения, кто имеет право выполнять эту операцию.
  2. Система должна иметь scenario placeholder для последующей QA-детализации после снятия blocker.
- Проверяемые инварианты:
  - Открытый blocker не закрывается тестовой догадкой.
- E2E mapping:
  - Test file: `n/a` до снятия blocker.
  - Test title / ID: `n/a` до снятия blocker.
  - Required assertions: будут определены после финализации guard-правила.

### `F004-SC-008` — UI parity вкладки `Пользователи` и диалога назначения роли

- Цель: подтвердить соответствие live UI versioned `.references` в границах FEATURE-004.
- Тип: `visual-parity`
- Покрытие: `Manual QA: required; E2E QA: optional`
- Источники: `ui-behavior.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx`, `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`
- Предусловия: feature реализована в клиентском контуре.
- Тестовые данные: пользовательский список с активным пользователем.
- Шаги:
  1. Открыть вкладку `Пользователи`.
  2. Сравнить структуру списка, поиск, фильтры и меню действий с `.references`.
  3. Открыть `Назначить роль`.
  4. Сравнить диалог выбора роли с `.references`.
- Ожидаемый результат:
  1. Система должна сохранить системно значимую структуру users-flow из `.references`.
  2. Система должна показывать действие `Назначить роль`.
  3. Система должна показывать выбор `Бариста` и `Администратор`.
  4. Система должна сохранять out-of-scope actions вне acceptance FEATURE-004.
- Проверяемые инварианты:
  - UI parity не расширяет scope на блокировку, разблокировку, снятие роли или создание пользователя.
- E2E mapping:
  - Test file: `e2e/...` будет определен в e2e QA при выборе optional coverage.
  - Test title / ID: `F004-SC-008 users role dialog parity`.
  - Required assertions: users tab renders, role dialog opens, barista and administrator role options are visible.

## Правила покрытия

- Каждый сценарий получает стабильный `Scenario ID`.
- Manual QA и E2E QA ссылаются на `Scenario ID` в результатах проверки.
- E2E-тесты используют `Scenario ID` в названии теста, annotation, tag или coverage-комментарии.
- Coverage mapping фиксирует тестовый файл, название теста и обязательные assertions для каждого e2e-covered сценария.
- Сценарий с `E2E QA: required` считается покрытым после появления browser e2e-теста с assertions из этого документа.
- Сценарий с `Manual QA: required` считается покрытым после ручного прохода по шагам и фиксации результата в `QA-*` карточке.
- Сценарий `F004-SC-007` должен быть пересмотрен после снятия blocker по назначению роли `administrator`.

## QA feedback loop

- Reproducible defects found during manual QA or e2e QA are filed as `BUG-*` tasks under `FEATURE-004`.
- `BUG-*` task must reference affected `Scenario ID`, cause contour when known, reproduction steps, expected result and actual result.
- QA rechecks affected scenarios after blocking `BUG-*` tasks are closed.
- `FEATURE-004` can be completed only after required manual QA, required e2e QA and blocking defect rechecks are complete.

## Scope Constraints

- Один документ покрывает только `FEATURE-004`.
- Сценарии описывают проверяемое поведение из package slices.
- Результат manual QA хранится в будущей `QA-*` карточке.
- Результат e2e QA хранится в будущей `QA-*` карточке.

## Safety Constraints

- Ожидаемые результаты сценариев сохраняют смысл feature package, contracts и use cases.
- Ослабление e2e assertions требует предварительного обновления сценария через системную аналитику.
- Закрытие e2e QA требует соответствия automated coverage mapping сценариям с `E2E QA: required`.
- Открытый blocker по назначению `administrator` сохраняет сценарий `F004-SC-007` вне автоматизированной acceptance.
