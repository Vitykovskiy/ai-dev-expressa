# Feature Spec: FEATURE-002 Administrator Menu Catalog Management

## Карточка документа

- Feature: `FEATURE-002`
- Parent sprint: `SPRINT-001`
- Feature spec: `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`
- Test scenarios: `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- Status: `ready-for-architecture`
- Related roles: `Системный аналитик`, `Архитектор`, `Frontend`, `Backend`, `QA`
- Affected interfaces: `backoffice/menu`, `Manage menu catalog`, `MenuCatalogSnapshot`
- Last consistency check: `2026-04-23`

## Source Trace

### Business input

- `docs/business/business-rules/menu-catalog-and-options.md`
- `docs/business/business-rules/backoffice-operations.md`
- `docs/business/scenarios/administrator-manage-menu.md`
- `tasks/archive/FEATURE-002-administrator-menu-catalog-management.md`

### System sources

- `use-cases`: `docs/system/use-cases/administrator-manage-menu.md`
- `contracts`: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `domain-model`: `docs/system/domain-model/menu-catalog.md`
- `state-models`: `n/a`
- `ui-behavior-mapping`: `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`

### UI sources

- `ui-contract`: `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `versioned design sources`: `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`
- `prototype verification status`: `verified-with-documented-gaps`

## Feature Boundary

### Included scope

- Просмотр administrator текущего каталога меню во вкладке `Меню`.
- Создание, изменение и удаление категорий меню.
- Создание, изменение и удаление товаров в категориях меню.
- Управление ценой обычного товара через `basePrice`.
- Управление ценами напитка по размерам `S`, `M`, `L`.
- Создание группы дополнительных опций как группы меню с включенным флагом `Группа опций`.
- Создание платной или бесплатной дополнительной опции как товара внутри группы опций.
- Назначение группы дополнительных опций на обычную категорию через поле `Выбрать группу опций`.
- Проверки доступа, вводов, доменных инвариантов и ошибок операции `Manage menu catalog`.

### Explicitly excluded scope

- Оперативное включение и выключение доступности товаров или опций в barista-сценарии.
- Клиентский заказ, корзина, расчет итоговой цены заказа и история заказов.
- Обработка заказов barista.
- Отдельная route-level панель для групп дополнительных опций.
- Отдельная кнопка `Добавить группу опций` вне canonical menu-flow.
- Системное поведение для изображений товаров.
- Snapshot-поведение уже созданных заказов после последующего изменения каталога.

### Business outcome

- `Система должна позволять administrator управлять структурами меню, товарами, ценами, размерами напитков и дополнительными опциями как завершенным backoffice-сценарием без нарушения правил выбора опций и наследования групп опций от категории.`

### Dependencies

