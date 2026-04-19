# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-004`
- Родительская задача: `FEATURE-006`
- Заголовок: `Зафиксировать архитектурные стандарты качества кода`
- Описание: `Нужно обновить архитектурные документы и закрепить обязательные правила code style/code architecture style для frontend, backend, DevOps и QA. Результат должен быть достаточным для DO/FE/BE/QA задач без локального переопределения правил декомпозиции, SFC-структуры, NestJS boundaries, PR gates и regression acceptance.`
- Единица поставки: `FEATURE-006`
- Роль: `Архитектор`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/devops-standards.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/qa-menu-catalog.md`
- Контурная карта: `docs/architecture/application-map.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/qa-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `templates/task-template.md`, `templates/task-template-instruction.md`

## Примечания

- Зависимости: `FEATURE-001`, `FEATURE-002`
- Минимальный read set: `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/devops-standards.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/qa-menu-catalog.md`
- Ожидаемый результат для ревью: `Архитектурные документы фиксируют Vue SFC порядок template -> script -> style, обязательный style scoped lang="scss" для новых и рефакторимых SFC, правила декомпозиции views/components/composables/modules, NestJS boundaries, пороги размера файлов, обязательные PR gates, локальные hooks и QA acceptance рефакторинга без изменения поведения.`
- Проверки: `Проверить, что docs/architecture/frontend-architecture.md, backend-architecture.md, devops-standards.md и qa-standards.md содержат исполнимые правила; проверить, что дочерние DO/FE/BE/QA задачи могут ссылаться на эти документы как на канонический стандарт.`
- Обновление карты приложения: `Обязательно: docs/architecture/README.md и docs/architecture/application-map.md, если меняется навигация, список контуров или маршрут чтения; профильные контурные карты обновить при изменении фактов контуров.`
- Критерии готовности: `Задача завершена, когда архитектурный стандарт качества кода формализован в docs/architecture/ и не требует чтения production-кода для понимания обязательных правил.`
