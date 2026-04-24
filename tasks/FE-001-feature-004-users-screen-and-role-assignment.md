# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-001`
- Родительская задача: `FEATURE-004`
- Заголовок: `Экран Пользователи и сценарий назначения роли в backoffice`
- Описание: `Нужно реализовать клиентский сценарий просмотра пользователей и назначения роли в существующем route /users без добавления новых top-level routes. Задача охватывает loading, empty, search, filter, dialog, success и error states, вызовы GET /backoffice/users и PATCH /backoffice/users/{userId}/role, отображение availableRoleAssignments, inline validation обязательных полей и route-level поведение для capability users. Назначение роли administrator должно поддерживать success path для BootstrapAdministrator и server-driven guard/error path administrator-role-assignment-forbidden для обычного administrator без расширения scope до block_user или unblock_user.`
- Единица поставки: `FEATURE-004`
- Роль: `Фронтенд`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `не требуются`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`, `FEATURE-004-context-03-frontend-users-screen-and-role-flow.md`

## Примечания

- Зависимости: `AR-007; после архитектурного handoff задача может выполняться параллельно с BE-001 и DO-010`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/application-map/frontend-backoffice.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`, `FEATURE-004-context-03-frontend-users-screen-and-role-flow.md`
- Ожидаемый результат для ревью: `Route /users повторяет канонический users flow из .references и system artifacts, читает список пользователей, поддерживает поиск и фильтрацию, открывает диалог назначения роли, показывает success/error states, учитывает availableRoleAssignments и не расширяет сценарий до block/unblock user.`
- Проверки: `npm --prefix frontend run lint`, `npm --prefix frontend run stylelint`, `npm --prefix frontend run format:check`, `npm --prefix frontend run typecheck`, `npm --prefix frontend test`, `npm --prefix frontend run build`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/frontend-backoffice.md; индекс и корневая навигация не требуются, если список карт не меняется`
- Критерии готовности: `Экран /users реализован в границах contract GET /backoffice/users и PATCH /backoffice/users/{userId}/role; UI parity подтверждается относительно .references/Expressa_admin; success path назначения administrator доступен только BootstrapAdministrator, а обычный administrator получает server-driven error path без ложного success`