- `FEATURE-001`
- `docs/system/domain-model/menu-catalog.md`
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/use-cases/administrator-manage-menu.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`
- `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`
- `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`
- `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`
- `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`
- `.references/Expressa_admin/src/app/components/MenuGuide.tsx`

## User Workflows

### Main workflow

1. Administrator открывает вкладку `Меню`.
2. `Система должна отобразить текущие обычные категории и группы опций из snapshot каталога.`
3. Administrator создает обычную категорию через `Добавить группу`.
4. `Система должна сохранить категорию как `MenuCategory` без признака группы опций.`
5. Administrator создает товар через `Добавить товар`, выбирает категорию, задает название и цену.
6. `Система должна сохранить товар в выбранной категории с допустимой ценовой схемой.`
7. Administrator создает группу опций через `Добавить группу` и включает флаг `Группа опций`.
8. `Система должна сохранить такую группу как источник дополнительных опций, не показываемый customer как самостоятельная обычная категория меню.`
9. Administrator добавляет платные или бесплатные опции как товары внутри группы опций.
10. `Система должна сохранить каждую опцию с `priceDelta`, где `0` означает бесплатную опцию.`
11. Administrator назначает группу опций на обычную категорию через `Выбрать группу опций`.
12. `Система должна применить назначение группы опций к товарам обычной категории через наследование от `MenuCategory`.`

### Alternative workflows

#### Напиток с размерами

1. Administrator включает `Размеры S / M / L` при создании или редактировании товара.
2. `Система должна принять товар как напиток только при полном наборе цен для размеров `S`, `M`, `L`.`
3. `Система должна использовать цены размеров вместо `basePrice`для товара типа`drink`.`

#### Изменение категории

1. Administrator открывает редактирование группы.
2. `Система должна позволять изменить название, признак группы опций и назначенную группу опций в пределах доменных правил.`
3. `Система должна сохранять итоговую конфигурацию категории и обновлять snapshot каталога.`

#### Изменение товара

1. Administrator открывает товар из раскрытой группы.
2. `Система должна позволять изменить название, категорию и ценовую схему товара.`
3. `Система должна сохранять товар только после успешной проверки выбранной ценовой схемы.`

### Exception workflows

#### Недопустимая ценовая схема напитка

1. Administrator сохраняет напиток без полного набора цен `S`, `M`, `L`.
2. `Система должна отклонить сохранение с ошибкой `invalid-drink-size-model`.`
3. `Система должна сохранить форму в редактируемом состоянии и показать user-visible validation state.`

#### Недопустимое правило группы опций

1. Administrator сохраняет группу опций или назначение группы с нарушением правила выбора.
2. `Система должна отклонить сохранение с ошибкой `invalid-option-group-rule`.`
3. `Система должна сохранить рабочий контекст редактирования без применения недопустимого изменения.`

#### Недопустимый доступ

1. Пользователь без capability `menu` открывает вкладку или route управления каталогом.
2. `Система должна отклонить доступ через backoffice capability guard.`
3. `Система должна показать protected state backoffice без рабочих действий управления меню.`

### System-relevant UI states

- Empty state: `Система должна показывать пустое состояние меню и предлагать administrator добавить первую группу, если snapshot каталога не содержит категорий.`
- Loading state: `Система должна удерживать экран каталога в состоянии загрузки до получения snapshot каталога.`
- Success state: `Система должна подтверждать успешное создание, изменение или удаление категории, товара или опции пользовательским уведомлением.`
- Error state: `Система должна оставлять administrator в контексте текущего экрана или формы при ошибке сохранения.`
- Disabled state: `Система должна блокировать `Добавить товар`, пока в каталоге нет ни одной группы для выбора.`
- Hidden state: `Система должна скрывать вкладку `Меню`для пользователя без capability`menu`.`
- Guarded state: `Система должна показывать forbidden state при прямом route-доступе без capability `menu`.`
- Confirmation state: `Система должна выполнять сохранение через modal action без отдельного confirm-dialog, если UI-канон не вводит дополнительное подтверждение.`
- Notification state: `Система должна связывать success notification с успешным завершением операции, а не только с нажатием кнопки.`
- Inline error state: `Система должна показывать ошибку поля или формы при нарушении обязательных вводов, ценовой схемы или правила группы опций.`

## Entity View

### Entities

- `MenuCategory`
- `MenuItem`
- `DrinkSize`
- `DrinkSizePrice`
- `OptionGroup`
- `Option`

### Relations

- `MenuCategory` содержит множество `MenuItem`.
- `MenuCategory` назначает множество `OptionGroup`.
- `OptionGroup` содержит множество `Option`.
- `MenuItem` типа `drink` содержит цены `DrinkSizePrice` для `S`, `M`, `L`.
- Дополнительная опция в canonical UI создается как товар внутри группы опций и преобразуется в `Option` в contract boundary.

### Invariants

- `Система должна отображать customer меню по категориям.`
- `Система должна требовать выбор размера для напитка.`
- `Система должна использовать цену напитка из выбранного размера.`
- `Система должна ограничивать взаимоисключающую группу выбором не более одной опции.`
- `Система должна разрешать множественный выбор только для группы с `selectionMode=multiple`.`
- `Система должна сохранять `priceDelta` опции неотрицательным.`
- `Система должна ограничивать изменение структуры меню и цен ролью `administrator`.`

### Identity and ownership

- Источник истины для структуры каталога задается contract `Manage menu catalog`.
- Владелец изменения структуры каталога в рамках фичи: `administrator`.
- Идентификаторы `menuCategoryId`, `menuItemId`, `optionGroupId` и `optionId` принадлежат системному каталогу меню.

## UI Element Action Sequence

### Screen or surface

- `MenuScreen`
- `AddCategoryDialog`
- `EditCategoryDialog`
- `AddProductDialog`
- `EditProductDialog`

### Element-to-action mapping

| UI element                         | User action     | System reaction                                                                          | Related source                                                                                               |
| ---------------------------------- | --------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `menu.addGroupButton`              | `click`         | `Система должна открыть форму создания группы меню или группы опций.`                    | `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `administrator-manage-menu.md`                  |
| `categoryDialog.name`              | `enter text`    | `Система должна принять непустое trimmed-название группы для последующей проверки.`      | `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`                                        |
| `categoryDialog.isOptionGroup`     | `toggle`        | `Система должна трактовать группу как группу дополнительных опций при включенном флаге.` | `menu-and-availability-management.md`, `backoffice-ui-binding.md`                                            |
| `categoryDialog.parentOptionGroup` | `select`        | `Система должна назначить выбранную группу опций на обычную группу меню.`                | `menu-and-availability-management.md`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx` |
| `menu.addProductButton`            | `click`         | `Система должна открыть форму создания товара, если существует хотя бы одна группа.`     | `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`                                                  |
| `productDialog.category`           | `select`        | `Система должна связать товар или опцию с выбранной группой.`                            | `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`                                         |
| `productDialog.hasSizes`           | `toggle`        | `Система должна переключить ценовую схему между `basePrice`и ценами`S/M/L`.`             | `menu-and-availability-management.md`                                                                        |
| `productDialog.sizePrices`         | `enter numbers` | `Система должна проверить полный набор положительных цен для напитка.`                   | `menu-and-availability-management.md`                                                                        |
| `productDialog.basePrice`          | `enter number`  | `Система должна проверить неотрицательную цену обычного товара или опции.`               | `menu-and-availability-management.md`                                                                        |
| `categoryRow.edit`                 | `click`         | `Система должна открыть редактирование выбранной группы.`                                | `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`                                                  |
| `productRow`                       | `click`         | `Система должна открыть редактирование выбранного товара или опции.`                     | `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`                                                  |
| `deleteCategory`                   | `click`         | `Система должна удалить категорию только если категория не содержит товаров.`            | `menu-and-availability-management.md`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`         |
| `deleteProduct`                    | `click`         | `Система должна удалить выбранный товар или опцию из каталога после успешной операции.`  | `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`                                        |

