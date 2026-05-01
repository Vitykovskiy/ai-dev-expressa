# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-010`
- Родительская задача: `FEATURE-008`
- Заголовок: `Привести runtime и delivery к tooling-first подходу`
- Единица поставки: `FEATURE-008`
- Роль: `Девопс`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Цель

`Провести аудит и выровнять runtime/delivery контур вокруг штатных возможностей GitHub Actions, Docker Compose, npm scripts, Husky и lint-staged без изменения runtime semantics продукта.`

## Границы задачи

### Behavioral Requirements

- Система должна проверить, что root orchestration scripts делегируют проверки в назначенные контуры через штатный npm scripts path.
- Система должна проверить, что GitHub Actions jobs используют штатные actions и не обходят обязательные quality gates.
- Система должна проверить, что Docker Compose route использует штатные compose-механизмы для pull/up, project isolation, env-driven configuration и service health/smoke checks.
- Система должна проверить, что Husky и lint-staged используются как версионированный pre-commit route без ручных локальных инструкций.
- Система должна фиксировать в `Результат выполнения` проверенную штатную возможность инструмента и причину отклонения, если кастомный runtime/delivery путь сохраняется.

### Назначенные инструменты и официальная документация

- GitHub Actions: `https://docs.github.com/en/actions`
- Docker Compose: `https://docs.docker.com/compose/`
- npm scripts: `https://docs.npmjs.com/cli/using-npm/scripts`
- Husky: `https://typicode.github.io/husky/`
- lint-staged: `https://github.com/lint-staged/lint-staged`

### Scope Constraints

- Задача охватывает delivery/runtime tooling, CI, root orchestration, local hooks, env validation, smoke-check и rollback route.
- Изменение application business behavior, backend API, frontend routes, e2e scenario semantics и system contracts находится вне области задачи.
- Изменение VPS secrets или неверсионируемых env-файлов находится вне области задачи.

### Safety Constraints

- Система должна сохранять route `main -> test VPS` и изоляцию стендов `test` и `test-e2e`.
- Система должна сохранять mandatory gates для затронутых контуров без warning-only режима.
- Система должна сохранять test-only auth restrictions и production safety constraints.

## Зона ответственности

### Разрешенная зона правок

- `.github/workflows/**`
- `docker-compose.deploy.yml`
- `scripts/deploy-test-vps.sh`
- `package.json`
- `backend/package.json`
- `frontend/package.json`
- `.husky/**`
- `docs/architecture/devops-standards.md`, если меняется delivery/runtime standard
- `docs/architecture/deployment-map.md`, если меняется deployment map
- `docs/architecture/application-map/delivery-and-runtime.md`, если меняется runtime route
- `README.md`, если меняется documented local or delivery command
- `tasks/DO-010-runtime-and-delivery-tooling-first-alignment.md`
- `tasks/BUG-*.md` только для воспроизводимых devops/runtime-дефектов, найденных в рамках аудита

### Запрещенная зона правок

- `frontend/src/**`
- `backend/src/**`
- `backend/test/**`
- `e2e/**`
- `docs/system/**`
- `docs/business/**`
- `.references/**`
- Неверсионируемые env-файлы и секреты

## Маршрут чтения

- `process/workflow.md`
- `docs/architecture/devops-standards.md`
- `docs/architecture/deployment-map.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `README.md`
- `package.json`
- `https://docs.github.com/en/actions`

## Справочные ссылки

- `https://docs.docker.com/compose/`
- `https://docs.npmjs.com/cli/using-npm/scripts`
- `https://typicode.github.io/husky/`
- `https://github.com/lint-staged/lint-staged`
- `.github/workflows/`
- `docker-compose.deploy.yml`
- `scripts/deploy-test-vps.sh`

## Результат готовности

`Runtime/delivery контур использует штатные GitHub Actions, Docker Compose, npm scripts, Husky и lint-staged пути, обязательные gates воспроизводимы локально и в CI, а сохраненные кастомные delivery-решения имеют зафиксированную причину отклонения.`

## Проверки

- Ручная проверка root orchestration scripts в `package.json`.
- Ручная проверка consistency между `.github/workflows/**`, `docs/architecture/devops-standards.md` и `docs/architecture/application-map/delivery-and-runtime.md`.
- Ручная проверка smoke-check route без warning-only обязательных gates.
- `npm run quality`
- `npm run build`

## Результат выполнения

`не заполнено`
