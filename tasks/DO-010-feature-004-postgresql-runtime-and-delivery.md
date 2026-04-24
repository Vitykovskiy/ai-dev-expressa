# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-010`
- Родительская задача: `FEATURE-004`
- Заголовок: `Runtime и delivery path PostgreSQL для FEATURE-004`
- Описание: `Нужно подготовить runtime и delivery path для FEATURE-004 с постоянным хранением пользователей, ролей и blocked state в PostgreSQL. Задача охватывает env/config, container runtime, deploy route и smoke-check, необходимые для server-side users contract, без изменения бизнес-смысла feature и без расширения scope до block_user или unblock_user.`
- Единица поставки: `FEATURE-004`
- Роль: `Девопс`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/backend-access.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `FEATURE-004-context-04-devops-postgresql-runtime-and-delivery.md`

## Примечания

- Зависимости: `AR-007; задача может выполняться параллельно с BE-001 и FE-001 после архитектурного handoff`
- Минимальный read set: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/architecture/stack.md`, `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/backend-access.md`, `FEATURE-004-context-04-devops-postgresql-runtime-and-delivery.md`
- Ожидаемый результат для ревью: `Runtime path FEATURE-004 использует PostgreSQL как production-ready storage для users boundary; env/config, deployment route и smoke-check позволяют проверить users contract без восстановления инфраструктурных деталей из production-кода.`
- Проверки: `Проверка deploy/runtime read route для PostgreSQL`, `Проверка списка env vars и smoke-check для users contract`, `Проверка, что delivery path не ломает published QA route npm run test:e2e`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/delivery-and-runtime.md, docs/architecture/deployment-map.md; docs/architecture/application-map/backend-access.md обновляется, если меняется server runtime/config route`
- Критерии готовности: `Runtime route FEATURE-004 документирован для PostgreSQL, env/config и smoke-check достаточны для handoff, а QA lanes имеют воспроизводимый test/e2e маршрут после реализации`
