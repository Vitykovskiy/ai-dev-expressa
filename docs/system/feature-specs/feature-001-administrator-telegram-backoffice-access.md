# Feature Spec: FEATURE-001 Administrator Telegram Backoffice Access

## Карточка документа

- Feature: `FEATURE-001`
- Parent sprint: `SPRINT-001`
- Feature spec: `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.md`
- Test scenarios: `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.test-scenarios.md`
- Status: `ready-for-architecture`
- Related roles: `Системный аналитик`, `Архитектор`, `Frontend`, `Backend`, `QA`
- Affected interfaces: `service Telegram entrypoint`, `POST /backoffice/auth/session`, `GET /backoffice/:capability`, `backoffice shell`, `entry-denied`, `forbidden`
- Last consistency check: `2026-04-23`

## Source Trace

### Business input

- `tasks/archive/FEATURE-001-administrator-telegram-backoffice-access.md`
- `tasks/archive/FE-001-administrator-backoffice-telegram-entry.md`
- `tasks/SA-003-close-feature-001-documentation-gaps-for-implementation-handoff.md`

### System sources

- `use-cases`: `n/a`
- `contracts`: `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `domain-model`: `docs/system/domain-model/identity-and-access.md`
- `state-models`: `n/a`
- `ui-behavior-mapping`: `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`

### UI sources

- `ui-contract`: `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `versioned design sources`: `.references/Expressa_admin/src/app/App.tsx`, `.references/Expressa_admin/src/app/RootLayout.tsx`, `.references/Expressa_admin/src/app/routes.tsx`, `.references/Expressa_admin/src/app/components/SideNav.tsx`, `.references/Expressa_admin/src/app/components/TabBar.tsx`
- `prototype verification status`: `verified`

## Feature Boundary

### Included scope

- Система должна восстанавливать `AuthenticatedActor` для backoffice только после допустимого Telegram entry или разрешенного test-mode входа.
- Система должна отображать рабочий backoffice shell только после успешного session bootstrap.
- Система должна показывать только те вкладки backoffice, которые разрешены backend capabilities текущего `AuthenticatedActor`.
- Система должна направлять прямой вход на route, для которого capability недоступна, в защищенное состояние `forbidden`.
- Система должна направлять вход без допустимого Telegram entry в защищенное состояние `entry-denied`.
- Система должна поддерживать test-mode вход только в test environment.

### Explicitly excluded scope

- Создание или изменение ролей пользователей.
- Блокировка пользователей.
- Управление меню, слотами, заказами или доступностью каталога.
- Хранение долгоживущей сессии вне request/response boundary, если оно не зафиксировано в contract.
- Вычисление ролей на клиенте вместо чтения backend capabilities.

### Business outcome

- Система должна восстанавливать backoffice-доступ только из серверно подтвержденного Telegram входа или разрешенного test-mode bypass, отображать рабочий UI только для разрешенных capabilities и скрывать либо блокировать недоступные рабочие поверхности.

### Dependencies

- `docs/system/domain-model/identity-and-access.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`
- `.references/Expressa_admin/src/app/routes.tsx`
- `.references/Expressa_admin/src/app/RootLayout.tsx`
- `.references/Expressa_admin/src/app/components/SideNav.tsx`
- `.references/Expressa_admin/src/app/components/TabBar.tsx`

## User Workflows

### Main workflow

1. Administrator открывает служебный Telegram bot и запускает backoffice WebApp.
2. Система получает Telegram Web App init data и передает его на `POST /backoffice/auth/session`.
3. Backend подтверждает вход, восстанавливает пользователя и возвращает `AuthenticatedActor` с roles и capabilities.
4. Frontend сохраняет session state и отображает backoffice shell.
5. Система показывает только разрешенные вкладки и рабочие route targets для текущего `AuthenticatedActor`.

### Alternative workflows

#### Test-mode bootstrap

1. Administrator открывает backoffice в test environment.
2. Система выполняет bootstrap session через разрешенный test-mode input.
3. Система отображает тот же рабочий shell и тот же набор capabilities, который соответствует backend decision.

#### Role-limited navigation

1. Пользователь с ролью `barista` открывает backoffice.
2. Система отображает только вкладки `Заказы` и `Доступность`.
3. Система направляет прямой вход на `menu`, `users` и `settings` в защищенное состояние `forbidden`.

### Exception workflows

#### Missing Telegram entry

1. Пользователь открывает production-like URL без допустимого Telegram entry.
2. Система возвращает `entry-denied`.
3. Система не показывает рабочий backoffice shell.

#### Invalid Telegram signature

1. Пользователь отправляет Telegram init data с недействительной подписью.
2. Система отклоняет bootstrap.
3. Система возвращает `entry-denied`.

#### Blocked user

