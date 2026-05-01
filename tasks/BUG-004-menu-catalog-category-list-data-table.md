# BUG-004: Список групп меню должен использовать ui-data-table с группировкой

## Карточка задачи

- Идентификатор: `BUG-004`
- Родительская задача: `FEATURE-002`
- Заголовок: `Исправить список групп меню через ui-data-table с группировкой`
- Единица поставки: `FEATURE-002`
- Роль: `Фронтенд`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Цель

Исправить реализацию списка групп на вкладке `Меню`: система должна использовать стилизованный UI-компонент таблицы поверх Vuetify `v-data-table` и показывать обычные группы и группы опций как сгруппированную таблицу с регрессионным покрытием.

## Границы задачи

### Функциональные требования

- Система должна иметь канонический backoffice-компонент `ui-data-table` в `frontend/src/ui/`, который инкапсулирует стилизацию и базовый контракт таблицы поверх Vuetify `v-data-table`.
- Система должна отображать список групп каталога меню через `ui-data-table` в `frontend/src/components/menu-catalog/MenuCatalogCategoryList.vue`.
- Система должна показывать обычные группы и группы опций как сгруппированные секции таблицы с заголовками `Основное меню` и `Группы опций`.
- Система должна сохранять раскрытие группы, отображение товаров или опций внутри раскрытой группы, счетчик элементов, цену товара и пустое состояние раскрытой группы.
- Система должна сохранять действие редактирования группы через кнопку `Редактировать группу`.
- Система должна сохранять открытие редактирования товара или опции при выборе строки товара внутри раскрытой группы.
- Система должна иметь автоматизированную регрессионную проверку, которая подтверждает табличную группировку, раскрытие группы, edit-flow группы и edit-flow товара на вкладке `Меню`.

### Scope Constraints

- Задача охватывает клиентскую реализацию списка групп каталога меню и регрессионное покрытие этого поведения.
- Задача охватывает документацию нового `ui-data-table` в UI-каталоге, если компонент добавляется.
- Изменение backend API, DTO, доменной валидации и серверных тестов находится вне области задачи.
- Изменение сценария создания групп опций через `Добавить группу` и флаг `Группа опций` находится вне области задачи.
- Изменение `.references/` находится вне области задачи.

### Safety Constraints

- Система должна сохранять текущее поведение route `/menu` и administrator-only guard.
- Система должна сохранять текущее поведение контракта `/backoffice/menu/*`, mapping ошибок `invalid-drink-size-model` и `invalid-option-group-rule`.
- Feature-specific компонент должен делегировать визуальный контракт таблицы компоненту `ui-data-table`.
- Новый UI primitive должен предоставлять минимальный типизированный props/slots/events контракт и инкапсулировать детали Vuetify внутри компонента.

## Зона ответственности

### Разрешенная зона правок

- `frontend/src/ui/`
- `frontend/src/components/menu-catalog/MenuCatalogCategoryList.vue`
- `frontend/src/components/menu-catalog/`, если для интеграции таблицы нужен локальный вспомогательный компонент без transport logic.
- `frontend/src/views/MenuCatalogView.vue`, если требуется только подключение нового контракта списка без изменения route-level поведения.
- `e2e/menu-catalog/`
- `docs/architecture/frontend-ui-kit.md`
- `docs/architecture/application-map/frontend-backoffice.md`, если добавление `ui-data-table` меняет карту UI primitives.

### Запрещенная зона правок

- `backend/`
- `docs/system/contracts/`
- `docs/system/domain-model/`
- `docs/system/use-cases/`
- `frontend/src/modules/menu-catalog/api.ts`
- `frontend/src/modules/auth/`
- `frontend/src/router/`
- `.references/`
- Соседние экраны `orders`, `availability`, `users`, `settings`.

## Маршрут чтения

- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/frontend-ui-kit.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/qa-menu-catalog.md`
- `frontend/src/ui/README.md`
- `https://vuetifyjs.com/en/components/data-tables/basics/`

## Справочные ссылки

- `frontend/src/components/menu-catalog/MenuCatalogCategoryList.vue`
- `e2e/menu-catalog/admin-menu-catalog-save.spec.ts`
- `e2e/menu-catalog/admin-menu-catalog-validation.spec.ts`

## Результат готовности

`/menu` показывает группы меню и группы опций как сгруппированную таблицу через `ui-data-table`, существующие действия раскрытия и редактирования работают, а регрессионные проверки фиксируют табличную группировку и основные edit-flow сценарии.

## Проверки

- `npm run lint:frontend`
- `npm run stylelint:frontend`
- `npm run format:check:frontend`
- `npm run typecheck:frontend`
- `npm run test:frontend`
- `npm run build:frontend`
- `npm run test:e2e -- menu-catalog/admin-menu-catalog-save.spec.ts menu-catalog/admin-menu-catalog-validation.spec.ts`
- Ручная проверка `/menu`: обычная группа и группа опций отображаются в сгруппированной таблице, группа раскрывается, товар внутри группы открывает форму редактирования, кнопка `Редактировать группу` открывает форму группы.

## Результат выполнения

`не заполнено`
