# QA Standards

## Базовый стандарт

- Каждая `FEATURE-*` должна иметь `QA-*` задачу.
- E2e-проверки фиксируются на уровне feature, а unit/integration evidence собирается из соответствующих FE/BE задач.
- Negative paths доступа обязательны для features, связанных с авторизацией и ролями.

## Для FEATURE-001

Подробная карта проверок входа administrator находится в `docs/architecture/application-map/qa-access.md`.

## Для FEATURE-002

Подробная карта проверок управления каталогом меню находится в `docs/architecture/application-map/qa-menu-catalog.md`.

## Acceptance рефакторинга качества кода

- QA принимает code style/code architecture рефакторинг только как поведенчески нейтральное изменение.
- Regression evidence для `FEATURE-006` должно покрывать уже поставленные сценарии `FEATURE-001` и `FEATURE-002`: Telegram/test-mode auth, server-driven actor/capabilities, forbidden screen, role-based navigation, menu catalog CRUD, validation errors и access denial.
- QA не восстанавливает expected behavior из production-кода. Источники истины: `docs/system/contracts/*`, `docs/system/use-cases/*`, `docs/system/ui-behavior-mapping/*` и профильные карты `docs/architecture/application-map/*`.
- Если после рефакторинга фактическое поведение отличается от system contract, результат считается regression defect, даже если новая реализация выглядит архитектурно чище.
- Если system contract неполон и не позволяет однозначно принять поведение, QA фиксирует blocker, а не утверждает новое правило по production-коду.

## Evidence и gates

- QA evidence для `FEATURE-006` должно включать результаты frontend/backend lint, format:check, typecheck, test, build и frontend stylelint либо ссылку на CI run, где эти gates выполнены.
- Regression evidence должно явно перечислять повторно пройденные проверки из `QA-001` и `QA-002`, а также любые новые checks, добавленные ради code quality gates.
- Для рефакторинга без изменения поведения достаточно focused regression по затронутым маршрутам и API, если контурные карты подтверждают, что contracts не изменялись.
- Smoke-check не заменяет e2e/integration checks для auth/capability и menu catalog behavior.
- Acceptance запрещён при открытых defects по auth/session bootstrap, capability denial, DTO shape, error mapping, route access или сценариям управления каталогом меню.
