# Frontend Backoffice Application Map

## Граница

Клиентский backoffice для ролей `barista` и `administrator`, реализуемый на `Vue 3` и `Vuetify` с опорой на визуальный React-референс `.references/Expressa_admin`.

## Runtime contour

- Исходный код клиентского контура находится в `frontend/`.
- Локальный dev entrypoint: `frontend/` -> `npm run dev`.
- Сборка: `frontend/` -> `npm run build`.
- Тесты: `frontend/` -> `npm test`.

## Точки входа и маршруты

| Route | Назначение | Guard |
|---|---|---|
| `/entry-denied` | Отказ во входе без валидного Telegram entry | public screen |
| `/` | Заказы | `barista`, `administrator` |
| `/availability` | Доступность меню | `barista`, `administrator` |
| `/menu` | Управление меню | `administrator` |
| `/users` | Пользователи | `administrator` |
| `/settings` | Настройки слотов | `administrator` |
| `/forbidden` | Недостаточная роль при прямом переходе на запрещённый route | system guard |

## Auth boundary

- При открытии из служебного Telegram-бота frontend получает Telegram Web App init data и передаёт его backend-контуру для валидации.
- После успешной проверки frontend хранит только клиентское состояние сессии, необходимое для UI; источник истины по ролям остаётся на backend.
- Канонический consumer-facing contract для session bootstrap, capability guard, error mapping и test-mode ограничений находится в `docs/system/contracts/backoffice-auth-and-capability-access.md`; восстанавливать эти правила из `backend/src/*` нельзя.
- Без валидного Telegram-входа production UI не должен показывать рабочие экраны backoffice.
- В test environment допускается bypass только при серверно разрешённом `DISABLE_TG_AUTH=true`; frontend не включает этот режим самостоятельно.
- Для bootstrap session используется `POST /backoffice/auth/session`.
- Клиентский guard опирается на `AuthenticatedActor.capabilities`, полученные от backend, а не на локально вычисленную роль.

## Frontend config

- `VITE_BACKOFFICE_API_BASE_URL` — необязательный base URL backend API; по умолчанию используется тот же origin.
- `VITE_BACKOFFICE_TEST_TELEGRAM_ID` — локальный helper только для test-mode интеграции с backend при серверно разрешённом `DISABLE_TG_AUTH=true`; не является production fallback.

## Role navigation

- Для `barista` видимы только `Заказы` и `Доступность`.
- Для `administrator` видимы `Заказы`, `Доступность`, `Меню`, `Пользователи`, `Настройки`.
- Скрытие вкладки не заменяет route guard: прямой переход на запрещённый route должен вести на экран отказа или получать отказ от backend.

## Reference mapping

- `.references/Expressa_admin/src/app/routes.tsx` задаёт состав backoffice routes.
- `.references/Expressa_admin/src/app/RootLayout.tsx` задаёт общую layout-структуру.
- `.references/Expressa_admin/src/app/components/SideNav.tsx` и `TabBar.tsx` задают роль-зависимую навигацию.
- Цвета, отступы и композиция берутся из UI-контракта и референса, но реализация должна быть на `Vue 3`/`Vuetify`.

## Handoff route for FEATURE-001

- Для входа в backoffice и route guard исполнитель читает `docs/system/contracts/backoffice-auth-and-capability-access.md`, затем `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, затем эту карту.
- Если в FEATURE-001 меняются route, auth state, client-side guard или frontend env/config, обновляется эта карта вместе с consumer-facing contract при изменении request/response boundary.

## Запрещено в FEATURE-001

- Добавлять формы управления меню, слотами, ролями или блокировкой сверх заглушек/маршрутов, необходимых для role guard.
- Хардкодить `administrator` как постоянную роль в клиентском store.
