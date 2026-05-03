# Карточка задачи

## Карточка задачи

- Идентификатор: `BUG-007`
- Родительская задача: `FEATURE-004`
- Заголовок: `Список пользователей должен показывать фильтры и меню действий по прототипу`
- Единица поставки: `FEATURE-004`
- Роль: `Фронтенд`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Цель

`Исправить воспроизводимое frontend-расхождение вкладки Пользователи: фильтры должны соответствовать размерам прототипа, строки пользователей должны иметь видимую кнопку выпадающего меню, а список должен быть собран через табличный UI-паттерн.`

## Детали дефекта

- Контур причины: `frontend`.
- Затронутые сценарии: `F004-SC-001`, `F004-SC-002`, `F004-SC-003`, `F004-SC-008`.
- Шаги воспроизведения:
  1. Открыть вкладку `Пользователи`.
  2. Сравнить кнопки фильтров `Все`, `Баристы`, `Заблокированные` с `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`.
  3. Проверить правую часть каждой строки пользователя.
  4. Проверить реализацию `frontend/src/components/users/UsersList.vue`.
- Фактический результат: кнопки фильтров отображаются с размерами, отличающимися от прототипа; в строках пользователей видна пустая правая область вместо кнопки выпадающего меню; `UsersList.vue` собирает строки через `div` внутри `ui-section-card`.
- Ожидаемый результат: фильтры отображаются как pill-кнопки по прототипу; каждая строка пользователя показывает видимую кнопку `MoreVertical` для `UserActionsMenu`; список пользователей реализован через канонический табличный UI-паттерн `ui-data-table` или через явно зафиксированное штатное табличное решение поверх `Vuetify`.

## Границы задачи

### Функциональные требования

- Система должна отображать фильтры вкладки `Пользователи` с размерами, отступами и состояниями из `.references/Expressa_admin`.
- Система должна отображать видимую кнопку выпадающего меню действий в каждой строке пользователя.
- Система должна открывать существующее меню действий пользователя через кнопку в строке.
- Система должна отображать список пользователей через `ui-data-table` или штатный табличный компонент, согласованный с `frontend/src/ui/README.md`.
- Система должна сохранять поиск, фильтрацию, аватар, имя, Telegram-метку, роль и статус пользователя.
- Система должна сохранять существующий сценарий `Назначить роль` и открытие `AssignRoleDialog`.

### Scope Constraints

- Задача охватывает только клиентскую реализацию вкладки `Пользователи`.
- Задача охватывает визуальное соответствие фильтров, строк списка и кнопки меню действий.
- Задача охватывает только уже предусмотренные действия меню в рамках `FEATURE-004`.

### Safety Constraints

- Система должна сохранять операции блокировки, разблокировки и снятия роли вне исполняемого поведения `FEATURE-004`.
- Система должна сохранять route `/users` и administrator-only guard.
- Система должна сохранять backend-owned source of truth для ролей, статусов и capabilities.

## Зона ответственности

### Разрешенная зона правок

- `frontend/src/views/UsersView.vue`
- `frontend/src/components/users/UsersFilterTabs.vue`
- `frontend/src/components/users/UsersList.vue`
- `frontend/src/components/users/UserActionsMenu.vue`
- `frontend/src/ui/UiDataTable.vue`, если для списка пользователей требуется расширить существующий typed contract без нарушения текущего меню
- `frontend/src/components/users/*.spec.ts`, если потребуется добавить точечный тест
- `frontend/src/modules/users/*.spec.ts`, если потребуется обновить существующие тесты клиентской части

### Запрещенная зона правок

- `backend/**`
- `e2e/**`
- `docs/system/**`
- `docs/business/**`
- `.references/**`
- Deployment/runtime configuration

## Маршрут чтения

- `docs/system/feature-specs/feature-004-administrator-user-role-management/ui-behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`
- `frontend/src/ui/README.md`

## Справочные ссылки

- `frontend/src/components/users/UsersList.vue` — текущая реализация списка.
- `frontend/src/ui/UiDataTable.vue` — существующий табличный primitive.

## Результат готовности

`Вкладка Пользователи показывает фильтры, табличный список и кнопку меню действий в каждой строке по визуальному контракту .references/Expressa_admin; назначение роли через меню остается доступным.`

## Проверки

- Вручную открыть `/users` и сравнить фильтры `Все`, `Баристы`, `Заблокированные` с `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`.
- Вручную проверить, что каждая строка пользователя показывает кнопку `MoreVertical`.
- Вручную открыть меню действий пользователя и выбрать `Назначить роль`.
- Проверить `F004-SC-001`, `F004-SC-002`, `F004-SC-003`, `F004-SC-008`.
- `npm run test:frontend`
- `npm run typecheck:frontend`

## Результат выполнения

`не заполнено`
