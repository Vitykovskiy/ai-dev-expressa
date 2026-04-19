# Backend Menu Catalog Application Map

## Граница

Серверный контур каталога меню для `FEATURE-002`: категории, товары, цены, размеры напитков `S/M/L`, группы дополнительных опций, опции и назначение групп на категории.

Контур использует существующую backoffice-авторизацию из `backend-access.md`, но не смешивает управление каталогом с идентификацией, ролями, слотами, заказами или оперативной доступностью barista.

## Модули

| Модуль | Ответственность |
|---|---|
| `MenuCatalogModule` или локальный эквивалент | Публичная backend boundary для чтения и изменения каталога из backoffice. |
| `MenuCatalogService` | Доменная оркестрация категорий, товаров, цен, групп опций и назначений. |
| `MenuCatalogRepository` | Хранение текущего каталога; начальный in-memory адаптер допустим, если постоянное хранилище не вводится отдельной задачей. |
| `MenuCatalogValidator` | Проверка доменных инвариантов `invalid-drink-size-model`, `invalid-option-group-rule` и ссылочной целостности. |

## Реализация

| Путь | Назначение |
|---|---|
| `backend/src/menu-catalog/menu-catalog.module.ts` | NestJS-модуль server-side boundary каталога меню. |
| `backend/src/menu-catalog/menu-catalog.controller.ts` | Backoffice endpoints `/backoffice/menu/*`, защищённые capability `menu`. |
| `backend/src/menu-catalog/menu-catalog.service.ts` | Оркестрация операций над категориями, товарами, ценами, группами опций и назначениями. |
| `backend/src/menu-catalog/domain/menu-catalog.types.ts` | Shared backend DTO/domain shape для snapshot и сущностей каталога. |
| `backend/src/menu-catalog/domain/menu-catalog.validator.ts` | Проверка размерной модели напитков, правил групп опций и ссылочной целостности. |
| `backend/src/menu-catalog/domain/menu-catalog.errors.ts` | Канонические доменные ошибки каталога. |
| `backend/src/menu-catalog/repository/in-memory-menu-catalog.repository.ts` | Текущий in-memory адаптер хранения каталога. |
| `backend/test/menu-catalog-domain.spec.ts` | Модульные тесты доменных правил каталога. |
| `backend/test/menu-catalog.e2e.spec.ts` | Integration/e2e проверки backoffice menu endpoints и доступа. |

## Endpoint boundary

Все endpoints относятся к backoffice boundary и требуют capability `menu` для роли `administrator`.

| Method | Path | Назначение |
|---|---|---|
| `GET` | `/backoffice/menu/catalog` | Вернуть полный каталог: категории, товары, цены размеров, группы опций, опции и назначения групп на категории. |
| `POST` | `/backoffice/menu/categories` | Создать категорию меню. |
| `PATCH` | `/backoffice/menu/categories/:menuCategoryId` | Изменить название категории и назначенные группы опций. |
| `DELETE` | `/backoffice/menu/categories/:menuCategoryId` | Удалить категорию, если удаление не нарушает целостность каталога. |
| `POST` | `/backoffice/menu/items` | Создать товар в категории. |
| `PATCH` | `/backoffice/menu/items/:menuItemId` | Изменить товар, категорию, тип товара и ценовую схему. |
| `DELETE` | `/backoffice/menu/items/:menuItemId` | Удалить товар из каталога. |
| `POST` | `/backoffice/menu/option-groups` | Создать группу дополнительных опций. |
| `PATCH` | `/backoffice/menu/option-groups/:optionGroupId` | Изменить группу, режим выбора и состав опций. |
| `DELETE` | `/backoffice/menu/option-groups/:optionGroupId` | Удалить группу, если она не назначена на категорию или удаление явно обработано. |

## DTO boundary

- `MenuCatalogSnapshot` должен содержать категории, товары, цены размеров, группы опций, опции и связи категория -> группы опций.
- Текущий shape snapshot: `{ categories, items, optionGroups }`.
- `MenuCategory` содержит `menuCategoryId`, `name`, `optionGroupRefs`.
- `MenuItem` содержит `menuItemId`, `menuCategoryId`, `name`, `itemType`, `basePrice`, `availability`, `drinkSizePrices`.
- `OptionGroup` содержит `optionGroupId`, `name`, `selectionMode`, `options`.
- `Option` содержит `optionId`, `optionGroupId`, `name`, `priceDelta`, `availability`.
- `MenuItem.itemType=drink` требует полный набор цен для размеров `S`, `M`, `L`; неполный или противоречивый набор возвращает `invalid-drink-size-model`.
- Товар без размерной модели использует `basePrice` и не должен одновременно сохранять `DrinkSizePrice`.
- `MenuItem.itemType=regular` используется для товара без обязательного выбора размера.
- `OptionGroup.selectionMode` использует значения `single` и `multiple`; неизвестное или противоречивое значение возвращает `invalid-option-group-rule`.
- `Option.priceDelta` может быть `0`, но не должен быть отрицательным без отдельного системного решения.
- Назначение группы дополнительных опций выполняется на категорию и наследуется товарами этой категории.
- Оперативные поля доступности товаров и опций не входят в `FEATURE-002` как редактируемое поведение barista; если они возвращаются в snapshot, их изменение остается задачей availability feature.

## Auth and errors

- Для всех write/read operations используется существующий backoffice guard из `backend-access.md`.
- Статические endpoints `/backoffice/menu/*` защищаются через `RequireBackofficeCapability("menu")` и `BackofficeAuthGuard`.
- Пользователь без `administrator` capability `menu` получает отказ по backoffice auth/capability contract, а не доменную ошибку каталога.
- Канонические доменные ошибки для этой feature: `administrator-role-required`, `invalid-drink-size-model`, `invalid-option-group-rule`.
- Транспортное сопоставление `401/403` по Telegram/session/capability берется из `docs/system/contracts/backoffice-auth-and-capability-access.md`.
- `invalid-drink-size-model` и `invalid-option-group-rule` возвращаются как `400 Bad Request`.

## Handoff route for FEATURE-002

- Для backend-реализации сначала читать `docs/system/contracts/menu-and-availability-management.md`, затем `docs/system/domain-model/menu-catalog.md`, затем эту карту и `docs/architecture/application-map/backend-access.md`.
- Если меняется endpoint boundary, DTO shape, guard attachment или mapping ошибок каталога, обновляется эта карта и соответствующий system contract в одном handoff.

## Запрещено в FEATURE-002

- Реализовывать клиентский заказ, обработку заказов, слоты, управление ролями или блокировку пользователей.
- Передавать право изменения структуры меню роли `barista`.
- Считать неполную размерную модель напитка допустимой.
- Хранить группы дополнительных опций как самостоятельные позиции меню.