1. Заблокированный пользователь инициирует bootstrap.
2. Система отклоняет вход.
3. Система возвращает `entry-denied`.

### System-relevant UI states

- Empty state: Система должна удерживать рабочий shell скрытым до завершения bootstrap session.
- Loading state: Система должна показывать состояние загрузки во время session bootstrap и блокировать переход к рабочим surfaces до получения `AuthenticatedActor`.
- Success state: Система должна показывать backoffice shell и вкладки, вычисленные из backend capabilities.
- Error state: Система должна показывать `entry-denied` или `forbidden` в зависимости от типа отказа.
- Disabled state: Система должна удерживать недоступные вкладки и действия неактивными для роли без соответствующей capability.
- Hidden state: Система должна скрывать вкладки, которых нет в `AuthenticatedActor.capabilities`.
- Guarded state: Система должна переводить прямой вход на запрещенный route в `forbidden`.
- Notification state: Система должна использовать уведомление только как вспомогательный результат успешного bootstrap или ошибки, а не как замену screen-level guard.

## Entity View

### Entities

- `User`
- `Role`
- `Capability`
- `AuthenticatedActor`
- `BackofficeSession`

### Relations

- `User` имеет один или несколько `Role`, которые backend использует для вычисления `Capability`.
- `AuthenticatedActor` является серверно подтвержденной проекцией `User` для backoffice UI.
- `BackofficeSession` содержит `AuthenticatedActor` и его capabilities для текущего UI state.

### Invariants

- Система должна получать roles и capabilities из backend decision, а не вычислять их на клиенте.
- Система должна использовать `ADMIN_TELEGRAM_ID` как источник bootstrap главного administrator.
- Система должна сохранять idempotent bootstrap для повторного запуска с тем же `ADMIN_TELEGRAM_ID`.
- Система должна считать blocked user недопустимым для backoffice access.

### Identity and ownership

- Источник истины для roles и blocked state находится в backend identity layer.
- Frontend владеет только текущим UI session state и derived navigation state.
- Telegram `telegramId` остается основным внешним идентификатором пользователя для этой feature.

## UI Element Action Sequence

### Screen or surface

- `backoffice shell`
- `entry-denied`
- `forbidden`

### Element-to-action mapping

| UI element                                               | User action                         | System reaction                                                                                     | Related source                                       |
| -------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `service Telegram entry`                                 | `open backoffice WebApp`            | Система должна получить init data и инициировать session bootstrap.                                 | `backoffice-auth-and-capability-access.md`           |
| `shell bootstrap`                                        | `application start`                 | Система должна выполнить bootstrap и дождаться `AuthenticatedActor` перед рендером рабочих вкладок. | `frontend-backoffice.md`, `backoffice-ui-binding.md` |
| `TabBar.orders / availability / menu / users / settings` | `select tab`                        | Система должна разрешить только вкладки, присутствующие в `AuthenticatedActor.capabilities`.        | `backoffice-ui-binding.md`                           |
| `route target`                                           | `direct URL entry`                  | Система должна проверить capability guard и показать `forbidden`, если capability недоступна.       | `backoffice-ui-binding.md`                           |
| `entry-denied surface`                                   | `open without valid Telegram entry` | Система должна показывать защищенное состояние без рабочих вкладок.                                 | `backoffice-auth-and-capability-access.md`           |
| `forbidden surface`                                      | `open forbidden route`              | Система должна показывать защищенное состояние для недоступной capability.                          | `backoffice-auth-and-capability-access.md`           |

### Interaction notes

- Система должна опираться на backend capabilities для видимости вкладок и для route guard.
- Система должна использовать одинаковое правило доступа для navigation и direct route entry.
- Система должна отделять отказ по отсутствию допустимого Telegram entry от отказа по недостаточной capability.

## Input Constraints

### Required inputs

- `initData` в Telegram mode.
- `testTelegramId` в разрешенном test-mode.

### Allowed values

- `initData` должен содержать Telegram Web App payload со signed hash.
- `testTelegramId` должен быть строковым Telegram identifier.

### Cross-field constraints

- Система должна принимать `testTelegramId` только при разрешенном server-side test-mode.
- Система должна использовать `initData` и `testTelegramId` как взаимно исключающие варианты входа для session bootstrap.
- Система должна применять один и тот же backend-derived capability set для видимости вкладок и прямых route checks.

### Boundary values

- Пустой request body.
- Отсутствующий `initData`.
- Недействительная подпись Telegram payload.
- Заблокированный пользователь.
- Пользователь без backoffice capability.

## Validations

### Field validations

- Система должна проверять наличие `initData` в Telegram mode.
- Система должна проверять формат `testTelegramId` в test-mode.
- Система должна проверять canonical capability names для route access.