### Interaction notes

- `Система должна использовать существующую вкладку `Меню` как единственную UI surface управления каталогом.`
- `Система должна реализовывать группы дополнительных опций через флаг `Группа опций`, товары внутри такой группы и поле `Выбрать группу опций`.`
- `Система должна сохранять визуальный канон `.references/Expressa_admin` без добавления отдельного экрана групп опций.`
- `Система должна отличать обычные группы от групп опций в списке меню.`

## Input Constraints

### Required inputs

- Название категории или группы опций.
- Название товара или опции.
- Категория для товара или опции.
- `basePrice` для обычного товара без размеров.
- Полный набор цен `S`, `M`, `L` для напитка.
- `selectionMode` группы опций на contract boundary.

### Allowed values

- `DrinkSize`: `S`, `M`, `L`.
- `itemType`: `drink`, `regular`.
- `selectionMode`: `single`, `multiple`.
- `priceDelta`: `0` или положительное денежное значение.
- `basePrice`: положительное денежное значение для обычного товара.

### Cross-field constraints

- `Система должна требовать `drinkSizePrices`для`itemType=drink`.`
- `Система должна исключать `drinkSizePrices`для`itemType=regular`.`
- `Система должна отключать выбор parent option group, когда редактируемая группа сама является группой опций.`
- `Система должна исключать назначение группы опций самой на себя.`

### Boundary values

