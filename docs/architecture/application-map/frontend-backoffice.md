# Frontend Backoffice Application Map

## Граница

Клиентский backoffice для ролей `barista` и `administrator`, реализуемый на `Vue 3` и `Vuetify` с опорой на визуальный React-референс `.references/Expressa_admin`.

## Runtime contour

- Исходный код клиентского контура находится в `frontend/`.
- Локальный dev entrypoint: `frontend/` -> `npm run dev`.
- Сборка: `frontend/` -> `npm run build`.
- Тесты: `frontend/` -> `npm test`.

## UI primitives boundary

- Канонический слой повторяемых backoffice primitives находится в `frontend/src/components/ui/`.
- `frontend/src/components/ui/README.md` является практическим каталогом компонентов, их props/slots/events и mapping на `.references/Expressa_admin`.
- `docs/architecture/frontend-ui-kit.md` фиксирует архитектурное правило: новый shell-wide или повторяемый visual pattern сначала добавляется в `components/ui/`, затем применяется в `views/` и `components/<feature>/`.
- Feature-specific код в `frontend/src/components/menu-catalog/` не должен заново определять top bar, navigation, section containers, dialog chrome, empty states или базовые action buttons.

## Точки входа и маршруты

| Route           | Назначение                                                  | Guard                      |
| --------------- | ----------------------------------------------------------- | -------------------------- |
| `/entry-denied` | Отказ во входе без валидного Telegram entry                 | public screen              |
| `/`             | Заказы                                                      | `barista`, `administrator` |
| `/availability` | Доступность меню                                            | `barista`, `administrator` |
| `/menu`         | Управление меню                                             | `administrator`            |
| `/users`        | Пользователи                                                | `administrator`            |
| `/settings`     | Настройки слотов                                            | `administrator`            |
| `/forbidden`    | Недостаточная роль при прямом переходе на запрещённый route | system guard               |

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
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `AssignRoleDialog.tsx` и `UserActionsMenu.tsx` задают визуальный и поведенческий ориентир для вкладки `Пользователи` и назначения ролей.
- Цвета, отступы и композиция берутся из UI-контракта и референса, но реализация должна быть на `Vue 3`/`Vuetify`.

## FEATURE-002 frontend implementation map

