# Use Case: Administrator Manage Menu

## Граница

Один use case: управление administrator структурой меню, товарами, ценами и группами дополнительных опций.

## Источники

- `docs/business/scenarios/administrator-manage-menu.md`
- `docs/business/business-rules/menu-catalog-and-options.md`
- `docs/business/business-rules/backoffice-operations.md`

## Триггер

Administrator инициирует изменение структуры или содержимого меню.

## Предусловия

- Пользователь идентифицирован через Telegram backoffice-бота.
- Пользователь имеет роль `administrator` и доступ к вкладке `Меню`.

## Основной поток

1. Система предоставляет administrator интерфейс управления меню.
2. Administrator создаёт или изменяет категории меню.
3. Administrator создаёт или изменяет товары.
4. Administrator задаёт цены товаров.
5. Для напитков administrator задаёт ценовые значения по размерам `S`, `M`, `L`.
6. Administrator создаёт или изменяет группы дополнительных опций.
7. Administrator создаёт или изменяет дополнительные опции, включая платные, бесплатные и взаимоисключающие варианты.
8. Administrator назначает группы дополнительных опций на категории меню.
9. Система сохраняет обновлённый каталог.

## Альтернативы и исключения

- Пользователь без роли `administrator` не получает доступ к этому use case.

## Постусловия

- Актуальный каталог обновлён и доступен customer-сценарию.
