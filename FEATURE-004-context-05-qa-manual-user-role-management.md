# Шаблон контекстного пакета подзадачи

## Карточка контекста

- Исходная задача: `tasks/QA-001-feature-004-manual-user-role-management.md`
- Подзадача: `05 — manual QA acceptance`
- Роль исполнителя: `Тестирование`
- Зона ответственности: `QA evidence в назначенной задаче и связанные QA-артефакты`, `AR-007-execution-plan.md`
- Связанный план: `AR-007-execution-plan.md`

## Цель подзадачи

`Подтвердить manual acceptance FEATURE-004 по scenario IDs FTS-004-001..FTS-004-009 и зафиксировать defects либо явное отсутствие отклонений.`

## Поведенческий промпт исполнителя

```text
You operate as QA.

Complete only the manual QA subtask within the source task AR-007.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `tasks/QA-001-feature-004-manual-user-role-management.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`
- `FEATURE-004-context-05-qa-manual-user-role-management.md`

## Ключевые факты из источников

- `feature-004-administrator-user-role-management.test-scenarios.md`: mandatory manual lane покрывает `FTS-004-001` ... `FTS-004-009`.
- `qa-standards.md`: manual QA обязана проверять UI parity относительно `.references` для UI-фич и фиксировать defects через `BUG-*`, если контур причины ясен.
- `feature-004-administrator-user-role-management.md`: successful assignment `administrator` допустим только для `BootstrapAdministrator`.
- `backoffice-ui-binding.md`: users screen визуально соседствует с block/unblock, но QA route этой фичи не должен расширять scope до этих операций.
- `user-role-and-blocking-management.md`: negative and guard paths обязаны оставаться явно проверяемыми по contract-level errors.

## Разрешенная зона правок

- `tasks/QA-001-feature-004-manual-user-role-management.md`
- `AR-007-execution-plan.md`
- `tasks/BUG-*.md` при необходимости и только если дефект воспроизводим и контур причины ясен

## Запрещенная зона правок

- `frontend/src/**`
- `backend/src/**`
- `e2e/**`
- `docs/system/**`
- `docs/architecture/**`
- `.references/**`

## Входы и зависимости

- `Вход`: завершенные шаги 1-4 плана и доступная собранная feature.
- `Выход`: manual QA evidence и defects при необходимости.

## Ожидаемый результат

`Manual acceptance по FTS-004-001..FTS-004-009 зафиксирован, UI parity проверен, scope boundary подтвержден, defects оформлены или явно отсутствуют.`

## Проверки

- `Ручной проход FTS-004-001`
- `Ручной проход FTS-004-002`
- `Ручной проход FTS-004-003`
- `Ручной проход FTS-004-004`
- `Ручной проход FTS-004-005`
- `Ручной проход FTS-004-006`
- `Ручной проход FTS-004-007`
- `Ручной проход FTS-004-008`
- `Ручной проход FTS-004-009`

## Критерии готовности

- `Все mandatory manual scenarios имеют результат pass или оформленный defect/blocker.`
- `QA evidence не расширяет scope FEATURE-004 до block_user или unblock_user.`
- `AR-007-execution-plan.md` обновлен: шаг 5 имеет статус `done`.

## Риски и запреты

- `Риск`: UI reference может спровоцировать неверное acceptance соседних действий на users screen.
- `Запрет`: нельзя принимать expected behavior по production-коду вместо системных артефактов.

## Открытые вопросы

- `нет`
