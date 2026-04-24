# Feature Test Scenarios: FEATURE-003 Administrator Slot Settings Management

## Карточка документа

- Feature: `FEATURE-003`
- Feature spec: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`
- Статус сценариев: `ready-for-architecture`
- Источники: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`
- Последняя проверка согласованности: `2026-04-23`

## Coverage Matrix

| Scenario ID   | Название                                                      | Тип             | Manual QA  | E2E QA     | Приоритет  | Источник                                                                        |
| ------------- | ------------------------------------------------------------- | --------------- | ---------- | ---------- | ---------- | ------------------------------------------------------------------------------- |
| `FTS-003-001` | Успешное сохранение рабочих часов и вместимости               | `main`          | `required` | `required` | `critical` | `feature spec`, `slot-settings-management.md`                                   |
| `FTS-003-002` | Сохранение только одного измененного параметра                | `alternative`   | `required` | `optional` | `high`     | `feature spec`, `administrator-manage-slot-settings.md`                         |
| `FTS-003-003` | Ошибка при некорректном диапазоне рабочих часов               | `negative`      | `required` | `required` | `critical` | `feature spec`, `slot-settings-management.md`, `backoffice-ui-binding.md`       |
| `FTS-003-004` | Ошибка при недопустимой вместимости слота                     | `negative`      | `required` | `required` | `critical` | `feature spec`, `slot-settings-management.md`                                   |
| `FTS-003-005` | Guard доступа к управлению настройками                        | `guard`         | `required` | `required` | `high`     | `feature spec`, `backoffice-ui-binding.md`                                      |
| `FTS-003-006` | Применение сохраненных настроек к дальнейшей генерации слотов | `main`          | `required` | `required` | `critical` | `feature spec`, `ordering-and-pickup.md`, `slot-settings-management.md`         |
| `FTS-003-007` | Проверка UI inconsistency по верхней границе вместимости      | `visual-parity` | `required` | `n/a`      | `medium`   | `feature spec`, `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx` |

## Сценарии

### `FTS-003-001` — Успешное сохранение рабочих часов и вместимости

- Цель: подтвердить, что administrator может сохранить оба параметра и увидеть подтверждение успешной операции.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Main workflow`, `docs/system/contracts/slot-settings-management.md`, `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`
- Предусловия: пользователь аутентифицирован в backoffice как `administrator`; экран `Настройки` доступен.
- Тестовые данные: `workingHoursOpen=08:00`, `workingHoursClose=18:00`, `slotCapacity=6`
- Шаги:
  1. Открыть вкладку `Настройки`.
  2. Изменить время открытия, время закрытия и вместимость слота.
  3. Нажать `Сохранить`.
- Ожидаемый результат:
  1. `Система должна принять допустимые значения рабочих часов и вместимости.`
  2. `Система должна сохранить новые параметры.`
  3. `Система должна показать уведомление об успешном сохранении только после успешного завершения операции.`
- Проверяемые инварианты:
  - Длина слота остается равной `10` минутам.
  - Операция доступна только роли `administrator`.
- E2E mapping:
  - Test file: `будет определен в e2e QA`
  - Test title / ID: `FTS-003-001 administrator saves slot settings`
  - Required assertions: `проверка обновления значений формы после сохранения, проверка success notification, проверка успешного ответа операции`

### `FTS-003-002` — Сохранение только одного измененного параметра

- Цель: подтвердить, что система сохраняет измененный параметр без потери второго действующего параметра.
- Тип: `alternative`
- Покрытие: `Manual QA: required; E2E QA: optional`
- Источники: `feature spec / Alternative workflows`, `docs/system/use-cases/administrator-manage-slot-settings.md`
- Предусловия: пользователь аутентифицирован как `administrator`; в системе уже есть действующие настройки.
- Тестовые данные: изменить только `slotCapacity` при неизменных рабочих часах.
- Шаги:
  1. Открыть вкладку `Настройки`.
  2. Изменить только одно поле.
  3. Нажать `Сохранить`.
- Ожидаемый результат:
  1. `Система должна сохранить измененный параметр.`
  2. `Система должна сохранить второе значение без непреднамеренного сброса к дефолту или пустому состоянию.`
- Проверяемые инварианты:
  - Итоговый набор параметров остается единым действующим состоянием генерации слотов.
- E2E mapping:
  - Test file: `будет определен в e2e QA`
  - Test title / ID: `FTS-003-002 partial settings update`
  - Required assertions: `проверка сохранения одного поля без изменения второго`

### `FTS-003-003` — Ошибка при некорректном диапазоне рабочих часов

- Цель: подтвердить защиту от сохранения некорректного операционного окна.
- Тип: `negative`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Exception workflows`, `docs/system/contracts/slot-settings-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Предусловия: пользователь аутентифицирован как `administrator`; экран `Настройки` открыт.
- Тестовые данные: `workingHoursOpen=18:00`, `workingHoursClose=18:00` или `workingHoursClose=17:50`
- Шаги:
  1. Установить время открытия и закрытия в недопустимую комбинацию.
  2. Нажать `Сохранить`.
- Ожидаемый результат:
  1. `Система должна отклонить сохранение с ошибкой invalid-working-hours.`
  2. `Система должна сохранить форму в редактируемом состоянии.`
  3. `Система должна показать user-visible validation state для ошибки рабочих часов.`
- Проверяемые инварианты:
  - Последнее успешно сохраненное состояние настроек не изменяется.
- E2E mapping:
  - Test file: `будет определен в e2e QA`
  - Test title / ID: `FTS-003-003 invalid working hours`
  - Required assertions: `проверка отсутствия success notification, проверка user-visible validation state, проверка отклонения операции сохранения`

### `FTS-003-004` — Ошибка при недопустимой вместимости слота

- Цель: подтвердить защиту от сохранения вместимости, которую операция не принимает.
- Тип: `negative`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Exception workflows`, `docs/system/contracts/slot-settings-management.md`
- Предусловия: пользователь аутентифицирован как `administrator`; экран `Настройки` открыт.
- Тестовые данные: значение вместимости, нарушающее контрактную проверку.
- Шаги:
  1. Ввести недопустимую вместимость слота.
  2. Нажать `Сохранить`.
