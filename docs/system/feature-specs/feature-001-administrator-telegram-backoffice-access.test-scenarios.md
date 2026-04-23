# Feature Test Scenarios: FEATURE-001 Administrator Telegram Backoffice Access

## Карточка документа

- Feature: `FEATURE-001`
- Feature spec: `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.md`
- Статус сценариев: `ready-for-architecture`
- Источники: `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/routes.tsx`, `.references/Expressa_admin/src/app/RootLayout.tsx`, `.references/Expressa_admin/src/app/components/SideNav.tsx`, `.references/Expressa_admin/src/app/components/TabBar.tsx`
- Последняя проверка согласованности: `2026-04-23`

## Coverage Matrix

| Scenario ID   | Название                                                   | Тип           | Manual QA  | E2E QA     | Приоритет  | Источник                                                   |
| ------------- | ---------------------------------------------------------- | ------------- | ---------- | ---------- | ---------- | ---------------------------------------------------------- |
| `FTS-001-001` | Telegram bootstrap creates administrator session           | `main`        | `required` | `required` | `critical` | `feature spec`, `backoffice-auth-and-capability-access.md` |
| `FTS-001-002` | Test-mode bootstrap is available only in test environment  | `alternative` | `required` | `required` | `high`     | `feature spec`, `backoffice-auth-and-capability-access.md` |
| `FTS-001-003` | Visible tabs are derived from backend capabilities         | `main`        | `required` | `required` | `critical` | `feature spec`, `backoffice-ui-binding.md`                 |
| `FTS-001-004` | Direct route without capability resolves to forbidden      | `guard`       | `required` | `required` | `critical` | `feature spec`, `backoffice-ui-binding.md`                 |
| `FTS-001-005` | Missing or invalid Telegram entry resolves to entry-denied | `negative`    | `required` | `required` | `critical` | `feature spec`, `backoffice-auth-and-capability-access.md` |
| `FTS-001-006` | Blocked or roleless user cannot reach the working shell    | `negative`    | `required` | `required` | `critical` | `feature spec`, `backoffice-auth-and-capability-access.md` |
| `FTS-001-007` | Repeated bootstrap preserves the same authenticated actor  | `regression`  | `required` | `optional` | `medium`   | `feature spec`, `backoffice-auth-and-capability-access.md` |

## Сценарии

### `FTS-001-001` - Telegram bootstrap creates administrator session

- Цель: подтвердить, что допустимый Telegram entry создает рабочую backoffice session для `administrator`.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `.references/Expressa_admin/src/app/routes.tsx`
- Предусловия: пользователь открыт из service Telegram bot; Telegram init data доступен; backend auth contract активен.
- Тестовые данные: подписанный Telegram `initData` для `ADMIN_TELEGRAM_ID`.
- Шаги:
  1. Открыть service Telegram WebApp.
  2. Выполнить bootstrap session.
  3. Дождаться получения `AuthenticatedActor`.
- Ожидаемый результат:
  1. Система должна вернуть `roles` и `capabilities` для `administrator`.
  2. Система должна отобразить рабочий backoffice shell.
  3. Система должна показать вкладки `Заказы`, `Доступность`, `Меню`, `Пользователи`, `Настройки`.
- Проверяемые инварианты:
  - AuthenticatedActor хранит server-side derived roles и capabilities.
  - Система должна удерживать рабочий shell скрытым до завершения bootstrap.
- E2E mapping:
  - Test file: `backend/test/backoffice-entry.integration.spec.ts`
  - Test title / ID: `FTS-001-001 administrator bootstrap via Telegram`
  - Required assertions: `проверка 201 response, проверка roles/capabilities, проверка visible tabs after bootstrap`

### `FTS-001-002` - Test-mode bootstrap is available only in test environment

