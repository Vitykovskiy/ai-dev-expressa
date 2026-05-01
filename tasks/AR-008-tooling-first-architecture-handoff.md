# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-008`
- Родительская задача: `FEATURE-008`
- Заголовок: `Архитектурный handoff tooling-first alignment`
- Единица поставки: `FEATURE-008`
- Роль: `Архитектор`
- Контурная карта: `docs/architecture/application-map.md`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Цель

`Зафиксировать архитектурный handoff для tooling-first alignment: назначенные инструменты по контурам, маршруты к официальной документации и корректную карту UI primitive layer перед стартом FE/BE/DO/QA задач.`

## Границы задачи

### Behavioral Requirements

- Система должна сопоставить текущие проектные контуры с назначенными инструментами: `Vue 3`, `Vuetify`, `NestJS`, `Docker Compose`, GitHub Actions, npm scripts, Husky, lint-staged, Playwright и Vitest.
- Система должна зафиксировать в архитектурных документах, где исполнитель находит официальный tooling-first маршрут для каждого назначенного инструмента.
- Система должна исправить расхождение между архитектурной ссылкой `frontend/src/components/ui` и фактическим UI primitive layer `frontend/src/ui`.
- Система должна передать FE/BE/DO/QA задачам минимальные read routes без необходимости восстанавливать tooling rules из production-кода.

### Назначенные инструменты и официальная документация

- `Vue 3`: `https://vuejs.org/guide/`
- `Vuetify`: `https://vuetifyjs.com/en/components/all/`
- `NestJS`: `https://docs.nestjs.com/`
- `Docker Compose`: `https://docs.docker.com/compose/`
- GitHub Actions: `https://docs.github.com/en/actions`
- npm scripts: `https://docs.npmjs.com/cli/using-npm/scripts`
- Husky: `https://typicode.github.io/husky/`
- lint-staged: `https://github.com/lint-staged/lint-staged`
- Playwright: `https://playwright.dev/docs/intro`
- Vitest: `https://vitest.dev/guide/`

### Scope Constraints

- Задача охватывает архитектурные документы и task handoff, а не production implementation.
- Process-layer находится вне области задачи.
- Изменение системных контрактов и бизнес-сценариев находится вне области задачи.

### Safety Constraints

- Система должна сохранять текущие public API contracts, route behavior, auth semantics, DTO shape, backend error mapping и runtime semantics.
- Система должна фиксировать обнаруженную необходимость изменения поведения как blocker для отдельной системной или архитектурной постановки.

## Зона ответственности

### Разрешенная зона правок

- `docs/architecture/README.md`
- `docs/architecture/stack.md`
- `docs/architecture/application-map.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/frontend-ui-kit.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/devops-standards.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/**`
- `tasks/FEATURE-008-tooling-first-project-alignment.md`
- `tasks/AR-008-tooling-first-architecture-handoff.md`

### Запрещенная зона правок

- `process/**`
- `frontend/**`
- `backend/**`
- `e2e/**`
- `.references/**`
- `docs/system/**`
- `docs/business/**`

## Маршрут чтения

- `process/workflow.md`
- `docs/architecture/README.md`
- `docs/architecture/stack.md`
- `docs/architecture/application-map.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/frontend-ui-kit.md`
- `docs/architecture/backend-architecture.md`
- `docs/architecture/devops-standards.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/frontend-backoffice.md`

## Справочные ссылки

- `frontend/src/ui/README.md`
- `frontend/package.json`
- `backend/package.json`
- `e2e/package.json`
- `package.json`

## Результат готовности

`Архитектурные документы и FEATURE-008 handoff явно указывают назначенные инструменты, официальные documentation routes, фактический UI primitive path frontend/src/ui и контурные границы для FE-008, BE-007, DO-010, QA-010 и QA-011.`

## Проверки

- `rg "frontend/src/components/ui" docs/architecture`
- `rg "frontend/src/ui" docs/architecture frontend/src/ui/README.md`
- Ручная проверка, что `docs/architecture/*` содержит project-specific tooling routes без дублирования process-layer правил.

## Результат выполнения

`не заполнено`