| Путь                                                                 | Назначение                                                                                                                                               |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/components/ui/*.vue`                                   | Канонические backoffice primitives поверх `Vuetify`: shell, buttons, dialogs, field wrappers, section containers, empty states и toggle/status patterns. |
| `frontend/src/views/MenuCatalogView.vue`                             | Экран `/menu`: категории, товары, цены, группы опций через флаг категории и назначение групп опций на категории.                                         |
| `frontend/src/components/menu-catalog/*.vue`                         | Feature-specific компоненты каталога меню: список категорий, формы категорий и товаров.                                                                  |
| `frontend/src/modules/menu-catalog/view-model.ts`                    | Form state, derived state и orchestration логика экрана меню без transport details.                                                                      |
| `frontend/src/modules/menu-catalog/types.ts`                         | Клиентские типы consumer-facing contract `Manage menu catalog`.                                                                                          |
| `frontend/src/modules/menu-catalog/api.ts`                           | Client API boundary для `/backoffice/menu/*` с Telegram/test-mode headers из backoffice auth contract.                                                   |
| `frontend/src/modules/menu-catalog/store.ts`                         | Локальное состояние snapshot каталога и операции сохранения через backend contract.                                                                      |
| `frontend/src/modules/menu-catalog/validation.ts`, `presentation.ts` | UI-валидация форм, mapping ошибок и presentation helpers без подмены backend validation.                                                                 |

## Code architecture standard for FEATURE-006

- `MenuCatalogView.vue` является первым обязательным кандидатом на декомпозицию: view должен остаться route-level orchestration, а формы категорий, товаров, размеров и повторяемые rows должны быть вынесены в компоненты или композиционные функции.
- Все новые и рефакторимые SFC в этом контуре используют порядок `template` -> `script` -> `style` и `<style scoped lang="scss">`.
- Повторяемые visual primitives для shell и menu flow выносятся в `frontend/src/components/ui/`; feature-компоненты собираются из `App*` компонентов и не дублируют их локальными стилями.
- API calls к `/backoffice/menu/*`, Telegram/test-mode headers и transport error mapping остаются в `modules/menu-catalog/api.ts`; components не обращаются к backend напрямую.
- Изменение структуры компонентов не должно менять route `/menu`, administrator-only guard, forbidden screen behavior, request/response DTO или mapping ошибок `invalid-drink-size-model` и `invalid-option-group-rule`.
- Если декомпозиция добавляет новые постоянные components, composables или module files, эта карта обновляется в той же задаче.

## Handoff route for FEATURE-001

- Для входа в backoffice и route guard исполнитель читает `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.md`, затем `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.test-scenarios.md`, затем `docs/system/contracts/backoffice-auth-and-capability-access.md`, затем `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, затем эту карту.
- Если в FEATURE-001 меняются route, auth state, client-side guard или frontend env/config, обновляется эта карта вместе с consumer-facing contract при изменении request/response boundary.

## Handoff route for FEATURE-002

- Для управления меню исполнитель читает `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`, затем `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`, затем `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, затем эту карту.
- Frontend использует `/menu` как существующий administrator-only route и не добавляет новые top-level routes без обновления этой карты.
- Экран `Меню` должен поддержать категории, товары, базовые цены, размерные цены `S/M/L`, группы дополнительных опций через toggle `Группа опций`, платные/бесплатные опции как товары внутри такой группы и назначение групп на категории через `Выбрать группу опций`.
- Отдельная route-level панель или отдельная кнопка `Добавить группу опций` не входит в канонический UI `FEATURE-002`, потому что `.references/Expressa_admin` задает сценарий через диалоги групп и товаров.
- Клиентская валидация не заменяет backend validation: неполная размерная модель напитка и неверное правило группы опций должны обрабатываться через contract `Manage menu catalog`.
- Оперативная доступность barista не входит в экран структурного управления каталогом этой feature.

## FEATURE-003 frontend implementation map

| Путь                                                                              | Назначение                                                                                                                       |
| --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/views/SettingsView.vue`                                             | Экран `/settings`: route-level orchestration чтения и сохранения рабочих часов и вместимости слотов для `administrator`.         |
| `frontend/src/components/slot-settings/*.vue`                                     | Feature-specific компоненты формы настроек слотов, validation state и success/error feedback без transport logic.                |
| `frontend/src/modules/slot-settings/api.ts`                                       | Client API boundary для чтения/сохранения настроек слотов и получения связанных данных по consumer-facing contract.              |
| `frontend/src/modules/slot-settings/store.ts`                                     | Локальное состояние текущих настроек, busy/error state и повторное чтение snapshot после сохранения.                             |
| `frontend/src/modules/slot-settings/types.ts`, `validation.ts`, `presentation.ts` | Клиентские типы, UI-валидация и mapping ошибок `invalid-working-hours` / `invalid-slot-capacity` без подмены backend validation. |

## Handoff route for FEATURE-003

- Для управления настройками слотов исполнитель читает `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, затем `docs/system/contracts/slot-settings-management.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, затем эту карту и `docs/architecture/application-map/backend-slot-settings.md`.
- Frontend использует существующий administrator-only route `/settings` и не добавляет новые top-level routes или альтернативные settings flow без обновления этой карты.
- Экран `Настройки` должен показывать текущие либо дефолтные значения, поддерживать loading/success/error/inline-validation states и сохранять administrator в контексте редактирования при ошибке сохранения.
- Клиентская форма не должна фиксировать `max=50` как каноническое системное правило только на основании `.references/Expressa_admin`; визуальный reference используется для parity, а контрактная валидация и результат сохранения приходят из backend.

## FEATURE-004 frontend implementation map

| Путь                                                              | Назначение                                                                                                                                                              |
| ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `frontend/src/views/UsersView.vue`                                | Экран `/users`: route-level orchestration чтения списка пользователей, фильтров, выбора пользователя и подтверждения назначения роли.                                   |
| `frontend/src/components/users/*.vue`                             | Feature-specific компоненты списка пользователей, меню действий и диалога назначения роли без transport logic и без операций блокировки.                                |
| `frontend/src/modules/users/api.ts`                               | Client API boundary для `GET /backoffice/user-management/users` и `PATCH /backoffice/user-management/users/:userId/role` с Telegram/test-mode headers из auth contract. |
| `frontend/src/modules/users/store.ts`                             | Локальное состояние списка, loading/success/error states и обновление строки пользователя после backend response.                                                       |
| `frontend/src/modules/users/types.ts`, `presentation.ts`          | Клиентские типы, mapping ролей/status badges, display labels и consumer-facing формы без подмены backend validation.                                                    |
| `frontend/src/modules/users/validation.ts`                        | Клиентская проверка допустимого выбора `barista` / `administrator`; backend validation и guard остаются source of truth.                                                |
| `frontend/src/router/index.ts`, `frontend/src/modules/navigation` | Подключение `UsersView` к существующему route `/users` без изменения capability `users` и без локального вычисления прав из UI-состояния.                               |

## Handoff route for FEATURE-004

- Для управления ролями пользователей исполнитель читает `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`, затем `behavior.md`, `interfaces.md`, `ui-behavior.md`, `test-scenarios.md`, затем эту карту, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx` и `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`.
- Frontend использует существующий administrator-only route `/users` и заменяет stub на users-flow без добавления новых top-level routes.
- Frontend получает users list и результат назначения роли только от backend identity/access boundary; локальный store не является source of truth для ролей, blocked state или capabilities.
- Frontend показывает `Назначить роль`, выбор `Бариста` и `Администратор`, success/error states и empty state по `.references`, но операции блокировки, разблокировки, создания пользователя и снятия роли `barista` остаются вне behavior scope FEATURE-004.
- Frontend должен отправлять `assignedRole=administrator` как обычный input выбора роли, а окончательный guard главного administrator должен выполняться backend.

## Запрещено в FEATURE-001

- Добавлять формы управления меню, слотами, ролями или блокировкой сверх заглушек/маршрутов, необходимых для role guard.
- Хардкодить `administrator` как постоянную роль в клиентском store.
