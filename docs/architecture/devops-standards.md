# DevOps Standards

## Базовый стандарт

- Секреты Telegram-ботов и production env values не хранятся в исходном коде.
- Test-only режимы должны иметь явную защиту от включения в production.
- Smoke-check должен проверять не только успешный запуск, но и критичные negative paths для доступа.

## Для FEATURE-001

Подробная runtime карта для `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH` и smoke-check находится в `docs/architecture/application-map/delivery-and-runtime.md`.

## Container-based deploy route для test VPS

- Merge-driven route `main -> test VPS` использует versioned frontend/backend runtime images, которые workflow `Deploy Test` собирает и публикует в `ghcr.io`.
- VPS deploy path использует versioned `docker-compose.deploy.yml` и `scripts/deploy-test-vps.sh`; launcher валидирует env-файл стенда, выполняет `docker compose pull`, затем `docker compose up -d` для frontend и backend.
- Runtime-конфигурация test-стенда хранится во внешнем env-файле VPS; deploy route использует обязательные значения `NODE_ENV=test`, `DISABLE_TG_AUTH=true`, `ADMIN_TELEGRAM_ID` и `BACKOFFICE_CORS_ORIGINS`.
- Host test runtime предоставляет `docker`, `docker compose` plugin и `curl`; registry credentials подключаются только через GitHub Secrets или env окружения стенда.
- Restore path использует rollback-файл из `artifacts/deploy-test/` с предыдущими image refs; оператор повторно применяет его как входной env для `scripts/deploy-test-vps.sh`.
- Изменение compose-манифеста, Dockerfile, registry route, deploy secrets, smoke-check или rollback contract требует обновления `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/deployment-map.md` и `README.md`.

## Local containerized e2e runner

- DevOps готовит e2e run path только по назначенной `DO-*` задаче.
- Для `QA-005` DevOps-owned run path должен включать локальный containerized runner, который собирает Docker-контейнер со всем приложением, запускает backend, frontend и browser e2e внутри локального Docker runtime, выполняет preflight, сохраняет pass/fail артефакты и возвращает воспроизводимый код завершения.
- DevOps-owned runner должен иметь одну локальную команду запуска для QA и документированный формат evidence: runner summary, browser report, путь к логам и явный pass/fail status.
- DevOps-owned runner должен иметь минимальную smoke e2e-проверку маршрута запуска без владения feature assertions `QA-005`.
- `DO-003` и `scripts/run-test-vps-e2e.sh` являются historical/deprecated baseline для запуска QA-owned команды против уже опубликованного `test` стенда и не являются acceptance path для `QA-005`.
- DevOps не создает, не адаптирует и не поддерживает feature e2e assertions; browser сценарии, fixtures, expected behavior и defect handoff остаются ответственностью `QA-*`.
- E2E не включаются в обязательные `PR Checks` или `Deploy Test` gates без отдельного архитектурного решения; стандартный PR/deploy route остается non-e2e.
- Изменение e2e run path, связанных env vars, secrets, diagnostic checks, container runner или скриптов считается изменением delivery/runtime карты и требует обновления `docs/architecture/application-map/delivery-and-runtime.md` и `docs/architecture/deployment-map.md`.

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
