# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-007`
- Родительская задача: `FEATURE-004`
- Заголовок: `Архитектурный handoff FEATURE-004 для управления ролями пользователей`
- Описание: `Нужно зафиксировать архитектурный contour handoff для FEATURE-004 до начала реализации: отделить назначение ролей от block_user и unblock_user, обновить архитектурные карты для users flow, постоянного хранения в PostgreSQL и runtime path, а также проверить, что дочерние FE, BE, DO и QA задачи имеют self-contained read set без необходимости читать production-код соседнего контура.`
- Единица поставки: `FEATURE-004`
- Роль: `Архитектор`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`, `FEATURE-004-context-01-architecture-handoff.md`

## Примечания

- Зависимости: `нет`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/deployment-map.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`, `.references/Expressa_admin/src/app/components/AddUserDialog.tsx`, `FEATURE-004-context-01-architecture-handoff.md`
- Ожидаемый результат для ревью: `Архитектурные карты и handoff по FEATURE-004 согласованы с feature spec, test scenarios и contract; split FE/BE/DO/QA зафиксирован без смешения контуров; дочерние задачи готовы к исполнению без чтения соседнего production-кода.`
- Проверки: `Сверка child task read set с feature spec, sibling test scenarios и contract`, `Проверка, что runtime path PostgreSQL и users flow отражены в релевантных архитектурных картах`, `Проверка, что scope не расширен до block_user или unblock_user`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/frontend-backoffice.md, docs/architecture/application-map/backend-access.md, docs/architecture/application-map/delivery-and-runtime.md; docs/architecture/deployment-map.md обновляется при изменении runtime path или env/config`
- Критерии готовности: `Архитектурный handoff FEATURE-004 фиксирует users flow, PostgreSQL persistence и runtime route; дочерние FE, BE, DO, QA задачи связаны зависимостями и self-contained read set; архитектура не требует исполнителям восстанавливать contract из production-кода`