- Пустое или whitespace-only название категории не принимается.
- Пустое или whitespace-only название товара не принимается.
- Цена `0` допускается для дополнительной опции как бесплатная опция.
- Отрицательная цена не допускается для товара, размера напитка или дополнительной опции.
- Категория с товарами не удаляется.

## Validations

### Field validations

- `Система должна проверять непустое trimmed-название группы перед сохранением.`
- `Система должна проверять непустое trimmed-название товара или опции перед сохранением.`
- `Система должна проверять наличие выбранной категории при создании товара или опции.`
- `Система должна проверять числовой формат цены перед сохранением.`

### Business validations

- `Система должна отклонять напиток без полного набора цен `S`, `M`, `L`с ошибкой`invalid-drink-size-model`.`
- `Система должна отклонять обычный товар с `drinkSizePrices`.`
- `Система должна отклонять отрицательный `priceDelta` дополнительной опции.`
- `Система должна отклонять удаление категории, если в ней есть товары.`
- `Система должна отклонять удаление группы опций, если она назначена на категорию.`
- `Система должна сохранять `selectionMode=single`как взаимоисключающую группу, а`selectionMode=multiple` как группу множественного выбора.`

### Role or capability validations

- `Система должна требовать capability `menu` для endpoints каталога.`
- `Система должна разрешать изменение структуры меню, товаров, цен и групп дополнительных опций только роли `administrator`.`
- `Система должна отклонять пользователя без capability `menu` через ошибки backoffice auth/capability contract.`

## Errors

### User-facing errors

- `invalid-drink-size-model` — `Система должна показать, что для напитка нужны цены всех размеров `S`, `M`, `L`, и оставить форму доступной для исправления.`
- `invalid-option-group-rule` — `Система должна показать, что правило группы опций или назначение группы не принято системой.`
- `administrator-role-required` — `Система должна показать protected state вместо рабочих действий управления каталогом.`
- `backoffice-capability-forbidden` — `Система должна показать forbidden state при прямом доступе к capability `menu` без разрешения.`

### System errors

- Ошибка загрузки каталога — `Система должна показать состояние ошибки вместо успешного списка категорий.`
- Ошибка сохранения категории — `Система должна оставить форму категории в контексте редактирования.`
- Ошибка сохранения товара — `Система должна оставить форму товара в контексте редактирования.`
- Ошибка удаления — `Система должна сохранить актуальный список без optimistic-подтверждения удаления.`

### Error mapping

