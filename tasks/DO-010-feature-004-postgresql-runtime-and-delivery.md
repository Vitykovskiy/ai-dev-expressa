# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-010`
- Родительская задача: `FEATURE-004`
- Заголовок: `Runtime и delivery path PostgreSQL для FEATURE-004`
- Описание: `Нужно подготовить текущий runtime и delivery path FEATURE-004 для dual-stand deploy route main -> test -> test-e2e с постоянным хранением пользователей, ролей и blocked state в PostgreSQL как единственным runtime path users boundary. Задача охватывает env/config, container runtime, deploy route, PostgreSQL readiness, schema/migration step и smoke-check, необходимые для server-side users contract, без изменения бизнес-смысла feature и без расширения scope до block_user или unblock_user.`
- Единица поставки: `FEATURE-004`
- Роль: `Девопс`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/backend-access.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `FEATURE-004-context-04-devops-postgresql-runtime-and-delivery.md`

## Примечания

- Зависимости: `AR-007; задача может выполняться параллельно с BE-001 и FE-001 после архитектурного handoff`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/architecture/stack.md`, `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/backend-access.md`, `FEATURE-004-context-04-devops-postgresql-runtime-and-delivery.md`
- Ожидаемый результат для ревью: `Текущий deploy route FEATURE-004 для стендов test и test-e2e использует PostgreSQL как production-ready storage и единственный runtime path users boundary; env/config, PostgreSQL readiness, schema/migration step и smoke-check позволяют проверить users contract без восстановления инфраструктурных деталей из production-кода и без создания дублирующей DO-задачи.`
- Проверки: `Проверка, что текущий deploy/runtime route для PostgreSQL покрывает оба published стенда test и test-e2e`, `Проверка, что handoff фиксирует DATABASE_URL, PostgreSQL readiness, schema/migration step и smoke-check GET /backoffice/users для users contract`, `Проверка, что delivery path сохраняет published QA route npm run test:e2e против https://expressa-e2e-test.vitykovskiy.ru`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/delivery-and-runtime.md, docs/architecture/deployment-map.md; docs/architecture/application-map/backend-access.md обновляется, если меняется server runtime/config route`
- Критерии готовности: `Runtime route FEATURE-004 документирован для текущего dual-stand deploy path через PostgreSQL, env/config и smoke-check достаточны для DevOps handoff без чтения production-кода, а QA lanes сохраняют воспроизводимый published test/e2e маршрут после реализации`
