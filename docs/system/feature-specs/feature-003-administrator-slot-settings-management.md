# Feature Spec: FEATURE-003 Administrator Slot Settings Management

## Карточка документа

- Feature: `FEATURE-003`
- Parent sprint: `SPRINT-001`
- Feature spec: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`
- Test scenarios: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`
- Status: `ready-for-architecture`
- Related roles: `Системный аналитик`, `Архитектор`, `Frontend`, `Backend`, `QA`
- Affected interfaces: `backoffice/settings`, `slot settings management contract`, `available slots generation`
- Last consistency check: `2026-04-23`

## Source Trace

### Business input

- `docs/business/business-rules/pickup-slots-and-capacity.md`
- `docs/business/business-rules/backoffice-operations.md`
- `docs/business/scenarios/administrator-manage-slot-settings.md`
- `tasks/FEATURE-003-administrator-slot-settings-management.md`

### System sources

- `use-cases`: `docs/system/use-cases/administrator-manage-slot-settings.md`
- `contracts`: `docs/system/contracts/slot-settings-management.md`
- `domain-model`: `docs/system/domain-model/ordering-and-pickup.md`
- `state-models`: `n/a`
- `ui-behavior-mapping`: `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`

### UI sources

- `ui-contract`: `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `versioned design sources`: `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`
- `prototype verification status`: `verified-with-documented-gaps`

## Feature Boundary

### Included scope

- Просмотр administrator текущих рабочих часов и текущей вместимости слотов во вкладке `Настройки`.
- Изменение рабочих часов операционного окна текущего дня.
- Изменение вместимости одного 10-минутного слота.
- Сохранение новых значений для последующего формирования доступных customer-слотов текущего дня.
- Ошибки доступа и ошибки валидации для операции управления настройками.

### Explicitly excluded scope

- Создание customer-заказа.
- Расширение горизонта выбора слотов за пределы текущего дня.
- Изменение длины слота, которая остается равной 10 минутам.
- Управление праздничным расписанием, исключениями по датам и несколькими окнами работы в один день.
- История изменений настроек и аудит администратора по этой операции.

### Business outcome

- `Система должна сохранять рабочие часы и вместимость слотов, выбранные administrator, и применять сохраненные значения к дальнейшему формированию доступных слотов текущего дня.`

### Dependencies

- `FEATURE-001`
- `docs/system/domain-model/ordering-and-pickup.md`
- `docs/system/contracts/slot-settings-management.md`
- `docs/system/use-cases/administrator-manage-slot-settings.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`

## User Workflows

### Main workflow

1. Administrator открывает вкладку `Настройки`.
2. `Система должна отобразить текущие рабочие часы и текущую вместимость слотов.`
3. Administrator изменяет время открытия, время закрытия и/или вместимость слота.
4. `Система должна проверить корректность введенных значений перед сохранением.`
5. `Система должна сохранить новые значения рабочих часов и вместимости.`
6. `Система должна подтвердить успешное сохранение в интерфейсе настроек.`
7. `Система должна использовать сохраненные значения при следующем формировании доступных слотов текущего дня.`

### Alternative workflows

#### Сохранение только части настроек

1. Administrator изменяет только рабочие часы или только вместимость слота.
2. `Система должна сохранить измененный параметр вместе с неизмененным актуальным значением второго параметра.`
3. `Система должна применять итоговую комбинацию значений к дальнейшему формированию доступных слотов текущего дня.`

#### Использование дефолтных значений до первого изменения

1. Administrator открывает вкладку `Настройки` до первого сохранения пользовательских значений.
2. Система должна предоставить значения по умолчанию `09:00–20:00` для рабочих часов и `5` для вместимости слота.
3. `Система должна использовать эти значения как исходное состояние формы и как действующие параметры генерации слотов.`

### Exception workflows

#### Некорректный диапазон рабочих часов

1. Administrator задает время закрытия, которое не позже времени открытия.
2. Система должна отклонить сохранение с ошибкой `invalid-working-hours`.
3. `Система должна сохранить форму в редактируемом состоянии и показать ошибку валидации в интерфейсе настроек.`

#### Некорректная вместимость слота

1. Administrator задает значение вместимости, которое нарушает канонические ограничения операции.
2. Система должна отклонить сохранение с ошибкой `invalid-slot-capacity`.
3. `Система должна сохранить форму в редактируемом состоянии и показать ошибку валидации для поля вместимости.`

#### Недопустимая роль

1. Пользователь без роли `administrator` обращается к операции управления настройками слотов.
2. Система должна отклонить доступ с ошибкой `administrator-role-required`.
3. Система должна показывать только защищенное состояние доступа backoffice для недопустимой роли.

### System-relevant UI states

- Empty state: `Система должна заполнять форму текущими или дефолтными значениями вместо пустого состояния полей.`
- Loading state: `Система должна удерживать рабочий экран настроек в состоянии загрузки до получения актуальных значений параметров.`
- Success state: `Система должна подтверждать успешное сохранение пользовательским уведомлением на экране настроек.`
- Error state: `Система должна оставлять administrator в контексте экрана настроек при ошибке сохранения и показывать понятный результат ошибки.`
- Disabled state: `Система должна блокировать подтверждение сохранения, пока обязательные значения отсутствуют или нарушают проверяемые ограничения формы.`
- Hidden state: Система должна скрывать вкладку `Настройки` для ролей без capability административного управления настройками.
- Guarded state: `Система должна переводить пользователя без допустимой capability на защищенное состояние доступа backoffice вместо рабочего экрана настроек.`
- Confirmation state: `Система должна выполнять сохранение без отдельного шага подтверждения, если UI-канон не вводит confirm-dialog для этой операции.`
- Notification state: `Система должна использовать toast или эквивалентное уведомление об успешном сохранении.`
- Inline error state: `Система должна показывать ошибку валидации возле поля или формы, значения которой нарушают правила сохранения.`

## Entity View

### Entities

- `WorkingHours`
- `PickupSlot`
- `Order`

### Relations

- `WorkingHours` определяет границы формирования `PickupSlot`.
- `PickupSlot.capacityLimit` использует сохраненную administrator вместимость слота.
- `Order` занимает вместимость выбранного `PickupSlot` только в статусах `Создан`, `Подтвержден`, `Готов к выдаче`.

### Invariants

- `Система должна формировать слоты как интервалы по 10 минут внутри действующих рабочих часов.`
- `Система должна формировать для customer только слоты текущего дня.`
- Система должна учитывать в занятой вместимости только заказы в статусах `Создан`, `Подтвержден` и `Готов к выдаче`.
- Система должна исключать из занятой вместимости заказы в статусах `Отклонен` и `Закрыт`.

### Identity and ownership

- Источник истины для `WorkingHours` и `PickupSlot.capacityLimit` задается операцией `Manage working hours and slot capacity`.
- Владелец изменения значений в рамках этой фичи: `administrator`.
- Источник истины для занятой вместимости слота: активные `Order`, привязанные к конкретному временному интервалу.

## UI Element Action Sequence

### Screen or surface

- `SettingsScreen`

### Element-to-action mapping

| UI element                   | User action   | System reaction                                                                                               | Related source                                                                                                                 |
| ---------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `settings.workingHoursOpen`  | `edit time`   | `Система должна обновить редактируемое значение времени открытия в форме.`                                    | `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`, `docs/system/contracts/slot-settings-management.md`           |
| `settings.workingHoursClose` | `edit time`   | `Система должна обновить редактируемое значение времени закрытия в форме.`                                    | `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`, `docs/system/contracts/slot-settings-management.md`           |
| `settings.slotCapacity`      | `edit number` | `Система должна обновить редактируемое значение вместимости и подготовить его к валидации перед сохранением.` | `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`, `docs/system/contracts/slot-settings-management.md`           |
| `settings.saveButton`        | `click save`  | `Система должна выполнить валидацию, сохранить допустимые значения и показать результат сохранения.`          | `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`, `docs/system/use-cases/administrator-manage-slot-settings.md` |

### Interaction notes

- Система должна отображать экран настроек только для роли `administrator` в соответствии с backoffice capability guard.
- `Система должна сохранять визуальную структуру экрана из `.references/Expressa_admin` без добавления новых экранов или flow вне канонического UI reference.`
- `Система должна связывать пользовательское уведомление об успехе с фактом успешного сохранения, а не только с нажатием кнопки.`

## Input Constraints

### Required inputs

- `workingHoursOpen`
- `workingHoursClose`
- `slotCapacity`

### Allowed values

- `workingHoursOpen` и `workingHoursClose` передаются как значения времени в пределах одного операционного дня.
- `slotCapacity` передается как целочисленное значение вместимости слота.
- Канонический верхний предел `slotCapacity` остается открытым вопросом и не считается подтвержденным значением `50` только на основании UI reference.

### Cross-field constraints

- `Система должна принимать рабочие часы только в конфигурации, где время закрытия позже времени открытия.`
- `Система должна применять одно итоговое сочетание рабочих часов и вместимости как единственный действующий набор параметров генерации слотов.`

### Boundary values

- Дефолтные рабочие часы: `09:00–20:00`.
- Дефолтная вместимость слота: `5`.
- Граничный случай `slotCapacity=50` остается неподтвержденным системными источниками и должен трактоваться как inconsistency UI contract до отдельного решения.

## Validations

### Field validations

- `Система должна проверять заполненность обоих полей времени и поля вместимости до сохранения.`
- `Система должна проверять корректность формата времени, принятого UI-элементом выбора времени.`
- `Система должна проверять, что вместимость передается как числовое значение, допустимое для операции сохранения.`

### Business validations

- Система должна отклонять рабочие часы, которые нарушают правило операционного окна, с ошибкой `invalid-working-hours`.
- Система должна отклонять вместимость, которая нарушает ограничения операции, с ошибкой `invalid-slot-capacity`.
- `Система должна применять сохраненные параметры только к слотам текущего дня.`

### Role or capability validations

- Система должна разрешать операцию управления настройками только роли `administrator`.
- Система должна отклонять запрос недопустимой роли с ошибкой `administrator-role-required`.

## Errors

### User-facing errors

- `invalid-working-hours` — `Система должна показать, что время закрытия должно быть позже времени открытия, и оставить значения доступными для исправления.`
- `invalid-slot-capacity` — `Система должна показать, что вместимость слота не принята системой, и оставить поле доступным для исправления.`
- `administrator-role-required` — `Система должна показать защищенное состояние доступа вместо рабочего экрана сохранения настроек.`

### System errors

- Ошибка сохранения настроек — `Система должна сохранять экран настроек в контексте редактирования без уведомления об успешном сохранении.`
- Ошибка чтения текущих значений настроек — `Система должна показать состояние ошибки загрузки вместо успешного состояния.`

### Error mapping

| Condition                                     | User-visible outcome                                                                                    | Source                                                                                                          |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| `close_time <= open_time`                     | `Система должна показать ошибку валидации рабочих часов и не сохранить форму.`                          | `docs/system/contracts/slot-settings-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md` |
| `slot_capacity violates operation constraint` | `Система должна показать ошибку поля вместимости и не сохранить форму.`                                 | `docs/system/contracts/slot-settings-management.md`                                                             |
| `actor role != administrator`                 | `Система должна показать защищенное состояние доступа backoffice вместо интерфейса изменения настроек.` | `docs/system/contracts/slot-settings-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md` |
| `save operation fails`                        | `Система должна сохранить контекст редактирования и не показывать подтверждение успешного сохранения.`  | `feature behavior`, `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`                             |

## Edge Cases

- `Система должна сохранять неизмененное действующее значение второго параметра, если administrator изменил только один из двух параметров.`
- `Система должна применять новые настройки только к дальнейшему формированию слотов, а не к уже сохраненному заказу постфактум без отдельного правила перерасчета.`
- `Система должна сохранять пользовательский контекст редактирования после неуспешной попытки сохранения, чтобы administrator мог исправить значения без повторного открытия экрана.`
- `Система должна использовать последнее успешно сохраненное сочетание рабочих часов и вместимости как действующее состояние генерации слотов.`

## Scope Constraints

- Фича покрывает один административный сценарий изменения рабочих часов и вместимости слотов.
- Фича покрывает только слоты текущего дня.
- Фича сохраняет длительность слота равной 10 минутам.
- Фича использует существующую вкладку `Настройки` backoffice как единственную UI surface.

## Safety Constraints

- Доступ к операции остается ограниченным ролью `administrator`.
- Генерация customer-слотов остается зависимой от действующих рабочих часов и вместимости.
- Учет занятой вместимости остается ограниченным активными статусами заказа.
- Канонический визуальный источник интерфейса остается в `.references/Expressa_admin`.

## Prototype Completeness Audit

### Current prototype status

- `partial`

### Audit checklist

- Экран `SettingsScreen` присутствует и содержит поля рабочих часов, поле вместимости и кнопку сохранения.
- Успешное уведомление присутствует как `toast.success`.
- Отдельные loading-state, initial-fetch-state и save-error-state в reference screen не показаны.
- Inline-ошибки валидации для полей в reference screen не показаны.
- Disabled-state кнопки сохранения при невалидных значениях в reference screen не показан.

### Design gaps and required prototype corrections

- Gap: reference screen показывает только optimistic success toast по клику `Сохранить` без привязки к подтвержденному результату операции.
  - Required correction: prototype или системный handoff должен явно связывать success notification с успешным завершением операции сохранения.
  - Canonical source: `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`
- Gap: reference screen не показывает inline-валидацию для `invalid-working-hours` и `invalid-slot-capacity`.
  - Required correction: prototype или implementation handoff должен включать user-visible validation state для ошибки рабочих часов и ошибки вместимости.
  - Canonical source: `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`
- Gap: reference screen задает `slotCapacity` через `min=1 max=50`, но канонические business/system artifacts не подтверждают верхнюю границу `50`.
  - Required correction: диапазон вместимости должен быть отдельно подтвержден или снят как UI-specific ограничение до реализации контрактных проверок.
  - Canonical source: `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`

### Repeated verification result

- `pending design update; current Git-tracked prototype rechecked on 2026-04-23`

## Blockers

- Blocker: Отсутствует каноническое подтверждение верхней границы `slotCapacity`, хотя UI reference задает `max=50`; архитектору требуется отдельное решение о нормализации этого ограничения.

## Test Scenarios Link

- `Система должна ссылаться на sibling документ сценариев тестирования фичи: docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md.`
- `Система должна сохранять согласованность сценариев тестирования с описанными workflow, validations, errors и design gaps этой фичи.`

## Architecture Handoff Checklist

- `Система должна иметь явную feature boundary.`
- `Система должна иметь перечисленные user workflows.`
- `Система должна иметь UI interaction requirements для экрана настроек и связанных guards.`
- `Система должна иметь input constraints, validations, errors и edge cases.`
- `Система должна иметь explicit Scope Constraints и Safety Constraints.`
- `Система должна иметь audit design readiness и documented prototype completeness status.`
- `Система должна иметь sibling test scenarios document со stable scenario IDs и coverage mapping.`
- `Система должна иметь ссылки на canonical system sources и versioned design sources.`
- `Система должна быть готова к архитектурной декомпозиции с явно зафиксированным blocker по диапазону вместимости.`
