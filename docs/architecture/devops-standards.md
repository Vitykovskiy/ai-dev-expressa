# DevOps Standards

## Базовый стандарт

- Секреты Telegram-ботов и production env values не хранятся в исходном коде.
- Test-only режимы должны иметь явную защиту от включения в production.
- Smoke-check должен проверять не только успешный запуск, но и критичные negative paths для доступа.

## Для FEATURE-001

Подробная runtime карта для `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH` и smoke-check находится в `docs/architecture/application-map/delivery-and-runtime.md`.

## Container-based deploy route для test VPS

- Merge-driven route `main -> test VPS` использует versioned frontend/backend runtime images, которые workflow `Deploy Test` собирает и публикует в `ghcr.io` один раз на commit.
- Канонический delivery route завершает rollout двух изолированных стендов `test` и `test-e2e`, после чего QA запускает локальный `npm run test:e2e` против `https://expressa-e2e-test.vitykovskiy.ru`.
- VPS deploy path использует versioned `docker-compose.deploy.yml` и `scripts/deploy-test-vps.sh`; launcher валидирует env-файл выбранного стенда, выполняет `docker compose pull`, затем `docker compose up -d` для PostgreSQL, frontend и backend.
- Runtime-конфигурация каждого test-стенда хранится во внешнем env-файле VPS; deploy route использует обязательные значения `NODE_ENV=test`, `DISABLE_TG_AUTH=true`, `ADMIN_TELEGRAM_ID`, `BACKOFFICE_CORS_ORIGINS`, `DATABASE_URL`, `POSTGRES_DB`, `POSTGRES_USER` и `POSTGRES_PASSWORD`.
- Dual-stand deploy route должен переиспользовать один и тот же compose-манифест и один и тот же набор GHCR-образов для стендов `test` и `test-e2e`.
- Изоляция стендов должна обеспечиваться отдельными значениями `ENV_FILE`, `DEPLOY_PROJECT_NAME`, `DEPLOY_STAND_SLUG`, `TEST_DEPLOY_HOST_BACKEND_PORT`, `TEST_DEPLOY_HOST_FRONTEND_PORT`, `SMOKE_BACKEND_BASE_URL` и `SMOKE_FRONTEND_BASE_URL`.
- `scripts/deploy-test-vps.sh` должен сохранять rollback и summary артефакты в отдельные каталоги `artifacts/deploy-test/<stand-slug>/`, чтобы restore metadata не смешивалась между стендами.
- Host test runtime предоставляет `docker`, `docker compose` plugin и `curl`; registry credentials подключаются только через GitHub Secrets или env окружения стенда.
- Restore path использует rollback-файл конкретного стенда из `artifacts/deploy-test/<stand-slug>/` с предыдущими image refs; оператор повторно применяет его как входной env для `scripts/deploy-test-vps.sh`.
- Изменение compose-манифеста, Dockerfile, registry route, deploy secrets, smoke-check или rollback contract требует обновления `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/deployment-map.md` и `README.md`.

## QA e2e route

- QA запускает browser e2e локально из репозитория командой `npm run test:e2e`.
- Playwright по умолчанию использует опубликованный стенд `https://expressa-e2e-test.vitykovskiy.ru`.
- `E2E_BASE_URL` задаёт локальный override frontend origin для QA.
- `E2E_BACKEND_BASE_URL` задаёт локальный override backend API base URL для тестов, которым нужен прямой JSON-доступ к backend API.
- Для published `test-e2e` стенда canonical значение `E2E_BACKEND_BASE_URL` совпадает с `E2E_BASE_URL`, потому что frontend origin обязан публиковать `/backoffice/*` и `/customer/*` как JSON proxy routes.
- QA владеет feature e2e assertions, browser сценариями, fixtures, expected behavior, pass/fail evidence и defect handoff.
- E2E не включаются в обязательные `PR Checks` или `Deploy Test` gates без отдельного архитектурного решения; стандартный PR/deploy route остается non-e2e.
- Изменение e2e URL, локальных e2e overrides или QA-команды запуска считается изменением delivery/runtime карты и требует обновления `docs/architecture/application-map/delivery-and-runtime.md` и `docs/architecture/deployment-map.md`.
- Post-deploy smoke-check обязан подтверждать published proxy JSON route для QA-owned browser e2e, если feature-level acceptance зависит от frontend-proxied backend endpoints.

## PR gates для качества кода

- Каждый запрос на слияние в `main` должен запускать обязательные jobs для статических проверок, тестов и сборки затронутых контуров.
- Workflow `PR Checks` использует `npm ci` в корне репозитория для `husky` и `lint-staged`, `npm ci --prefix backend` для серверного контура и `npm ci --prefix frontend` для клиентского контура.
- Обязательные backend gates: `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run build`.
- Обязательные frontend gates: `npm run lint`, `npm run stylelint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run build`.
- Корневые orchestration-команды `npm run quality` и `npm run build` обязаны воспроизводить тот же набор проверок и сборок через `--prefix`-делегирование в `backend/` и `frontend/`.
- CI workflow должен завершаться ошибкой при любом нарушении lint, formatting, stylelint, typecheck, tests или build. Warning-only режим для обязательного gate запрещён.
- PR считается готовым к ревью только если локальный исполнитель может воспроизвести те же команды в соответствующих каталогах `backend/` и `frontend/`.
- Если задача затрагивает только один контур, CI может оптимизировать запуск по paths, но обязательные gates для затронутого контура не должны пропадать.
- Изменение GitHub Actions, npm scripts, Husky или lint-staged считается изменением delivery/runtime карты и требует обновления `docs/architecture/application-map/delivery-and-runtime.md`.

## Локальные hooks

- Pre-commit hook должен запускать `lint-staged` на изменённых файлах и блокировать commit при ошибке formatting, lint или stylelint для файлов, к которым применимы эти проверки.
- Установка hooks выполняется через root `package.json` lifecycle `prepare`; ручной запуск shell-команд для локального связывания hook не является стандартным путём.
- `lint-staged` должен как минимум запускать `prettier --write` через локальные binaries контуров для staged text-файлов, `eslint --fix` внутри `backend/` и `frontend/` для TypeScript/Vue файлов и `stylelint --fix` внутри `frontend/` для style-файлов и Vue style blocks.
- Hook не заменяет полные `test`, `typecheck` и `build`; эти команды остаются обязательными перед передачей задачи на ревью.
- Конфигурация hooks должна быть версионирована в репозитории. Установка hooks должна быть описана через npm scripts или стандартный lifecycle, а не через ручные локальные инструкции.
- Отключение hook допустимо только как аварийное действие исполнителя и не является evidence для ревью.

## Local runtime

- Локальный backend запускается из корня командой `npm run dev:backend`.
- Локальный frontend запускается из корня командой `npm run dev:frontend`.
- Backend использует `backend/.env.local`; frontend использует `frontend/.env.local`. Оба файла не коммитятся.
- Локальный bypass допустим только при `NODE_ENV=test`; перенос этого поведения в `production` или неограниченный `development` запрещён.
