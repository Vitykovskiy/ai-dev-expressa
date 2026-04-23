# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-001`
- Родительская задача: `FEATURE-004`
- Заголовок: `Ручное тестирование FEATURE-004 Administrator User Role Management`
- Описание: `Нужно выполнить ручную приемку собранной фичи по sibling document сценариев тестирования, подтвердить пользовательский сценарий просмотра пользователей и назначения роли barista, проверить negative и guard paths, UI parity относительно .references и зафиксировать defect handoff при отклонениях. Задача отдельно подтверждает, что blocker назначения роли administrator остается открытым и что scope FEATURE-004 не расширяется до block_user или unblock_user.`
- Единица поставки: `FEATURE-004`
- Роль: `Тестирование`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`, `FEATURE-004-context-03-qa-coverage.md`

## Примечания

- Зависимости: `BE-001`, `FE-001`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`, `FEATURE-004-context-03-qa-coverage.md`
- Ожидаемый результат для ревью: `Ручной acceptance маршрут по scenario IDs FTS-004-001..FTS-004-008 завершен, UI parity и scope boundary подтверждены, воспроизводимые defects заведены как BUG-* либо явно подтверждено их отсутствие.`
- Проверки: `Ручной проход FTS-004-001, FTS-004-002, FTS-004-003, FTS-004-004, FTS-004-005, FTS-004-006, FTS-004-007, FTS-004-008`, `Сверка live UI с .references/Expressa_admin для users screen и dialog`, `Фиксация BUG-* по найденным отклонениям или явная запись об их отсутствии`
- Обновление карты приложения: `Не требуется`
- Критерии готовности: `Все mandatory manual scenarios из feature test scenarios document пройдены или зафиксированы как defects/blockers; blocker administrator-assignment-rule-unresolved подтвержден как открытый; QA evidence не расширяет scope фичи до block/unblock user`
