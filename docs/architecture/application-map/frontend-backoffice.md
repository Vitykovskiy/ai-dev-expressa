# Frontend Backoffice Application Map

## Граница

Клиентский backoffice для ролей `barista` и `administrator`, реализуемый на `Vue 3` и `Vuetify` с опорой на визуальный React-референс `.references/Expressa_admin`.

## Точки входа и маршруты

| Route | Назначение | Guard |
|---|---|---|
| `/` | Заказы | `barista`, `administrator` |
| `/availability` | Доступность меню | `barista`, `administrator` |
| `/menu` | Управление меню | `administrator` |
| `/users` | Пользователи | `administrator` |
| `/settings` | Настройки слотов | `administrator` |
| `/forbidden` или эквивалентный экран отказа | Недостаточная роль или прямой доступ без допустимого входа | system guard |

## Auth boundary

- При открытии из служебного Telegram-бота frontend получает Telegram Web App init data и передаёт его backend-контуру для валидации.
- После успешной проверки frontend хранит только клиентское состояние сессии, необходимое для UI; источник истины по ролям остаётся на backend.
- Без валидного Telegram-входа production UI не должен показывать рабочие экраны backoffice.
- В test environment допускается bypass только при серверно разрешённом `DISABLE_TG_AUTH=true`; frontend не включает этот режим самостоятельно.

## Role navigation

- Для `barista` видимы только `Заказы` и `Доступность`.
- Для `administrator` видимы `Заказы`, `Доступность`, `Меню`, `Пользователи`, `Настройки`.
- Скрытие вкладки не заменяет route guard: прямой переход на запрещённый route должен вести на экран отказа или получать отказ от backend.

## Reference mapping

- `.references/Expressa_admin/src/app/routes.tsx` задаёт состав backoffice routes.
- `.references/Expressa_admin/src/app/RootLayout.tsx` задаёт общую layout-структуру.
- `.references/Expressa_admin/src/app/components/SideNav.tsx` и `TabBar.tsx` задают роль-зависимую навигацию.
- Цвета, отступы и композиция берутся из UI-контракта и референса, но реализация должна быть на `Vue 3`/`Vuetify`.

## Запрещено в FEATURE-001

- Добавлять формы управления меню, слотами, ролями или блокировкой сверх заглушек/маршрутов, необходимых для role guard.
- Хардкодить `administrator` как постоянную роль в клиентском store.
