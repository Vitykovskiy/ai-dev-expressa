# Карточка задачи

## Карточка задачи

- Идентификатор: `BUG-010`
- Родительская задача: `SPRINT-001`
- Заголовок: `Вкладки администрирования не должны писать TypeError в консоль браузера`
- Единица поставки: `n/a`
- Роль: `Фронтенд`
- Метка контура причины: `frontend`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Цель

`Исправить воспроизводимую frontend runtime-ошибку на опубликованном стенде expressa-deploy: при открытии вкладок Меню, Пользователи и Настройки консоль браузера должна оставаться без TypeError, а соответствующие экраны должны сохранять текущее пользовательское поведение.`

## Детали дефекта

- Контур причины: `frontend`.
- Окружение воспроизведения: `https://expressa-deploy.vitykovskiy.ru`, desktop viewport `1440x900`, Chrome MCP, дата проверки `2026-05-03`.
- Затронутые маршруты: `/menu`, `/users`, `/settings`.
- Затронутые сценарии: `FTS-002-001`, `FTS-002-010`, `F004-SC-001`, `F004-SC-008`, `FTS-003-001`.
- Шаги воспроизведения:
  1. Открыть `https://expressa-deploy.vitykovskiy.ru`.
  2. Убедиться, что администратор видит вкладки `Заказы`, `Доступность`, `Меню`, `Пользователи`, `Настройки`.
  3. Открыть `https://expressa-deploy.vitykovskiy.ru/menu` или перейти на вкладку `Меню`.
  4. Проверить консоль браузера.
  5. Открыть `https://expressa-deploy.vitykovskiy.ru/users` или перейти на вкладку `Пользователи`.
  6. Проверить консоль браузера.
  7. Открыть `https://expressa-deploy.vitykovskiy.ru/settings` или перейти на вкладку `Настройки`.
  8. Проверить консоль браузера.
- Фактический результат:
  - `/menu`: экран загружается до состояния `Меню пусто`, API отвечает `POST /backoffice/auth/session [201]` и `GET /backoffice/menu/catalog [304]`, в консоли появляются 4 ошибки `TypeError: Cannot read properties of null (reading 'key')`.
  - `/users`: список пользователей загружается, API отвечает `POST /backoffice/auth/session [201]` и `GET /backoffice/user-management/users [304]`, в консоли появляются 2 ошибки `TypeError: Cannot read properties of null (reading 'key')`.
  - `/settings`: форма настроек загружается, API отвечает `POST /backoffice/auth/session [201]` и `GET /backoffice/settings/slot-settings [304]`, в консоли появляются 2 ошибки `TypeError: Cannot read properties of null (reading 'key')`.
  - Для `/users` дополнительно зафиксирован Chrome issue `An aria-labelledby attribute doesn't match any element id` на поле `Фильтр по имени или Telegram`.
- Ожидаемый результат: вкладки `Меню`, `Пользователи` и `Настройки` открываются без сообщений уровня `error` в консоли браузера; успешные ответы API не сопровождаются frontend runtime TypeError.

## Границы задачи

### Behavioral Requirements

- Система должна открывать вкладку `Меню` без `TypeError: Cannot read properties of null (reading 'key')` в консоли браузера.
- Система должна открывать вкладку `Пользователи` без `TypeError: Cannot read properties of null (reading 'key')` в консоли браузера.
- Система должна открывать вкладку `Настройки` без `TypeError: Cannot read properties of null (reading 'key')` в консоли браузера.
- Система должна сохранять route `/menu` и текущее поведение управления каталогом меню.
- Система должна сохранять route `/users` и текущее поведение списка пользователей и назначения ролей.
- Система должна сохранять route `/settings` и текущее поведение чтения и сохранения настроек слотов.
- Система должна сохранять role-based navigation и administrator-only guard для затронутых вкладок.

### Scope Constraints

- Задача охватывает только frontend runtime-ошибку консоли на вкладках `Меню`, `Пользователи` и `Настройки`.
- Задача охватывает общий UI-primitive или route-level компоненты только в части, необходимой для устранения `TypeError`.
- Задача не охватывает изменение backend API contracts.
- Задача не охватывает изменение runtime/env/deploy configuration.
- Задача не заменяет отдельные визуальные дефекты `BUG-008` и `BUG-009`.

### Safety Constraints

- Система должна сохранять public API contracts затронутых серверных endpoints.
- Система должна сохранять текущие validation и error mapping для каталога меню, пользователей и настроек слотов.
- Система должна сохранять backend-owned source of truth для ролей, статусов, capabilities и настроек.

## Зона ответственности

### Разрешенная зона правок

- `frontend/src/views/MenuCatalogView.vue`
- `frontend/src/views/UsersView.vue`
- `frontend/src/views/SettingsView.vue`
- `frontend/src/components/menu-catalog/**`
- `frontend/src/components/users/**`
- `frontend/src/components/slot-settings/**`
- `frontend/src/ui/**`
- `frontend/src/modules/navigation/**`, если источник ошибки находится в shell navigation rendering
- `frontend/src/**/*.spec.ts`, если требуется точечное покрытие frontend runtime или UI-primitive
- `tasks/BUG-010-backoffice-admin-routes-console-key-errors.md`

### Запрещенная зона правок

- `backend/**`
- `e2e/**`
- `.github/**`
- `scripts/**`
- `docs/system/**`
- `docs/business/**`
- `.references/**`
- runtime/env state и секреты стендов

## Маршрут чтения

- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`
- `frontend/src/ui/README.md`
- `tasks/QA-012-manual-full-regression-after-bugfixes.md`

## Справочные ссылки

- `tasks/BUG-008-settings-save-button-label-visible.md` — связанный визуальный дефект кнопки сохранения, не заменяется этой задачей.
- `tasks/BUG-009-menu-action-buttons-labels-visible.md` — связанный визуальный дефект кнопок меню, не заменяется этой задачей.

## Результат готовности

`Вкладки Меню, Пользователи и Настройки на published expressa-deploy route открываются без TypeError в консоли браузера; API-запросы остаются успешными, а текущее пользовательское поведение затронутых экранов сохранено.`

## Проверки

- Вручную открыть `https://expressa-deploy.vitykovskiy.ru/menu` и подтвердить отсутствие `TypeError: Cannot read properties of null (reading 'key')` в консоли браузера.
- Вручную открыть `https://expressa-deploy.vitykovskiy.ru/users` и подтвердить отсутствие `TypeError: Cannot read properties of null (reading 'key')` в консоли браузера.
- Вручную открыть `https://expressa-deploy.vitykovskiy.ru/settings` и подтвердить отсутствие `TypeError: Cannot read properties of null (reading 'key')` в консоли браузера.
- Проверить, что `POST /backoffice/auth/session`, `GET /backoffice/menu/catalog`, `GET /backoffice/user-management/users` и `GET /backoffice/settings/slot-settings` остаются успешными на published route.
- `npm run test:frontend`
- `npm run typecheck:frontend`

## Результат выполнения

`2026-05-04: исправлена frontend runtime-ошибка TypeError на маршрутах /menu, /users и /settings через корректную обработку null slot props в shared UI wrappers frontend/src/ui/**. Проверки: npm run test:frontend — passed; npm run typecheck:frontend — passed; local browser smoke для /menu, /users, /settings с API stubs — 0 console errors и 0 key TypeError.`
