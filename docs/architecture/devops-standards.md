# DevOps Standards

## Базовый стандарт

- Секреты Telegram-ботов и production env values не хранятся в исходном коде.
- Test-only режимы должны иметь явную защиту от включения в production.
- Smoke-check должен проверять не только успешный запуск, но и критичные negative paths для доступа.

## Для FEATURE-001

Подробная runtime карта для `ADMIN_TELEGRAM_ID`, `DISABLE_TG_AUTH` и smoke-check находится в `docs/architecture/application-map/delivery-and-runtime.md`.

## E2E run path для test VPS

- DevOps готовит e2e run path только по назначенной `DO-*` задаче, когда feature-level QA требует финальный e2e-прогон на задеплоенном `test` VPS.
- DevOps-owned run path должен включать воспроизводимый скрипт или documented command wrapper, список обязательных env/secrets, preflight backend health, проверку опубликованного backoffice origin и формат pass/fail артефакта для QA.
- Воспроизводимый entrypoint для `DO-003`: `npm run test:vps:e2e:preflight` для диагностики без запуска сценариев и `npm run test:vps:e2e` для запуска QA-owned команды через `scripts/run-test-vps-e2e.sh`.
- GitHub entrypoint для QA: ручной workflow `Test VPS E2E` (`workflow_dispatch`, `environment: test`) использует существующие GitHub Secrets/Variables окружения `test` и запускает `scripts/run-test-vps-e2e.sh` на VPS; workflow не является обязательным gate.
- `Deploy Test` обязан проверять не только backend smoke-check, но и опубликованный frontend origin из `BACKOFFICE_PUBLIC_URL`, чтобы `Test VPS E2E` не обнаруживал непубликованный backoffice только на QA-этапе.
- Если frontend публикуется через статический каталог, путь задаётся через `FRONTEND_PUBLISH_DIR`; если нужен отдельный рестарт frontend/static server, команда передаётся как `DEPLOY_FRONTEND_RESTART_COMMAND` из GitHub secret `TEST_DEPLOY_FRONTEND_RESTART_COMMAND`.
- Обязательные env для entrypoint могут задаваться явно через `TEST_E2E_BACKEND_BASE_URL`, `TEST_E2E_BACKOFFICE_ORIGIN`, `TEST_E2E_TELEGRAM_ID`; при запуске на VPS wrapper также использует уже существующие runtime/deploy names: `TEST_SMOKE_BACKEND_BASE_URL` или `PORT`/`SERVER_PORT`, `BACKOFFICE_PUBLIC_URL` или первый `BACKOFFICE_CORS_ORIGINS`, `ADMIN_TELEGRAM_ID`.
- `TEST_E2E_COMMAND` обязателен только для полного запуска и должен указывать на QA-owned e2e command.
- Опциональные env для evidence и диагностики: `TEST_E2E_ENV_FILE`, `ENV_FILE`, `TEST_E2E_ARTIFACT_DIR`, `TEST_E2E_HEALTH_PATH`, `TEST_E2E_API_PROBE_PATH`, `TEST_E2E_FRONTEND_PATH`, `TEST_E2E_CURL_TIMEOUT`, `TEST_E2E_STAND_COMMIT`, `TEST_E2E_REMOTE_SSH_TARGET`, `TEST_E2E_REMOTE_SSH_PORT`, `TEST_E2E_REMOTE_APP_DIR`.
- DevOps не создает, не адаптирует и не поддерживает feature e2e assertions; сценарии, fixtures, expected behavior и defect handoff остаются ответственностью `QA-*`.
- E2E не включаются в обязательные `PR Checks` или `Deploy Test` gates без отдельного архитектурного решения; стандартный PR/deploy route остается non-e2e.
- Изменение e2e run path, связанных env vars, secrets, diagnostic checks или скриптов считается изменением delivery/runtime карты и требует обновления `docs/architecture/application-map/delivery-and-runtime.md` и `docs/architecture/deployment-map.md`.

## PR gates для качества кода

- Каждый запрос на слияние в `main` должен запускать обязательные jobs для статических проверок, тестов и сборки затронутых контуров.
- Workflow `PR Checks` использует `npm ci` в корне репозитория как единый источник установки `npm workspaces`, чтобы `eslint`, `prettier`, `stylelint`, `husky`, `lint-staged` и зависимости `backend/frontend` были версионированы и воспроизводимы.
- Обязательные backend gates: `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run build`.
- Обязательные frontend gates: `npm run lint`, `npm run stylelint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run build`.
- Корневые orchestration-команды `npm run quality` и `npm run build` обязаны воспроизводить тот же набор проверок и сборок через workspace-скрипты без отдельного ручного `npm ci` в контурах.
- CI workflow должен завершаться ошибкой при любом нарушении lint, formatting, stylelint, typecheck, tests или build. Warning-only режим для обязательного gate запрещён.
- PR считается готовым к ревью только если локальный исполнитель может воспроизвести те же команды в соответствующих каталогах `backend/` и `frontend/`.
- Если задача затрагивает только один контур, CI может оптимизировать запуск по paths, но обязательные gates для затронутого контура не должны пропадать.
- Изменение GitHub Actions, npm scripts, Husky или lint-staged считается изменением delivery/runtime карты и требует обновления `docs/architecture/application-map/delivery-and-runtime.md`.

## Локальные hooks

- Pre-commit hook должен запускать `lint-staged` на изменённых файлах и блокировать commit при ошибке formatting, lint или stylelint для файлов, к которым применимы эти проверки.
- Установка hooks выполняется через root `package.json` lifecycle `prepare`; ручной запуск shell-команд для локального связывания hook не является стандартным путём.
- `lint-staged` должен как минимум запускать `prettier --write` для staged text-файлов, `eslint --fix` для staged backend/frontend TypeScript/Vue файлов и `stylelint --fix` для staged frontend style-файлов и Vue style blocks.
- Hook не заменяет полные `test`, `typecheck` и `build`; эти команды остаются обязательными перед передачей задачи на ревью.
- Конфигурация hooks должна быть версионирована в репозитории. Установка hooks должна быть описана через npm scripts или стандартный lifecycle, а не через ручные локальные инструкции.
- Отключение hook допустимо только как аварийное действие исполнителя и не является evidence для ревью.

## Local runtime

- Локальный backend запускается из корня командой `npm run dev:backend`.
- Локальный frontend запускается из корня командой `npm run dev:frontend`.
- Backend использует `backend/.env.local`; frontend использует `frontend/.env.local`. Оба файла не коммитятся.
- Локальный bypass допустим только при `NODE_ENV=test`; перенос этого поведения в `production` или неограниченный `development` запрещён.