- Цель: подтвердить, что test-mode bypass разрешен только при server-side test configuration.
- Тип: `alternative`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/architecture/application-map/backend-access.md`
- Предусловия: backend работает в test environment; `DISABLE_TG_AUTH=true`.
- Тестовые данные: `testTelegramId=1001` или fallback `ADMIN_TELEGRAM_ID`.
- Шаги:
  1. Открыть backoffice в test environment без Telegram init data.
  2. Выполнить bootstrap session через разрешенный test-mode input.
- Ожидаемый результат:
  1. Система должна вернуть рабочую session.
  2. Система должна вернуть тот же набор capabilities, что и для administrator entry.
  3. Система должна отклонить тот же сценарий в production-like режиме.
- Проверяемые инварианты:
  - Test-mode bypass определяется server-side configuration.
  - Test-mode bypass зависит от server-side configuration.
- E2E mapping:
  - Test file: `backend/test/backoffice-auth.spec.ts`
  - Test title / ID: `FTS-001-002 test-mode bootstrap`
  - Required assertions: `проверка test environment success, проверка production-like rejection, проверка actor shape`

### `FTS-001-003` - Visible tabs are derived from backend capabilities

- Цель: подтвердить, что роль пользователя определяет только разрешенные вкладки.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/components/TabBar.tsx`
- Предусловия: session bootstrap завершен.
- Тестовые данные: `administrator` capabilities и `barista` capabilities.
- Шаги:
  1. Выполнить bootstrap для `administrator`.
  2. Считать список visible tabs.
  3. Выполнить bootstrap для `barista`.
  4. Считать список visible tabs.
- Ожидаемый результат:
  1. Система должна показать 5 вкладок для `administrator`.
  2. Система должна показать только `orders` и `availability` для `barista`.
  3. Система должна скрыть недоступные tabs вместо показа disabled рабочего UI.
- Проверяемые инварианты:
  - Видимость tabs совпадает с `AuthenticatedActor.capabilities`.
  - Бариста не получает административные tabs.
- E2E mapping:
  - Test file: `frontend/src/modules/navigation/tabs.spec.ts`
  - Test title / ID: `FTS-001-003 role aware tab visibility`
  - Required assertions: `administrator tab count, barista tab set, hidden tabs are absent`

### `FTS-001-004` - Direct route without capability resolves to forbidden

- Цель: подтвердить, что direct route access требует capability guard.
- Тип: `guard`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`
- Предусловия: user session существует; capability `menu` или `settings` недоступна текущей роли.
- Тестовые данные: `barista` actor и route `/menu`, `/users` или `/settings`.
- Шаги:
  1. Открыть backoffice с ролью `barista`.
  2. Перейти на запрещенный route напрямую.
- Ожидаемый результат:
  1. Система должна направить пользователя в `forbidden`.
  2. Система должна показывать `forbidden` вместо рабочего экрана запрещенной capability.
- Проверяемые инварианты:
  - Route guard и navigation tabs используют одну и ту же capability matrix.
  - Forbidden state отличается от entry-denied state.
- E2E mapping:
  - Test file: `frontend/src/router/guards.spec.ts`
  - Test title / ID: `FTS-001-004 forbidden direct route`
  - Required assertions: `barista redirected to forbidden, administrator allowed, unauthenticated redirected to entry-denied`

### `FTS-001-005` - Missing or invalid Telegram entry resolves to entry-denied

- Цель: подтвердить, что рабочий UI не открывается без допустимого Telegram entry.
- Тип: `negative`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Предусловия: production-like mode активен; valid Telegram init data отсутствует или поврежден.
- Тестовые данные: пустой request body, invalid hash, отсутствующий service token.
- Шаги:
  1. Открыть production-like backoffice URL без Telegram entry.
  2. Отправить bootstrap request без `initData`.
  3. Отправить bootstrap request с поврежденной подписью.
- Ожидаемый результат:
  1. Система должна вернуть `entry-denied`.
  2. Система должна показывать `entry-denied` вместо рабочих вкладок.
  3. Система должна сохранять защищенное состояние до нового допустимого входа.
- Проверяемые инварианты:
  - Production-like entry требует Telegram proof.
  - Entry-denied отличается от forbidden.
- E2E mapping:
  - Test file: `frontend/src/modules/auth/session-api.spec.ts`
  - Test title / ID: `FTS-001-005 invalid Telegram entry`
  - Required assertions: `missing initData maps to 401/entry-denied, invalid hash maps to 401/entry-denied, working shell stays hidden`

### `FTS-001-006` - Blocked or roleless user cannot reach the working shell

- Цель: подтвердить, что blocked user и пользователь без backoffice role не получают рабочий UI.
- Тип: `negative`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`
- Предусловия: пользователь существует в системе; blocked state или отсутствие backoffice capability зафиксированы на backend.
- Тестовые данные: blocked user, customer-only user.
- Шаги:
  1. Выполнить bootstrap для blocked user.
  2. Выполнить bootstrap для customer-only user.
