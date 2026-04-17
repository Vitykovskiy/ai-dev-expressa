# Карта развёртывания

## Контуры и окружения

| Окружение | Назначение | Обязательные проверки |
| --- | --- | --- |
| `local` | Разработка и ручная проверка дочерних задач | локальный запуск нужных контуров, модульные тесты, локальный smoke-сценарий |
| `ci` | Проверка запроса на слияние и готовности к слиянию | установка зависимостей, модульные тесты, e2e `FEATURE-001`, сборка, валидация compose-маршрута, локальный smoke-сценарий рабочего режима и test environment |
| `staging` | Проверка интеграции перед выпуском на VPS | развёртывание через GitHub Actions, запуск существующих e2e по затронутым фичам, post-deploy дымовая проверка критического сценария, проверка окружения и конфигурации |
| `production` | Боевой выпуск | контролируемое развёртывание, post-deploy smoke-check, путь отката |

## Политика окружений для `FEATURE-001`

| Окружение | `ADMIN_TELEGRAM_ID` | `DISABLE_TG_AUTH` | `TG_BACKOFFICE_BOT_TOKEN` | Правило использования |
| --- | --- | --- | --- | --- |
| `local` | обязателен для проверки bootstrap главного `administrator` | допустим `true` только для ручной проверки и локальных e2e без Telegram | обязателен, если локальная проверка идёт через реальный служебный бот | Можно проверять как рабочий режим, так и test environment, но эти сценарии должны быть разделены явно |
| `ci` | обязателен для рабочего smoke-прогона; допускается тестовый `telegramId` для фикстур и test environment-валидации | допустим `true` только в выделенном smoke-job test environment и в `QA-001` | обязателен для рабочего smoke-job, не нужен для test environment-ветки | Проверки качества ветки не должны зависеть от ручного Telegram-входа и должны разделять рабочий и test environment сценарии |
| `staging` | обязателен | должен быть `false` или не задан | обязателен | Окружение должно воспроизводить рабочий канал входа через служебного бота |
| `production` | обязателен | должен быть `false` или не задан | обязателен | Прямой рабочий доступ по URL без Telegram запрещён |

## CI/CD-поток

- `ci.yml`
  - триггеры: `pull_request`, `push` в `main`
  - job `quality`: `npm ci`, модульные тесты `apps/server` и `apps/backoffice-web`, установка браузера Playwright, `npm run test:e2e`, сборка обоих контуров
  - job `deployment-validation`: генерация `infra/docker/.env` и `infra/docker/.env.server` из шаблонов, `docker compose config`, локальный рабочий smoke-прогон и отдельный test environment smoke-прогон через `SMOKE_MODE=test`
- `deploy-feature001.yml`
  - триггеры: автоматический `push` в `main` для `staging`, ручной `workflow_dispatch` для `staging` и `production`
  - вход `git_ref`: позволяет развернуть конкретный commit SHA или тег и используется как штатный путь восстановления
  - этапы: `npm ci`, модульные тесты, установка браузера Playwright, `npm run test:e2e`, сборка, синхронизация репозитория на VPS, рендер `infra/docker/.env` и `infra/docker/.env.server`, `bash infra/scripts/deploy-feature001.sh`, post-deploy дымовая проверка

## GitHub Environments и VPS-маршрут

| GitHub Environment | Хранение | Использование |
| --- | --- | --- |
| `staging` | environment variables и secrets | Автоматическое развёртывание при `push` в `main` и ручный повторный выпуск |
| `production` | environment variables и secrets | Только ручной выпуск через `workflow_dispatch` |

| Имя | Тип хранения | Где используется |
| --- | --- | --- |
| `VPS_HOST` | secret | SSH и `rsync` из `deploy-feature001.yml` |
| `VPS_USER` | secret | SSH и `rsync` из `deploy-feature001.yml` |
| `VPS_SSH_PRIVATE_KEY` | secret | Ключ доступа GitHub Actions к VPS |
| `VPS_APP_DIR` | variable | Каталог на VPS, куда синхронизируется репозиторий |
| `BACKOFFICE_PUBLIC_URL` | variable | Базовый URL для post-deploy дымовой проверки |
| `SERVER_PORT` | variable | Публикуемый порт контейнера `apps/server` |
| `BACKOFFICE_PORT` | variable | Публикуемый порт контейнера `apps/backoffice-web` |
| `VITE_APP_TITLE` | variable | Build-time заголовок `apps/backoffice-web` |
| `VITE_API_BASE_URL` | variable | Build-time API base URL; для VPS-маршрута `FEATURE-001` должен указывать на `/api` текущего origin |

