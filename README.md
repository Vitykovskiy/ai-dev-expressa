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
|-- process/
|   |-- README.md
|   |-- workflow.md
|   |-- prompts/
|   `-- templates/
|-- package.json
|-- terms-map.md
|-- backend/
|   |-- .env.example
|   |-- src/
|   |   `-- identity-access/
|   `-- test/
|-- frontend/
|   |-- .env.example
|   |-- index.html
|   `-- src/
|       |-- components/
|       |-- modules/
|       |-- router/
|       `-- views/
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
|   `-- run-test-vps-e2e.sh
```

## Что где находится

- `AGENTS.md` — корневая project-specific инструкция для агентской работы и локальный override process-layer.
- `WORKFLOW.md` — compatibility-shim, перенаправляющий в `process/workflow.md`.
- `process/` — переносимая процессная документация: workflow, ролевые промпты и шаблоны.
- `package.json` — корневой orchestration-слой репозитория: `husky`, `lint-staged`, aggregate-команды `quality` и `build`, а также команды запуска и проверки отдельных контуров через `--prefix`.
- `terms-map.md` — карта терминов и рекомендуемых русских аналогов для проектной документации.
- `backend/` — минимальный NestJS-контур идентификации и доступа для `FEATURE-001`: bootstrap главного `administrator`, Telegram/test-mode авторизация, role guard и тесты.
- `frontend/` — клиентский backoffice-контур на `Vue 3`/`Vuetify` для `FEATURE-001`: Telegram entry bootstrap, серверный authenticated actor/capabilities, role-based navigation, экран отказа доступа и тесты.
- `docs/` — проектные артефакты: бизнес-документы, системные документы и архитектурная навигация.
- `tasks/` — task-артефакты проекта.
- `scripts/` — версионируемые утилиты поставки и эксплуатационные shell-скрипты, используемые GitHub Actions и VPS.
- `.github/workflows/` — GitHub Actions для обязательных PR-проверок и автодеплоя `main` в `test`-окружение на VPS.

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
- `.references/` — версионируемые визуальные и входные референсы проекта; каталог является каноническим источником для UI/design workflow

## Tooling

- Перед локальной работой выполните `npm install` в корне репозитория для установки `husky` и `lint-staged`, затем `npm install --prefix backend` и `npm install --prefix frontend` для автономной установки контуров.
- Корневой pre-commit hook запускает `lint-staged`: форматирование и линтинг делегируются в локальные binaries `backend` и `frontend`.
- Backend из корня запускается через `npm run dev:backend`.
- Frontend из корня запускается через `npm run dev:frontend`.
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
