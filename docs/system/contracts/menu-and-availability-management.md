# Contract: Menu And Availability Management

## Граница

Один набор контрактов: управление каталогом menu administrator и оперативной доступностью menu barista.

## Источники

- `docs/business/business-rules/menu-catalog-and-options.md`
- `docs/business/business-rules/backoffice-operations.md`
- `docs/business/scenarios/administrator-manage-menu.md`
- `docs/business/scenarios/barista-manage-menu-availability.md`

## Contract `Manage menu catalog`

### Consumer

- `administrator`

### Operation boundary

| Method   | Path                                            | Назначение                                              |
| -------- | ----------------------------------------------- | ------------------------------------------------------- |
| `GET`    | `/backoffice/menu/catalog`                      | Получить полный snapshot каталога.                      |
| `POST`   | `/backoffice/menu/categories`                   | Создать категорию меню.                                 |
| `PATCH`  | `/backoffice/menu/categories/:menuCategoryId`   | Изменить название категории и назначенные группы опций. |
| `DELETE` | `/backoffice/menu/categories/:menuCategoryId`   | Удалить категорию, если в ней нет товаров.              |
| `POST`   | `/backoffice/menu/items`                        | Создать товар в категории.                              |
| `PATCH`  | `/backoffice/menu/items/:menuItemId`            | Изменить товар, категорию, тип товара и ценовую схему.  |
| `DELETE` | `/backoffice/menu/items/:menuItemId`            | Удалить товар из каталога.                              |
| `POST`   | `/backoffice/menu/option-groups`                | Создать группу дополнительных опций.                    |
| `PATCH`  | `/backoffice/menu/option-groups/:optionGroupId` | Изменить группу, режим выбора и состав опций.           |
| `DELETE` | `/backoffice/menu/option-groups/:optionGroupId` | Удалить группу, если она не назначена на категорию.     |

### Inputs

- Изменения категорий меню.
- Изменения товаров.
- Изменения цен.
- Изменения групп дополнительных опций и самих опций.

### Validations and constraints

- Для напитков должна поддерживаться ценовая модель по размерам `S`, `M`, `L`.
- Группа дополнительных опций назначается на категорию меню и наследуется товарами этой категории.
- Взаимоисключающая группа должна ограничивать выбор customer одной опцией.
- Backoffice endpoints каталога требуют capability `menu`.
- `itemType=drink` требует полный набор `drinkSizePrices` для `S`, `M`, `L`.
- `itemType=regular` использует `basePrice` и не должен содержать `drinkSizePrices`.
- `selectionMode=single` означает взаимоисключающую группу, `selectionMode=multiple` — множественный выбор.
- `priceDelta` дополнительной опции может быть `0`, но не может быть отрицательным.

### Backoffice UI mapping v1

- Во вкладке `Меню` группа дополнительных опций создается как группа меню с включенным флагом `Группа опций`.
- Платные и бесплатные опции в текущем UI добавляются как товары внутри такой группы; цена товара `0` означает бесплатную опцию, цена `>0` — платную.
- Обычная группа меню назначает группу дополнительных опций через поле `Выбрать группу опций`.
- Отдельная route-level панель или отдельная кнопка `Добавить группу опций` не является частью канонического UI `FEATURE-002`.

### Outputs

- Обновлённый каталог меню.

#### `MenuCatalogSnapshot`

| Поле           | Описание                                                                                                   |
| -------------- | ---------------------------------------------------------------------------------------------------------- |
| `categories`   | Массив категорий `{ menuCategoryId, name, optionGroupRefs }`.                                              |
| `items`        | Массив товаров `{ menuItemId, menuCategoryId, name, itemType, basePrice, availability, drinkSizePrices }`. |
| `optionGroups` | Массив групп `{ optionGroupId, name, selectionMode, options }`.                                            |

#### `Option`

Опция в составе группы возвращается как `{ optionId, optionGroupId, name, priceDelta, availability }`.

### Business errors

- `administrator-role-required`
- `invalid-drink-size-model`
- `invalid-option-group-rule`
- Ошибки backoffice auth/capability соответствуют `docs/system/contracts/backoffice-auth-and-capability-access.md`.

## Contract `Change temporary availability`

### Consumer

- `barista`

### Inputs

- Идентификатор товара или дополнительной опции.
- Новое значение доступности.

### Validations and constraints

- Barista может изменять только доступность товаров и дополнительных опций.
- Barista не может изменять цены.
- Barista не может изменять структуру меню.

### Outputs

- Обновлённый признак доступности.

### Business errors

- `availability-target-not-found`
- `availability-change-not-allowed`
