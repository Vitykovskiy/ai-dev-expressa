# Карточка задачи

## Карточка задачи

- Идентификатор: `BE-007`
- Родительская задача: `FEATURE-008`
- Заголовок: `Привести backend к NestJS-first подходу`
- Единица поставки: `FEATURE-008`
- Роль: `Бэкенд`
- Контурная карта: `docs/architecture/application-map/backend-access.md`; `docs/architecture/application-map/backend-menu-catalog.md`; `docs/architecture/application-map/backend-slot-settings.md`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Цель

`Провести аудит и поведенчески нейтральный рефакторинг серверной части, чтобы backend использовал штатные NestJS boundaries и testing utilities как базу, а самописные обходы были либо заменены, либо обоснованы.`

## Границы задачи

### Behavioral Requirements

- Система должна проверить текущие backend контуры `identity-access`, `menu-catalog`, `slot-settings` и `config` на соответствие штатным возможностям `NestJS`.
- Система должна использовать NestJS module/controller/provider/service/guard boundaries как базовый вариант для серверной структуры.
- Система должна использовать NestJS testing utilities как базовый вариант для backend tests, если они покрывают требуемый сценарий проверки.
- Система должна сохранять доменные правила в domain/service слоях согласно backend architecture map.
- Система должна фиксировать в `Результат выполнения` проверенную штатную возможность `NestJS` и причину отклонения, если кастомная реализация сохраняется.

### Назначенные инструменты и официальная документация

- `NestJS modules`: `https://docs.nestjs.com/modules`
- `NestJS controllers`: `https://docs.nestjs.com/controllers`
- `NestJS providers`: `https://docs.nestjs.com/providers`
- `NestJS guards`: `https://docs.nestjs.com/guards`
- `NestJS testing`: `https://docs.nestjs.com/fundamentals/testing`
- `Vitest`: `https://vitest.dev/guide/`

### Scope Constraints

- Задача охватывает серверные implementation boundaries и backend tests.
- Изменение API endpoints, request DTO, response DTO, auth headers/body, capability semantics, status codes и error mapping находится вне области задачи.
- Изменение клиентской части, e2e suite, runtime/deployment configuration и системных контрактов находится вне области задачи.

### Safety Constraints

- Система должна сохранять текущие contracts `backoffice-auth`, `menu catalog`, `slot settings` и `user role management`.
- Система должна сохранять test-mode guard semantics и production auth restrictions.
- Система должна оформлять обнаруженное расхождение production-кода и system contract как blocker или отдельную `BUG-*` задачу с backend-контуром причины.

## Зона ответственности

### Разрешенная зона правок

- `backend/src/**`
- `backend/test/**`
- `backend/**/*.spec.ts`
- `docs/architecture/application-map/backend-access.md`, если меняется backend boundary map
- `docs/architecture/application-map/backend-menu-catalog.md`, если меняется backend boundary map
- `docs/architecture/application-map/backend-slot-settings.md`, если меняется backend boundary map
- `tasks/BE-007-nestjs-first-backend-alignment.md`
- `tasks/BUG-*.md` только для воспроизводимых backend-дефектов, найденных в рамках аудита

### Запрещенная зона правок

- `frontend/**`
- `e2e/**`
- `docs/system/**`
- `docs/business/**`
- `.references/**`
- Deployment/runtime configuration

## Маршрут чтения

- `process/workflow.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/application-map/backend-access.md`
- `docs/architecture/application-map/backend-menu-catalog.md`
- `docs/architecture/application-map/backend-slot-settings.md`
- `https://docs.nestjs.com/`
- `https://vitest.dev/guide/`

## Справочные ссылки

- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/contracts/slot-settings-management.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
- `backend/package.json`

## Результат готовности

`Backend контуры используют штатные NestJS boundaries и testing utilities как основу, public contracts сохранены, а все сохраненные кастомные backend-решения имеют зафиксированную причину отклонения от штатного NestJS пути.`

## Проверки

- `npm run lint:backend`
- `npm run format:check:backend`
- `npm run typecheck:backend`
- `npm run test:backend`
- `npm run build:backend`

## Результат выполнения

`не заполнено`
