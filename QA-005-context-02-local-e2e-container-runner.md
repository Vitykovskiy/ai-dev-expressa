# Контекстный пакет подзадачи

## Карточка контекста

- Исходная задача: `tasks/QA-005-e2e-administrator-menu-catalog-management.md`
- Подзадача: `02 — local e2e container runner`
- Роль исполнителя: `Девопс`
- Зона ответственности: `local Docker e2e runner, local QA command, env/preflight, one minimal smoke e2e test`
- Связанный план: `QA-005-execution-plan.md`

## Цель подзадачи

Система должна предоставить QA локальный скрипт, который собирает Docker-контейнер со всем приложением и внутри него запускает e2e-тесты. DevOps должен положить один самый простой тест для проверки работы маршрута.

## Поведенческий промпт исполнителя

```text
You operate as a strict DevOps engineer.

Complete only the local e2e container runner subtask within QA-005.

Follow the read and edit boundaries from this context package. Do not expand into QA feature assertions beyond one minimal runner smoke test. Do not change product behavior. If the updated documentation from subtask 01 is missing, stop and record a blocker.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `README.md`
- `QA-005-execution-plan.md`
- `QA-005-context-01-task-docs-realignment.md`
- `tasks/QA-005-e2e-administrator-menu-catalog-management.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/devops-standards.md`
- `docs/architecture/deployment-map.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/architecture/application-map/qa-menu-catalog.md`
- `docker-compose.deploy.yml`
- `backend/Dockerfile`
- `frontend/Dockerfile`
- `frontend/nginx.conf`
- `package.json`
- `backend/package.json`
- `frontend/package.json`

## Ключевые факты из источников

- `package.json` сейчас содержит VPS-oriented commands `test:vps:e2e` и `test:vps:e2e:preflight`.
- `scripts/run-test-vps-e2e.sh` сейчас запускает QA-owned command против опубликованного `test` стенда, а не локального контейнера.
- `docker-compose.deploy.yml` описывает deploy runtime backend/frontend images, но не локальный test runner со browser dependencies.
- `backend/Dockerfile` и `frontend/Dockerfile` уже существуют как runtime image sources для backend/frontend.
- `frontend/package.json` сейчас содержит unit/component tooling через `vitest`, но не содержит явного e2e script в committed package scripts.
- Пользователь требует local QA route: QA запускает контейнер локально, а не e2e на VPS.

## Разрешенная зона правок

- `scripts/**` только для локального e2e runner script или удаления/замены VPS e2e wrapper по решению subtask 01
- `docker-compose*.yml` только для локального e2e runner manifest, если выбран compose-backed local route
- `Dockerfile*`, `backend/Dockerfile`, `frontend/Dockerfile` только если нужно добавить local e2e target/stage без изменения production runtime behavior
- `package.json`
- `package-lock.json`
- `backend/package.json` и `frontend/package.json` только для scripts/dependencies, нужных local e2e runner
- `e2e/**` или `frontend/e2e/**` только для одного минимального DevOps-owned smoke test, доказывающего запуск runner
- `README.md` и runtime docs только если subtask 01 оставила это явно за DevOps implementation handoff

## Запрещенная зона правок

- Product behavior в `backend/src/**` и `frontend/src/**`
- QA feature scenarios beyond one minimal smoke test
- VPS deploy route `Deploy Test` semantics
- GitHub required PR checks
- Secrets or environment values committed into repository

## Входы и зависимости

- Зависит от `QA-005-context-01-task-docs-realignment.md`.
- Блокирует `QA-005-context-03-qa-browser-suite-local-container.md`, потому что QA feature suite должен использовать готовый local runner contract.

## Ожидаемый результат

В репозитории есть локальный QA entrypoint для e2e: одна команда собирает контейнер приложения, стартует backend/frontend/test runner внутри локального Docker runtime, запускает e2e и сохраняет summary/browser artifacts. В runner включен один минимальный smoke e2e test для проверки маршрута.

## Проверки

- Локальная команда runner build: `npm run <local-e2e-container-command>`
- Повторный локальный запуск той же команды без ручной очистки окружения.
- Проверка, что failure запуска контейнера или preflight дает non-zero exit code и evidence summary.
- Проверка, что minimal smoke e2e test выполняется внутри контейнера.
- Проверка, что `PR Checks` и `Deploy Test` не стали запускать e2e как gate.

## Критерии готовности

- QA запускает e2e одной локальной командой из корня.
- Команда сама собирает требуемый Docker artifact.
- E2E выполняются внутри локального Docker runtime.
- Runner публикует понятные local artifacts: log, summary и browser report.
- Один minimal smoke e2e test присутствует и проходит через runner.
- Ошибки runner/preflight/test command возвращают non-zero status.

## Риски и запреты

- Риск: реализовать hidden dependency на уже запущенные host backend/frontend процессы.
- Риск: смешать local e2e runner с VPS deploy runner.
- Риск: добавить smoke test, который проверяет только HTTP без browser boundary и потому не доказывает e2e route.
- Запрет: переносить feature-level e2e assertions из QA в DevOps.

## Открытые вопросы

- Финальное имя команды должно быть зафиксировано в subtask 01; если оно не зафиксировано, предложить одно имя и остановиться на review.
- Нужно ли local route делать single-container или compose-backed runner, если внешний contract для QA остается одной локальной командой.