- Ожидаемый результат:
  1. Система должна вернуть отказ для blocked user.
  2. Система должна вернуть отказ для user without backoffice capability.
  3. Система должна показывать `entry-denied` вместо рабочего shell.
- Проверяемые инварианты:
  - Blocked state запрещает backoffice access.
  - Backoffice access требует хотя бы одной backoffice capability.
- E2E mapping:
  - Test file: `backend/test/backoffice-auth.spec.ts`
  - Test title / ID: `FTS-001-006 blocked or roleless user denied`
  - Required assertions: `blocked user rejected, customer user rejected, response does not expose working shell payload`

### `FTS-001-007` - Repeated bootstrap preserves the same authenticated actor

- Цель: подтвердить idempotent behavior для повторного запуска bootstrap с тем же допустимым входом.
- Тип: `regression`
- Покрытие: `Manual QA: required; E2E QA: optional`
- Источники: `feature spec`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/domain-model/identity-and-access.md`
- Предусловия: допустимый Telegram entry доступен дважды подряд.
- Тестовые данные: один и тот же `ADMIN_TELEGRAM_ID` или signed init data.
- Шаги:
  1. Выполнить bootstrap session.
  2. Повторить bootstrap session с тем же входом.
- Ожидаемый результат:
  1. Система должна вернуть тот же `telegramId` и тот же набор capabilities.
  2. Система должна возвращать тот же user record и ту же capability matrix при повторном bootstrap.
- Проверяемые инварианты:
  - Повторный bootstrap остается idempotent.
  - Повторный bootstrap не меняет capability matrix.
- E2E mapping:
  - Test file: `backend/test/bootstrap-administrator.spec.ts`
  - Test title / ID: `FTS-001-007 idempotent administrator bootstrap`
  - Required assertions: `same admin user after repeated bootstrap, no duplicate record, same capabilities`

## Правила покрытия

- Каждый сценарий получает стабильный `Scenario ID`.
- Manual QA и E2E QA ссылаются на `Scenario ID` в evidence.
- E2E mapping фиксирует тестовый файл, название проверки и обязательные assertions.
- Сценарий с `E2E QA: required` считается покрытым только после появления автоматизированной проверки с assertions из этого документа.
- Сценарий с `Manual QA: required` считается покрытым только после записи результата в QA evidence.

## Scope Constraints

- Один документ покрывает одну `FEATURE-*`.
- Сценарии описывают проверяемое поведение backoffice entry, bootstrap и guard matrix.
- Manual evidence хранится в QA задаче или QA evidence, а этот документ хранит canonical route проверки.

## Safety Constraints

- Ожидаемые результаты сценариев сохраняют смысл feature spec, contract и UI behavior mapping.
- Ослабление assertions требует предварительного обновления сценария через системную аналитику.
- Закрытие QA coverage для сценариев с `E2E QA: required` требует соответствия automated coverage mapping этому документу.
