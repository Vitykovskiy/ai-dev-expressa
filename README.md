# Expressa

Репозиторий хранит проектные артефакты и минимальные backend- и frontend-контуры Expressa для `FEATURE-001`.

В текущем состоянии это каркас проекта с документацией, task-артефактами, инфраструктурными скриптами и двумя прикладными контурами: серверным контуром идентификации и доступа и клиентским backoffice-контуром.

`README.md` является project-specific навигационной точкой входа. Переносимый процесс вынесен в `process/`.

## Текущая структура

В дереве ниже показаны только значимые точки навигации. Служебные конфиги форматирования, линтинга, Git, редактора и lock-файлы намеренно не перечисляются.

```text
.
|-- .github/
|   `-- workflows/
|-- AGENTS.md
|-- README.md
|-- WORKFLOW.md
|-- docker-compose.deploy.yml
|-- Dockerfile.e2e
|-- process/
|   |-- README.md
|   |-- workflow.md
|   |-- prompts/
|   `-- templates/
|-- package.json
|-- terms-map.md
|-- backend/
|   |-- .dockerignore
|   |-- Dockerfile
|   |-- .env.example
|   |-- src/
|   |   `-- identity-access/
|   `-- test/
|-- frontend/
|   |-- .dockerignore
|   |-- Dockerfile
|   |-- .env.example
|   |-- index.html
|   |-- nginx.conf
|   `-- src/
|       |-- components/
|       |-- modules/
|       |-- router/
|       `-- views/
|-- e2e/
|   |-- menu-catalog/
|   |-- smoke/
|   |-- package.json
|   `-- playwright.config.ts
|-- docs/
|   |-- architecture/
|   |   |-- README.md
|   |   |-- stack.md
|   |   |-- frontend-architecture.md
|   |   |-- backend-architecture.md
|   |   |-- devops-standards.md
|   |   |-- deployment-map.md
|   |   |-- qa-standards.md
|   |   |-- application-map.md
|   |   `-- application-map/
|   |       |-- frontend-backoffice.md
|   |       |-- backend-access.md
|   |       |-- backend-menu-catalog.md
|   |       |-- delivery-and-runtime.md
|   |       |-- qa-access.md
|   |       `-- qa-menu-catalog.md
|   |-- business/
|   `-- system/
|-- tasks/
|-- scripts/
|   |-- deploy-test-vps.sh
|   |-- local-e2e-container-entrypoint.sh
|   |-- run-local-container-e2e.sh
|   `-- run-test-vps-e2e.sh
```

## Что где находится

- `AGENTS.md` — корневая project-specific инструкция для агентской работы и локальный override process-layer.
- `WORKFLOW.md` — compatibility-shim, перенаправляющий в `process/workflow.md`.
- `process/` — переносимая процессная документация: workflow, ролевые промпты и шаблоны.
- `package.json` — корневой orchestration-слой репозитория: `husky`, `lint-staged`, aggregate-команды `quality` и `build`, команды `deploy:test:vps` и `test:e2e:local`, а также команды запуска и проверки отдельных контуров через `--prefix`.
- `docker-compose.deploy.yml` — compose-манифест container-based деплоя `main -> test VPS` для frontend и backend runtime-образов.
- `Dockerfile.e2e` — локальный containerized runner для browser e2e `QA-005`.
- `terms-map.md` — карта терминов и рекомендуемых русских аналогов для проектной документации.
- `backend/` — минимальный NestJS-контур идентификации и доступа для `FEATURE-001`, а также Docker-артефакты server runtime: bootstrap главного `administrator`, Telegram/test-mode авторизация, role guard, тесты и `Dockerfile`.
- `frontend/` — клиентский backoffice-контур на `Vue 3`/`Vuetify`, а также Docker/Nginx-артефакты client runtime для `test` VPS: Telegram entry bootstrap, серверный authenticated actor/capabilities, role-based navigation, экран отказа доступа, тесты, `Dockerfile` и `nginx.conf`.
- `e2e/` — Playwright e2e-контур для локального containerized runner `QA-005`.
- `docs/` — проектные артефакты: бизнес-документы, системные документы и архитектурная навигация.
- `tasks/` — task-артефакты проекта.
- `scripts/` — версионируемые утилиты поставки и эксплуатационные shell-скрипты, используемые GitHub Actions и VPS; `deploy-test-vps.sh` обслуживает container-based rollout на `test` VPS, `run-local-container-e2e.sh` обслуживает локальный acceptance path для `QA-005`, `run-test-vps-e2e.sh` сохраняется как historical/deprecated QA e2e route.
- `.github/workflows/` — GitHub Actions для обязательных PR-проверок, публикации runtime-образов и автодеплоя `main` в `test`-окружение на VPS.

## Process и project

- `process/` определяет переносимый workflow, ролевые инструкции и шаблоны без project-specific фактов.
- `docs/`, `tasks/`, `README.md` и `terms-map.md` остаются project-specific слоем.
- `WORKFLOW.md` сохранен только как compatibility-shim и перенаправляет в `process/workflow.md`.

## Рабочие каталоги

Эти каталоги могут отсутствовать в свежем или очищенном состоянии репозитория. Они появляются по мере наполнения проекта артефактами и реализацией.

- `docs/business/` — бизнес-артефакты: vision, glossary, business-rules, scenarios.
- `docs/system/` — системные артефакты: system-context, feature-specs, domain-model, use-cases, contracts, state-models, ui-behavior-mapping.
- `docs/architecture/` — архитектурные артефакты: карта архитектурной навигации, стек, карты приложения, стандарты клиентской части, серверной части, тестирования и DevOps, карта развёртывания.
- `tasks/` — project-specific task-артефакты.
- `.references/` — версионируемые визуальные и входные референсы проекта; каталог является каноническим источником для UI/design workflow.

## Tooling

- Перед локальной работой выполните `npm install` в корне репозитория для установки `husky` и `lint-staged`, затем `npm install --prefix backend` и `npm install --prefix frontend` для автономной установки контуров.
- Корневой pre-commit hook запускает `lint-staged`: форматирование и линтинг делегируются в локальные binaries `backend` и `frontend`.
- Backend из корня запускается через `npm run dev:backend`.
- Frontend из корня запускается через `npm run dev:frontend`.
- Локальный containerized e2e runner для `QA-005` запускается из корня через `npm run test:e2e:local`; команда собирает Docker-контейнер, стартует backend/frontend/browser e2e внутри контейнера и сохраняет evidence в `artifacts/qa-005-local-e2e`.
- Для локальной проверки backoffice нужны `backend/.env.local` для backend и `frontend/.env.local` для frontend.

## Backend

- Контур находится в `backend/`.
- Установка зависимостей: `npm install --prefix backend`.
- Lint: `npm run lint`.
- Format: `npm run format`.
- Format check: `npm run format:check`.
- Сборка: `npm run build`.
- Typecheck: `npm run typecheck`.
- Тесты: `npm test`.
- Dev из корня: `npm run dev:backend`.
- Dev из каталога контура: `npm run start:dev`.
- Локальный `backend/.env.local`: `NODE_ENV=test`, `PORT=3000`, `ADMIN_TELEGRAM_ID=123456789`, `DISABLE_TG_AUTH=true`, `BACKOFFICE_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173`.
- Запуск: `ADMIN_TELEGRAM_ID=<id> SERVICE_TELEGRAM_BOT_TOKEN=<token> NODE_ENV=production npm start` после сборки.
- Test-mode запуск без Telegram допустим только с `NODE_ENV=test DISABLE_TG_AUTH=true ADMIN_TELEGRAM_ID=<id>`.

## Frontend

- Контур находится в `frontend/`.
- Установка зависимостей: `npm install --prefix frontend`.
- Dev server из корня: `npm run dev:frontend`.
- Dev server из каталога контура: `npm run dev`.
- Lint: `npm run lint`.
- Stylelint: `npm run stylelint`.
- Format: `npm run format`.
- Format check: `npm run format:check`.
- Сборка: `npm run build`.
- Typecheck: `npm run typecheck`.
- Тесты: `npm test`.
- Локальная интеграция с backend по умолчанию использует Vite proxy на `http://localhost:3000` для `/backoffice`.
- Локальный `frontend/.env.local`: `VITE_BACKOFFICE_API_BASE_URL=http://127.0.0.1:3000`, `VITE_BACKOFFICE_TEST_TELEGRAM_ID=123456789`.
- Дополнительные переменные: `VITE_BACKOFFICE_API_BASE_URL=<url>` для явного base URL backend API, `VITE_BACKOFFICE_TEST_TELEGRAM_ID=<id>` только для серверно разрешённого test-mode.
