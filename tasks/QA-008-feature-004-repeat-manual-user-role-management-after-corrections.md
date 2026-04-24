# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-008`
- Родительская задача: `FEATURE-004`
- Заголовок: `Ручное ретестирование FEATURE-004 после корректировок QA-001`
- Описание: `Нужно повторно выполнить manual QA FEATURE-004 после закрытия corrective tasks по итогам QA-001: runtime/test-data preconditions, UI parity диалога и missing context package/read set. Ретест должен подтвердить FTS-004-002, FTS-004-004, FTS-004-006 и FTS-004-008, перепроверить ранее passed сценарии FTS-004-001, FTS-004-003, FTS-004-005, FTS-004-007 и FTS-004-009 на отсутствие регрессии и обновить итоговый acceptance decision.`
- Единица поставки: `FEATURE-004`
- Роль: `Тестирование`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`, `QA-001-evidence.md`, `tasks/BUG-003-feature-004-user-role-dialog-ui-parity.md`, `tasks/DO-011-feature-004-test-e2e-role-management-preconditions.md`, `tasks/SA-003-feature-004-restore-manual-qa-context-package.md`

## Примечания

- Зависимости: `BUG-003`, `DO-011`, `SA-003`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`, `QA-001-evidence.md`
- Ожидаемый результат для ревью: `Manual QA evidence обновлена после корректировок; mandatory scenarios FTS-004-001..FTS-004-009 имеют pass либо воспроизводимые BUG-*; final QA decision больше не остается blocked из-за прежних runtime/read-set blockers.`
- Проверки: `Ручной проход FTS-004-001, FTS-004-002, FTS-004-003, FTS-004-004, FTS-004-005, FTS-004-006, FTS-004-007, FTS-004-008, FTS-004-009`, `UI parity users screen и role assignment dialog относительно .references`, `проверка закрытия QA-001-BLOCKER-002..QA-001-BLOCKER-005`, `фиксация BUG-* по новым воспроизводимым отклонениям или явная запись об их отсутствии`
- Обновление карты приложения: `Не требуется`
- Критерии готовности: `Все mandatory manual scenarios из feature test scenarios document пройдены или заведены как defects/blockers с владельцами; success path administrator подтвержден только для BootstrapAdministrator; QA evidence не расширяет scope до block/unblock user`