| Condition                               | User-visible outcome                                                                             | Source                                                                                               |
| --------------------------------------- | ------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `actor lacks menu capability`           | `Система должна показать forbidden state или entry denied state согласно классу ошибки доступа.` | `backoffice-auth-and-capability-access.md`, `backoffice-ui-binding.md`                               |
| `itemType=drink without S/M/L prices`   | `Система должна показать ошибку ценовой модели напитка и не сохранить товар.`                    | `menu-and-availability-management.md`                                                                |
| `itemType=regular with drinkSizePrices` | `Система должна показать ошибку ценовой схемы и не сохранить товар.`                             | `menu-and-availability-management.md`                                                                |
| `priceDelta < 0`                        | `Система должна показать ошибку цены опции и не сохранить опцию.`                                | `menu-and-availability-management.md`                                                                |
| `delete category with products`         | `Система должна отклонить удаление категории и сохранить ее в каталоге.`                         | `menu-and-availability-management.md`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx` |
| `delete assigned option group`          | `Система должна отклонить удаление группы опций и сохранить назначение на категорию.`            | `menu-and-availability-management.md`                                                                |

## Edge Cases

- `Система должна показывать `Добавить товар` disabled, если нет групп для размещения товара.`
- `Система должна показывать отсутствие доступных групп опций, если ни одна группа не помечена как `Группа опций`.`
- `Система должна сохранять бесплатную опцию с ценой `0` без превращения ее в пустую цену.`
- `Система должна сохранять последние успешно подтвержденные данные каталога при неуспешной операции сохранения.`
- `Система должна предотвращать циклическое или самоназначенное наследование групп опций.`
- `Система должна сохранять обычные категории и группы опций как разные системные представления в одном menu-flow.`

## Scope Constraints

- Фича покрывает один административный сценарий управления каталогом меню.
- Фича использует вкладку `Меню` backoffice как единственную UI surface.
- Фича использует current canonical menu-flow для групп дополнительных опций.
- Фича не покрывает barista-сценарий временной доступности.
- Фича не покрывает customer-сценарий заказа.
- Фича не покрывает обработку заказов.
- Фича не покрывает отдельный экран групп дополнительных опций.
- Фича не покрывает изображения товаров как системный атрибут.

## Safety Constraints

- Доступ к изменению структуры каталога остается ограниченным role/capability boundary administrator menu.
- Ценовая модель напитка остается полной по размерам `S`, `M`, `L`.
- Дополнительная опция сохраняет неотрицательную цену.
- Взаимоисключающая группа сохраняет ограничение выбора одной опции.
- Канонический визуальный источник интерфейса остается в `.references/Expressa_admin`.

## Prototype Completeness Audit

### Current prototype status

- `partial`

### Audit checklist

- `MenuScreen` содержит список обычных групп и групп опций.
- `MenuScreen` содержит кнопки `Добавить группу` и `Добавить товар`.
- `AddCategoryDialog` и `EditCategoryDialog` содержат флаг `Группа опций` и поле `Выбрать группу опций`.
- `AddProductDialog` и `EditProductDialog` содержат переключатель `Размеры S / M / L` и поля цен.
- `MenuGuide` описывает базовые действия управления группами и товарами.
- Reference UI не показывает явные server-confirmed loading и save-error states для всех операций каталога.
- Reference UI валидирует цену напитка как хотя бы одну цену размера, тогда как contract требует полный набор `S`, `M`, `L`.
- Reference UI не показывает отдельный выбор `selectionMode=single/multiple` для группы опций.

### Design gaps and required prototype corrections

- Gap: reference UI допускает сохранение товара с размерами при наличии хотя бы одной цены размера.
  - Required correction: prototype или implementation handoff должен требовать полный набор цен `S`, `M`, `L` для напитка.
  - Canonical source: `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`, `docs/system/contracts/menu-and-availability-management.md`
- Gap: reference UI не показывает control для выбора `selectionMode=single/multiple` группы опций.
  - Required correction: architect должен определить, как existing canonical menu-flow задает режим выбора без добавления отдельной route-level панели.
  - Canonical source: `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `docs/system/contracts/menu-and-availability-management.md`
- Gap: reference UI не показывает save-error и inline-error states для всех contract errors каталога.
  - Required correction: implementation handoff должен включить user-visible states для `invalid-drink-size-model`, `invalid-option-group-rule` и ошибок capability guard.
  - Canonical source: `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `docs/system/contracts/menu-and-availability-management.md`

### Repeated verification result

- `current Git-tracked prototype rechecked on 2026-04-23; .references/Expressa_admin used read-only because current changes are design-owned`

## Blockers

- Blocker: UI reference не фиксирует способ выбора `selectionMode=single/multiple` для группы опций, хотя contract требует различать взаимоисключающий и множественный режим.

## Test Scenarios Link

- `Система должна ссылаться на sibling документ сценариев тестирования фичи: docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md.`
- `Система должна сохранять согласованность сценариев тестирования с workflow, validations, errors, constraints и prototype gaps этой фичи.`

## Architecture Handoff Checklist

- `Система должна иметь явную feature boundary.`
- `Система должна иметь перечисленные user workflows.`
- `Система должна иметь UI interaction requirements для вкладки `Меню` и связанных modal forms.`
- `Система должна иметь input constraints, validations, errors и edge cases.`
- `Система должна иметь explicit Scope Constraints и Safety Constraints.`
- `Система должна иметь audit design readiness и documented prototype completeness status.`
- `Система должна иметь sibling test scenarios document со stable scenario IDs и coverage mapping.`
- `Система должна иметь ссылки на canonical system sources и versioned design sources.`
- `Система должна быть готова к архитектурной декомпозиции с явно зафиксированным blocker по `selectionMode` групп опций.`