### Business validations

- Система должна принимать только подписанный Telegram payload в production-like режиме.
- Система должна отклонять bootstrap для blocked user.
- Система должна отклонять bootstrap для пользователя без backoffice capability.

### Role or capability validations

- Система должна разрешать `barista` только к `orders` и `availability`.
- Система должна разрешать `administrator` к `orders`, `availability`, `menu`, `users` и `settings`.
- Система должна отклонять прямой вход на route, если capability отсутствует в `AuthenticatedActor.capabilities`.

## Errors

### User-facing errors

- `telegram-init-data-required` - Система должна показывать отказ при отсутствии Telegram init data.
- `telegram-bot-token-required` - Система должна показывать отказ при отсутствии server secret для Telegram validation.
- `telegram-hash-invalid` - Система должна показывать отказ при недействительной подписи Telegram payload.
- `backoffice-user-not-found` - Система должна показывать отказ, если Telegram user отсутствует в системе.
- `user-blocked` - Система должна показывать отказ, если пользователь заблокирован.
- `backoffice-role-required` - Система должна показывать отказ, если у пользователя нет backoffice capability.
- `backoffice-capability-not-found` - Система должна показывать отказ при неизвестной capability route.
- `backoffice-capability-forbidden` - Система должна показывать отказ при запрещенной capability.

### System errors

- Ошибка загрузки session endpoint - Система должна сохранять защищенное состояние вместо рабочего shell.
- Ошибка route guard - Система должна удерживать пользователя в `forbidden` или `entry-denied` в зависимости от причины отказа.

### Error mapping

| Condition                              | User-visible outcome                    | Source                                                                 |
| -------------------------------------- | --------------------------------------- | ---------------------------------------------------------------------- |
| `initData` отсутствует в Telegram mode | Система должна показать `entry-denied`. | `backoffice-auth-and-capability-access.md`                             |
| Telegram signature invalid             | Система должна показать `entry-denied`. | `backoffice-auth-and-capability-access.md`                             |
| user blocked                           | Система должна показать `entry-denied`. | `backoffice-auth-and-capability-access.md`                             |
| capability отсутствует                 | Система должна показать `forbidden`.    | `backoffice-auth-and-capability-access.md`, `backoffice-ui-binding.md` |

## Edge Cases

- Система должна сохранять один и тот же `AuthenticatedActor` при повторном bootstrap с тем же допустимым Telegram entry.
- Система должна скрывать вкладки, недоступные текущей роли, даже если route существует.
- Система должна показывать `forbidden` для прямого входа на route, который отсутствует в visible tabs.
- Система должна сохранять рабочий shell в защищенном состоянии до завершения повторного bootstrap после ошибки.

## Scope Constraints

- Система должна ограничивать feature только backoffice entry, session bootstrap, navigation visibility и direct-route guard.
- Система должна использовать существующий backoffice shell как единственную рабочую UI surface для этой feature.
- Система должна хранить определения tabs и route guards в рамках backend capabilities, а не локальной role inference.

## Safety Constraints

- Система должна скрывать рабочий UI до подтверждения `AuthenticatedActor`.
- Система должна запрещать производный client-side role decision как источник доступа.
- Система должна исключать production bypass без Telegram entry.
- Система должна сохранять separation between hidden tabs and forbidden routes.

## Prototype Completeness Audit

### Current prototype status

- `verified`

### Audit checklist

- `RootLayout` содержит shell-level container для backoffice.
- `TabBar` отражает role-aware navigation.
- `entry-denied` surface присутствует в route structure.
- `forbidden` surface присутствует в route structure.
- Direct-route guard присутствует для capability-aware navigation.

### Design gaps and required prototype corrections

- Gap: `n/a`
  - Required correction: `n/a`
  - Canonical source: `n/a`

### Repeated verification result

- `verified against current Git-tracked prototype`

## Blockers

- `Нет`

## Test Scenarios Link

- `Система должна ссылаться на sibling документ сценариев тестирования фичи: docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.test-scenarios.md.`

## Architecture Handoff Checklist

- `Система должна иметь явную feature boundary для Telegram entry и capability guard.`
- `Система должна иметь перечисленные user workflows для bootstrap, hidden tabs, forbidden routes и entry-denied.`
- `Система должна иметь UI interaction requirements для shell bootstrap, tab navigation и direct-route access.`
- `Система должна иметь input constraints, validations, errors и edge cases для session bootstrap.`
- `Система должна иметь explicit Scope Constraints и Safety Constraints.`
- `Система должна иметь sibling test scenarios document со stable scenario IDs и coverage mapping.`
- `Система должна иметь ссылки на canonical system sources и versioned design sources.`
- `Система должна быть готова к архитектурной декомпозиции без обращения к production code.`
