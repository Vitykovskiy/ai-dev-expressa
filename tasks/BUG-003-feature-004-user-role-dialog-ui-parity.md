# Карточка задачи

## Карточка задачи

- Идентификатор: `BUG-003`
- Родительская задача: `FEATURE-004`
- Заголовок: `frontend: Диалог назначения роли отличается от UI reference`
- Описание: `По итогам manual QA-001 зафиксировано отклонение live-диалога назначения роли на /users от канонического .references/Expressa_admin/src/app/components/AddUserDialog.tsx. Нужно привести диалог к согласованному UI parity или зафиксировать допустимое системное отличие в канонических артефактах до повторной QA. Задача не расширяет scope FEATURE-004 до block_user или unblock_user.`
- Единица поставки: `FEATURE-004`
- Роль: `Фронтенд`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`, `QA-001-evidence.md`

## Примечания

- Зависимости: `FE-001`, `QA-001`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/application-map/frontend-backoffice.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`, `QA-001-evidence.md`
- Ожидаемый результат для ревью: `Диалог /users соответствует каноническому UI reference по title, description, required fields, role select, confirm/ghost buttons, visual states и component pattern либо канонические system artifacts явно фиксируют допустимое отличие existing-user role assignment model.`
- Проверки: `npm --prefix frontend run lint`, `npm --prefix frontend run stylelint`, `npm --prefix frontend run format:check`, `npm --prefix frontend run typecheck`, `npm --prefix frontend test`, `npm --prefix frontend run build`, `ручная сверка UI parity по QA-001-evidence.md`
- Обновление карты приложения: `docs/architecture/application-map/frontend-backoffice.md обновляется, если выбранное исправление меняет frontend implementation map или допустимую модель диалога; индекс карт не требуется`
- Критерии готовности: `QA может повторно проверить dialog parity без открытого deviation-recorded по AddUserDialog; поведение назначения роли остается в границах FEATURE-004 и использует server-driven availableRoleAssignments`

## Результат выполнения

- Дата проверки: `2026-04-25`
- Результат: `Диалог /users соответствует каноническому AddUserDialog по title, description, editable required fields, role select, primary confirm button, ghost cancel button и использует тот же dialog component pattern без отдельного selector Пользователь из QA-001 deviation.`
- Системное отличие: `Роль остается server-driven через availableRoleAssignments выбранного существующего пользователя; это соответствует FEATURE-004 и frontend implementation map, а scope остается в границах role assignment.`
- Ручная сверка UI parity: `выполнена по QA-001-evidence.md, .references/Expressa_admin/src/app/components/AddUserDialog.tsx и frontend/src/components/user-management/UserRoleAssignmentDialog.vue; deviation-recorded по AddUserDialog снят.`
- Проверки:
  - `npm --prefix frontend run lint`: `pass`
  - `npm --prefix frontend run stylelint`: `pass`
  - `npm --prefix frontend run format:check`: `pass`
  - `npm --prefix frontend run typecheck`: `pass`
  - `npm --prefix frontend test`: `pass, 16 files / 76 tests`
  - `npm --prefix frontend run build`: `pass`
- Примечание к проверкам: `перед финальным format:check удалены локальные ignored artifacts frontend/playwright-report и frontend/test-results; это локальные output-директории browser test run вне исходного кода.`
