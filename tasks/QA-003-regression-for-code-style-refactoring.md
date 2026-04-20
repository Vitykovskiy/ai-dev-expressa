# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-003`
- Родительская задача: `FEATURE-006`
- Заголовок: `Проверить отсутствие регрессий после code style рефакторинга`
- Описание: `Нужно подтвердить, что архитектурная формализация, tooling/CI и frontend/backend рефакторинг не изменили поведение FEATURE-001 и FEATURE-002. QA принимает рефакторинг только при сохранении auth/capability behavior, menu catalog endpoint behavior и UI сценариев управления меню.`
- Единица поставки: `FEATURE-006`
- Роль: `Тестирование`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/devops-standards.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/application-map/qa-access.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`
- Контурная карта: `docs/architecture/application-map/qa-access.md`, `docs/architecture/application-map/qa-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `tasks/QA-001-administrator-telegram-backoffice-access.md`, `tasks/QA-002-administrator-menu-catalog-management.md`, `tasks/QA-005-e2e-administrator-menu-catalog-management.md`

## Примечания

- Зависимости: `DO-002`, `FE-003`, `BE-003`
- Минимальный read set: `docs/architecture/qa-standards.md`, `docs/architecture/devops-standards.md`, `docs/architecture/application-map/qa-access.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `tasks/QA-001-administrator-telegram-backoffice-access.md`, `tasks/QA-002-administrator-menu-catalog-management.md`, `tasks/QA-005-e2e-administrator-menu-catalog-management.md`
- Ожидаемый результат для ревью: `Есть regression evidence, что test-mode/Telegram auth, server-driven actor/capabilities, forbidden screen, role-based navigation, menu catalog CRUD, validation errors и access denial работают как до рефакторинга.`
- Проверки: `Повторить обязательные проверки QA-001, manual-проверки QA-002 и e2e-проверки QA-005; проверить frontend/backend lint, format:check, typecheck, test, build и frontend stylelint evidence; проверить, что CI quality gates отражают те же команды.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-access.md и docs/architecture/application-map/qa-menu-catalog.md, если добавляются или меняются regression/e2e маршруты, fixtures, smoke-checks или acceptance evidence.`
- Критерии готовности: `Задача завершена, когда FEATURE-006 может быть закрыта без открытых regression defects, а все новые quality gates имеют воспроизводимое evidence.`

## Результат выполнения

- Поведенческая регрессия по acceptance `FEATURE-001` и `FEATURE-002` не обнаружена.
- Повторно подтверждено regression evidence для сценариев `QA-001`, `QA-002` и `QA-005`:
  - Telegram/test-mode auth, server-driven `AuthenticatedActor`, role-based navigation, direct-route denial и экран `forbidden` покрыты текущими backend/frontend automated checks без изменения contract behavior.
  - Menu catalog CRUD, полный размерный набор `S/M/L`, ошибки `invalid-drink-size-model` и `invalid-option-group-rule`, а также capability denial для `menu` покрыты текущими backend/frontend automated checks без изменения endpoint boundary и DTO shape.
- Локально воспроизведён полный набор обязательных quality gates из `DO-002` и `docs/architecture/devops-standards.md`:
  - `cd backend && npm run lint` — успешно.
  - `cd backend && npm run format:check` — успешно.
  - `cd backend && npm run typecheck` — успешно.
  - `cd backend && npm test` — успешно, `10` test files / `29` tests passed.
  - `cd backend && npm run build` — успешно.
  - `cd frontend && npm run lint` — успешно.
  - `cd frontend && npm run stylelint` — успешно.
  - `cd frontend && npm run format:check` — успешно.
  - `cd frontend && npm run typecheck` — успешно.
  - `cd frontend && npm test` — успешно, `8` test files / `23` tests passed.
  - `cd frontend && npm run build` — успешно.
- CI parity подтверждён:
  - `.github/workflows/pr-checks.yml` содержит обязательные backend gates `lint`, `format:check`, `typecheck`, `test`, `build`.
  - `.github/workflows/pr-checks.yml` содержит обязательные frontend gates `lint`, `stylelint`, `format:check`, `typecheck`, `test`, `build`.
- Итог QA:
  - Блокирующие defect-классы из предыдущего прогона закрыты.
  - `QA-003` принят, `FEATURE-006` со стороны QA больше не имеет открытых regression blockers.
