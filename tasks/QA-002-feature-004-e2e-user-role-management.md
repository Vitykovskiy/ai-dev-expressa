# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-002`
- Родительская задача: `FEATURE-004`
- Заголовок: `E2E FEATURE-004 Administrator User Role Management`
- Описание: `Нужно создать или обновить browser e2e-покрытие FEATURE-004 по обязательным scenario IDs из sibling document и подтвердить их полным прогоном QA-owned Playwright suite. Задача охватывает e2e coverage для отображения списка пользователей, успешного назначения роли barista, ошибки недопустимой роли, guard доступа без административных прав, успешного назначения роли administrator главным administrator и guard-пути для обычного administrator. Coverage mapping должен фиксировать scenario IDs, test files, test titles и required assertions без расширения scope до block_user или unblock_user.`
- Единица поставки: `FEATURE-004`
- Роль: `Тестирование`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/devops-standards.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `FEATURE-004-context-06-qa-e2e-user-role-management.md`

## Примечания

- Зависимости: `AR-007`, `BE-001`, `FE-001`, `DO-010`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/qa-standards.md`, `docs/architecture/devops-standards.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `FEATURE-004-context-06-qa-e2e-user-role-management.md`
- Ожидаемый результат для ревью: `Browser e2e suite покрывает required scenarios FTS-004-001, FTS-004-002, FTS-004-005, FTS-004-006, FTS-004-007 и FTS-004-008, а QA evidence содержит mapping scenario IDs -> test files -> test titles -> required assertions и результат полного прогона npm run test:e2e.`
- Проверки: `npm run test:e2e`, `Coverage mapping для FTS-004-001, FTS-004-002, FTS-004-005, FTS-004-006, FTS-004-007 и FTS-004-008 с указанием test file, test title и required assertions`, `Явная запись, что FTS-004-003, FTS-004-004 и FTS-004-009 остаются вне обязательного e2e lane`
- Обновление карты приложения: `Не требуется`
- Критерии готовности: `Все required e2e scenarios из feature test scenarios document покрыты browser tests и проходят полным suite; evidence различает локальный запуск и published QA route; success path BootstrapAdministrator и guard-path обычного administrator подтверждены отдельными automated scenarios`