- Ожидаемый результат:
  1. `Система должна отклонить сохранение с ошибкой invalid-slot-capacity.`
  2. `Система должна показать ошибку поля вместимости.`
  3. `Система должна сохранять для генерации слотов последнее успешно подтвержденное значение вместимости.`
- Проверяемые инварианты:
  - Действующее значение вместимости остается последним успешно сохраненным.
- E2E mapping:
  - Test file: `будет определен в e2e QA`
  - Test title / ID: `FTS-003-004 invalid slot capacity`
  - Required assertions: `проверка отклонения операции, проверка inline field error, проверка отсутствия применения недопустимого значения`

### `FTS-003-005` — Guard доступа к управлению настройками

- Цель: подтвердить, что операция не доступна пользователю без роли `administrator`.
- Тип: `guard`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Guarded state`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Предусловия: пользователь аутентифицирован как роль без capability административных настроек.
- Тестовые данные: `barista` или иной пользователь без capability `settings`.
- Шаги:
  1. Открыть backoffice под недопустимой ролью.
  2. Попытаться перейти к экрану `Настройки` через навигацию или прямой route.
- Ожидаемый результат:
  1. `Система должна скрыть вкладку Настройки в доступной навигации.`
  2. `Система должна показать защищенное состояние доступа при прямой попытке входа в запрещенный экран.`
- Проверяемые инварианты:
  - Рабочая операция сохранения настроек недоступна без роли `administrator`.
- E2E mapping:
  - Test file: `будет определен в e2e QA`
  - Test title / ID: `FTS-003-005 settings access guard`
  - Required assertions: `проверка отсутствия вкладки, проверка protected state или forbidden state при прямом доступе`

### `FTS-003-006` — Применение сохраненных настроек к дальнейшей генерации слотов

- Цель: подтвердить основной бизнес-результат фичи: новые значения влияют на последующее формирование доступных слотов текущего дня.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Business outcome`, `docs/system/contracts/slot-settings-management.md`, `docs/system/domain-model/ordering-and-pickup.md`
- Предусловия: настройки успешно сохранены; существует операция чтения доступных customer-слотов текущего дня.
- Тестовые данные: сохранить новый интервал рабочих часов и новую вместимость, затем запросить доступные слоты.
- Шаги:
  1. Сохранить новые настройки рабочих часов и вместимости.
  2. Инициировать последующее получение доступных слотов текущего дня.
- Ожидаемый результат:
  1. `Система должна формировать только слоты внутри нового операционного окна.`
  2. `Система должна использовать новую вместимость как лимит активных заказов для каждого слота.`
  3. `Система должна возвращать только слоты текущего дня.`
- Проверяемые инварианты:
  - Длина каждого слота остается `10` минут.
  - В расчете занятой вместимости учитываются только активные статусы заказа.
- E2E mapping:
  - Test file: `будет определен в e2e QA`
  - Test title / ID: `FTS-003-006 settings affect slot generation`
  - Required assertions: `проверка состава сгенерированных интервалов, проверка применения нового capacity limit, проверка ограничения текущим днем`

### `FTS-003-007` — Проверка UI inconsistency по верхней границе вместимости

- Цель: зафиксировать, что reference UI содержит верхнюю границу `50`, которая не подтверждена каноническими business/system artifacts.
- Тип: `visual-parity`
- Покрытие: `Manual QA: required; E2E QA: n/a`
- Источники: `feature spec / Prototype Completeness Audit`, `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`
- Предусловия: доступ к versioned UI reference и feature spec.
- Тестовые данные: `SettingsScreen.tsx`
- Шаги:
  1. Сверить поле `slotCapacity` в UI reference.
  2. Сверить системные и бизнес-источники фичи.
- Ожидаемый результат:
  1. `Система должна иметь зафиксированную inconsistency между UI reference и каноническими источниками по верхней границе вместимости.`
  2. `Система должна передавать эту inconsistency архитектору как отдельный вопрос нормализации.`
- Проверяемые инварианты:
  - Канонический диапазон определяется отдельным решением, а не только UI reference.
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
- Сценарий с `Manual QA: required` считается покрытым после ручного прохода по шагам и фиксации результата в QA-задаче.

## Scope Constraints

- Один документ покрывает одну `FEATURE-*`.
- Сценарии описывают проверяемое поведение управления рабочими часами и вместимостью слотов.
- Результат manual QA хранится в QA-задаче, а этот документ хранит канонический маршрут проверки.

## Safety Constraints

- Ожидаемые результаты сценариев сохраняют смысл feature spec, contract и use case этой фичи.
- Ослабление e2e assertions требует предварительного обновления сценария через системную аналитику.
- Закрытие e2e QA требует соответствия automated coverage mapping сценариям с `E2E QA: required`.
