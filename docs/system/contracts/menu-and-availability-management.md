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

### Inputs

- Изменения категорий меню.
- Изменения товаров.
- Изменения цен.
- Изменения групп дополнительных опций и самих опций.

### Validations and constraints

- Для напитков должна поддерживаться ценовая модель по размерам `S`, `M`, `L`.
- Группа дополнительных опций назначается на категорию меню и наследуется товарами этой категории.
- Взаимоисключающая группа должна ограничивать выбор customer одной опцией.

### Outputs

- Обновлённый каталог меню.

### Business errors

- `administrator-role-required`
- `invalid-drink-size-model`
- `invalid-option-group-rule`

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