## Переменные окружения и секреты

| Переменная | Контур | Тип | Назначение |
| --- | --- | --- | --- |
| `ADMIN_TELEGRAM_ID` | `apps/server` | secret в GitHub Environment, затем env-файл `infra/docker/.env.server` | Идемпотентный bootstrap главного `administrator` при старте |
| `DISABLE_TG_AUTH` | `apps/server`, `apps/backoffice-web` | variable в GitHub Environment, затем `infra/docker/.env` и `infra/docker/.env.server` | Включает test environment для входа без Telegram; на `staging` и `production` должен оставаться `false` |
| `TG_BACKOFFICE_BOT_TOKEN` | `apps/server` | secret в GitHub Environment, затем env-файл `infra/docker/.env.server` | Токен служебного бота для рабочего входа в backoffice |
| `SERVER_PORT` | `infra/docker/compose.feature001.yml` | variable в GitHub Environment | Публикуемый порт контейнера серверной части на VPS |
| `BACKOFFICE_PORT` | `infra/docker/compose.feature001.yml` | variable в GitHub Environment | Публикуемый порт контейнера `apps/backoffice-web` на VPS |
| `VITE_APP_TITLE` | `apps/backoffice-web` | variable в GitHub Environment | Build-time заголовок контейнеризованной клиентской части |
| `VITE_API_BASE_URL` | `apps/backoffice-web` | variable в GitHub Environment | Build-time base URL API для контейнеризованной клиентской части; в VPS-маршруте остаётся относительным `/api` |
| `VITE_TEST_TELEGRAM_ID` | `apps/backoffice-web` | локальная переменная окружения | Нужна только для локального test environment и не должна попадать в `staging/production` |

Каждая новая переменная окружения должна быть описана здесь вместе с контуром, где она используется.

## Smoke-check для `FEATURE-001`

- Каждое развёртывание должно иметь зафиксированный smoke-сценарий для затронутой `FEATURE-*`.
- E2e-тесты создаются и поддерживаются в `QA-*`; DevOps-задача обеспечивает только их запуск в требуемом окружении.
- Базовый smoke-скрипт `FEATURE-001` расположен в `infra/scripts/smoke-backoffice-access.mjs` и запускается командой `npm run smoke:backoffice-access`.
- Для `FEATURE-001` smoke-check обязан подтвердить:
  - идемпотентный старт `apps/server` с `ADMIN_TELEGRAM_ID`;
  - успешный bootstrap и `GET /api/backoffice/admin/ping` для `administrator` через валидный Telegram WebApp payload служебного бота;
  - наличие административных вкладок `menu`, `users`, `settings` в ответе bootstrap доступа;
  - отказ при прямом рабочем доступе без Telegram-контекста с причиной `telegram-context-required`, когда `DISABLE_TG_AUTH` выключен;
  - в `ci` отдельный позитивный прогон с `DISABLE_TG_AUTH=true` и `SMOKE_MODE=test`, не подменяющий рабочую дымовую проверку `staging/production`.

## Откат и порядок восстановления

- Каждое развёртывание должно иметь документированный откат или порядок восстановления.
- Если изменение затрагивает migration или несовместимый контракт, стратегия отката должна быть описана до начала реализации.
- Для `FEATURE-001` откат обязан возвращать согласованную пару версий `apps/server` и `apps/backoffice-web`, потому что контракт bootstrap доступа и причины отказа являются общими.
- Штатный порядок восстановления для `FEATURE-001`:
  1. Определить последний успешный commit SHA для целевого окружения.
  2. Повторно запустить `deploy-feature001.yml` с `target_environment=staging|production` и `git_ref=<успешный SHA>`.
  3. Дождаться повторного рендера `infra/docker/.env*`, выполнить `bash infra/scripts/deploy-feature001.sh` на VPS и убедиться, что предыдущий набор контейнеров заменён согласованной парой версий.
  4. Повторно прогнать post-deploy дымовую проверку и отдельно подтвердить, что `DISABLE_TG_AUTH=false` в `staging` и `production`.

## Правила актуализации

- Обновляйте документ при изменении этапов конвейера, целей развёртывания, переменных окружения, работы с секретами, дымовой проверки или процесса отката.
- Если из этого документа уже нельзя восстановить путь от merge до проверенного развёртывания, документ устарел и должен быть обновлён в той же задаче.
