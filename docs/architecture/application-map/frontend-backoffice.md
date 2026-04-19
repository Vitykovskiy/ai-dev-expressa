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
- `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `AddCategoryDialog.tsx`, `EditCategoryDialog.tsx`, `AddProductDialog.tsx`, `EditProductDialog.tsx` и `MenuGuide.tsx` задают визуальный и поведенческий ориентир для вкладки `Меню`.
- Цвета, отступы и композиция берутся из UI-контракта и референса, но реализация должна быть на `Vue 3`/`Vuetify`.

## FEATURE-002 frontend implementation map

| Путь | Назначение |
|---|---|
| `frontend/src/views/MenuCatalogView.vue` | Экран `/menu`: категории, товары, цены, группы опций, опции и назначение групп опций на категории. |
| `frontend/src/components/menu-catalog/*.vue` | Feature-specific панели и диалоги каталога меню: список категорий, панель групп опций, формы категорий, товаров и групп опций. |
| `frontend/src/modules/menu-catalog/view-model.ts` | Form state, derived state и orchestration логика экрана меню без transport details. |
| `frontend/src/modules/menu-catalog/types.ts` | Клиентские типы consumer-facing contract `Manage menu catalog`. |
| `frontend/src/modules/menu-catalog/api.ts` | Client API boundary для `/backoffice/menu/*` с Telegram/test-mode headers из backoffice auth contract. |
| `frontend/src/modules/menu-catalog/store.ts` | Локальное состояние snapshot каталога и операции сохранения через backend contract. |
| `frontend/src/modules/menu-catalog/validation.ts`, `presentation.ts` | UI-валидация форм, mapping ошибок и presentation helpers без подмены backend validation. |

## Code architecture standard for FEATURE-006

- `MenuCatalogView.vue` является первым обязательным кандидатом на декомпозицию: view должен остаться route-level orchestration, а формы категорий, товаров, размеров, групп опций и повторяемые rows должны быть вынесены в компоненты или композиционные функции.
- Все новые и рефакторимые SFC в этом контуре используют порядок `template` -> `script` -> `style` и `<style scoped lang="scss">`.
- API calls к `/backoffice/menu/*`, Telegram/test-mode headers и transport error mapping остаются в `modules/menu-catalog/api.ts`; components не обращаются к backend напрямую.
- Изменение структуры компонентов не должно менять route `/menu`, administrator-only guard, forbidden screen behavior, request/response DTO или mapping ошибок `invalid-drink-size-model` и `invalid-option-group-rule`.
- Если декомпозиция добавляет новые постоянные components, composables или module files, эта карта обновляется в той же задаче.

## Handoff route for FEATURE-001

- Для входа в backoffice и route guard исполнитель читает `docs/system/contracts/backoffice-auth-and-capability-access.md`, затем `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, затем эту карту.
- Если в FEATURE-001 меняются route, auth state, client-side guard или frontend env/config, обновляется эта карта вместе с consumer-facing contract при изменении request/response boundary.

## Handoff route for FEATURE-002

- Для управления меню исполнитель читает `docs/system/contracts/menu-and-availability-management.md`, затем `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, затем эту карту.
- Frontend использует `/menu` как существующий administrator-only route и не добавляет новые top-level routes без обновления этой карты.
- Экран `Меню` должен поддержать категории, товары, базовые цены, размерные цены `S/M/L`, группы дополнительных опций, варианты опций и назначение групп на категории.
- Клиентская валидация не заменяет backend validation: неполная размерная модель напитка и неверное правило группы опций должны обрабатываться через contract `Manage menu catalog`.
- Оперативная доступность barista не входит в экран структурного управления каталогом этой feature.

## Запрещено в FEATURE-001

- Добавлять формы управления меню, слотами, ролями или блокировкой сверх заглушек/маршрутов, необходимых для role guard.
- Хардкодить `administrator` как постоянную роль в клиентском store.
