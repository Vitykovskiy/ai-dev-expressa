# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-006`
- Родительская задача: `SPRINT-001`
- Заголовок: `Формализовать и принудительно соблюдать code style и code architecture style`
- Описание: `Нужно сделать требования к качеству кода обязательными: формализовать архитектурные стандарты frontend/backend/DevOps/QA, ввести проверяемые quality gates, подготовить отдельный frontend/backend рефакторинг без изменения поведения и подтвердить отсутствие регрессий. Фича не включает изменение пользовательских сценариев, API contracts, auth semantics, маршрутов или backend error mapping.`
- Единица поставки: `FEATURE-006`
- Роль: `Архитектор`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/devops-standards.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/qa-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `process/templates/task-template.md`, `process/templates/task-template-instruction.md`

## Примечания

- Зависимости: `FEATURE-001`, `FEATURE-002`
- Декомпозиция: `AR-004`, `DO-002`, `FE-003`, `BE-003`, `QA-003`
- Минимальный read set: `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/devops-standards.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/qa-menu-catalog.md`
- Ожидаемый результат для ревью: `В проекте есть утвержденные архитектурные правила качества кода, enforceable tooling и CI/hooks, а frontend/backend рефакторинг выполнен отдельными задачами без изменения поведения.`
- Проверки: `Дочерние задачи должны предоставить evidence по lint, format:check, stylelint для frontend, typecheck, test, build, pre-commit lint-staged и regression/e2e проверкам FEATURE-001/FEATURE-002.`
- Обновление карты приложения: `Обязательно в дочерних задачах, если меняются архитектурные стандарты, CI workflow, npm scripts, frontend/backend module boundaries или QA маршруты проверки.`
- Критерии готовности: `Фича закрыта, когда AR/DO/FE/BE/QA задачи завершены, quality gates блокируют нарушения, а QA подтверждает отсутствие регрессий в auth/capability behavior и управлении каталогом меню.`
