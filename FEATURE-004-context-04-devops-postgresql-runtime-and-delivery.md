# Шаблон контекстного пакета подзадачи

## Карточка контекста

- Исходная задача: `tasks/DO-010-feature-004-postgresql-runtime-and-delivery.md`
- Подзадача: `04 — runtime и delivery path PostgreSQL`
- Роль исполнителя: `Девопс`
- Зона ответственности: `docker-compose.deploy.yml`, `scripts/**`, `.github/workflows/**`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/backend-access.md` при необходимости, `AR-007-execution-plan.md`
- Связанный план: `AR-007-execution-plan.md`

## Цель подзадачи

`Подготовить runtime и delivery path FEATURE-004 для PostgreSQL persistence users boundary, включая env/config, deploy route и smoke-check без потери QA e2e маршрута.`

## Поведенческий промпт исполнителя

```text
You operate as devops.

Complete only the PostgreSQL runtime and delivery subtask within the source task AR-007.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `tasks/DO-010-feature-004-postgresql-runtime-and-delivery.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `docs/architecture/stack.md`
- `docs/architecture/devops-standards.md`
- `docs/architecture/deployment-map.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/architecture/application-map/backend-access.md`
- `FEATURE-004-context-04-devops-postgresql-runtime-and-delivery.md`

## Ключевые факты из источников

- `stack.md`: production-ready handoff не допускает итоговое in-memory хранение users boundary; runtime path обязан использовать `PostgreSQL`.
- `delivery-and-runtime.md` и `deployment-map.md`: deploy route строится вокруг dual-stand `test` и `test-e2e`, versioned images и published QA route.
- `devops-standards.md`: smoke-check должен покрывать не только startup, но и критичные negative paths доступа.
- `feature-004-administrator-user-role-management.md`: runtime handoff должен явно поддерживать users flow и постоянное хранение пользователей, ролей и `blocked state`.
- `feature-004-administrator-user-role-management.test-scenarios.md`: QA acceptance зависит от published route и не должна ломаться из-за изменения delivery path.

## Разрешенная зона правок

- `docker-compose.deploy.yml`
- `scripts/**`
- `.github/workflows/**`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/architecture/deployment-map.md`
- `docs/architecture/application-map/backend-access.md`
- `AR-007-execution-plan.md`

## Запрещенная зона правок

- `frontend/src/**`
- `backend/src/**`
- `backend/test/**`
- `e2e/**`
- `docs/system/**`
- `.references/**`

## Входы и зависимости

- `Вход`: завершенный шаг 1; для согласования runtime path учитывать результат шага 2.
- `Выход`: воспроизводимый deploy/runtime contract для PostgreSQL и QA lanes.

## Ожидаемый результат

`Delivery/runtime route FEATURE-004 описывает и при необходимости реализует PostgreSQL env/config, deploy path и smoke-check для users boundary без поломки опубликованного QA e2e стенда.`

## Проверки

- `Проверка списка env vars, необходимых для PostgreSQL runtime`
- `Проверка deploy route и smoke-check для users boundary`
- `Проверка, что published QA route npm run test:e2e сохраняется`

## Критерии готовности

- `PostgreSQL` отражен в runtime/config и delivery path FEATURE-004.
- `Smoke-check` покрывает users boundary там, где это требуется для handoff.
- `AR-007-execution-plan.md` обновлен: шаг 4 имеет статус `done`.

## Риски и запреты

- `Риск`: изменение runtime path может сломать published QA route или dual-stand isolation.
- `Запрет`: нельзя менять бизнес-смысл feature или расширять scope до block/unblock behavior.

## Открытые вопросы

- `нет`
