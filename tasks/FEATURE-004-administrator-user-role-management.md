# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-004`
- Родительская задача: `SPRINT-001`
- Заголовок: `Administrator назначает роли пользователям`
- Описание: `Нужно дать administrator законченный сценарий просмотра пользователей и назначения ролей barista или administrator с пересчётом доступа к вкладкам внутреннего административного контура. Фича не включает блокировку пользователя, разблокировку пользователя или изменение ролей customer.`
- Единица поставки: `FEATURE-004`
- Роль: `Тестирование`
- Приоритет: `Критический`
- Статус: `Ожидает тестирования`

## Ссылки на документы

- Feature package: `docs/system/feature-specs/feature-004-administrator-user-role-management/`, `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- Системные артефакты: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/use-cases/administrator-manage-users-and-roles.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`
- Контурная карта: `не требуется`
- Бизнес-артефакты: `docs/business/business-rules/access-and-roles.md`, `docs/business/scenarios/administrator-manage-users-and-roles.md`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`, `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx`, `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`

## Примечания

- Зависимости: `FEATURE-001`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management/behavior.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management/interfaces.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management/ui-behavior.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx`, `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`
- Ожидаемый результат для ревью: `Подготовлена архитектурная декомпозиция FEATURE-004: feature package остается в status ready-for-architecture; архитектурные карты фиксируют frontend/backend/QA handoff; назначение роли administrator ограничено главным administrator; созданы дочерние задачи AR-007, FE-007, BE-006, QA-008 и QA-009.`
- Проверки: `Feature package slices index.md, behavior.md, interfaces.md, ui-behavior.md и test-scenarios.md созданы в docs/system/feature-specs/feature-004-administrator-user-role-management; карточка FEATURE-004 ссылается на package root, index.md и test-scenarios.md; архитектурные карты docs/architecture/application-map/frontend-backoffice.md, docs/architecture/application-map/backend-access.md и docs/architecture/application-map/qa-access.md содержат handoff FEATURE-004; дочерние задачи AR-007, FE-007, BE-006, QA-008 и QA-009 созданы с parent link FEATURE-004, контурной картой, зоной ответственности, маршрутом чтения и проверками; DO-задача не требуется, потому что FEATURE-004 не меняет runtime variables, deployment route или smoke-check.`
- Дочерние задачи: `AR-007-feature-004-user-role-management-architecture-handoff.md`, `FE-007-administrator-user-role-management-ui.md`, `BE-006-administrator-user-role-management-backend.md`, `QA-008-manual-administrator-user-role-management.md`, `QA-009-e2e-administrator-user-role-management.md`
- Результат архитектурной декомпозиции: `2026-05-01 — обновлены архитектурные карты frontend/backend/QA, создан backend endpoint namespace /backoffice/user-management/users без конфликта с capability guard /backoffice/users, подготовлены FE/BE/manual QA/e2e QA child tasks.`
- Передача в тестирование: `2026-05-01 — AR-007, FE-007 и BE-006 имеют статус Выполнена; FEATURE-004 готова к manual QA и e2e QA.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если меняются модули пользователей, клиентские маршруты, серверные API, схемы хранения, общие типы или тестовый маршрут.`
- Критерии готовности: `Фича закрыта, когда назначение ролей работает по согласованным правилам доступа и дочерние AR/FE/BE/QA-* задачи завершены и проверены.`
- Блокер: `Отсутствует. Бизнес-правило AR-008 фиксирует, что главный administrator может назначать пользователей на роль administrator.`
