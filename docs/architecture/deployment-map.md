# Карта развёртывания

## Контуры и окружения

| Окружение | Назначение | Обязательные проверки |
| --- | --- | --- |
| `local` | Разработка, локальная сборка и ручная проверка дочерних задач | локальный запуск нужных исполняемых контуров, модульные тесты, локальная дымовая проверка |
| `ci` | Проверка запроса на слияние и готовности к слиянию | `npm ci`, модульные тесты `apps/server` и `apps/backoffice-web`, сборка обеих частей, валидация контейнерного маршрута, локальная дымовая проверка рабочего режима и test-режима |
| `test` | Постоянное VPS-окружение для ручной проверки после merge в `main` и для запуска e2e со стороны `QA` | автоматическое развёртывание через `deploy.yml`, post-deploy дымовая проверка в `SMOKE_MODE=test`, проверка окружения и конфигурации, доступ по URL без Telegram при `DISABLE_TG_AUTH=true` |
| `production` | Боевой выпуск | ручное развёртывание через `deploy.yml`, post-deploy дымовая проверка рабочего режима, проверка окружения и конфигурации, порядок восстановления |

`staging` не входит в активный маршрут развёртывания и не используется как обязательное окружение текущего конвейера.

## Политика окружений для `FEATURE-001`

| Окружение | `ADMIN_TELEGRAM_ID` | `DISABLE_TG_AUTH` | `TG_BACKOFFICE_BOT_TOKEN` | Правило использования |
| --- | --- | --- | --- | --- |
| `local` | обязателен для проверки bootstrap главного `administrator` | допустим `true` только для ручной проверки test-режима без Telegram | обязателен, если локальная проверка идёт через реальный служебный бот | Рабочий режим и test-режим должны проверяться раздельно |
| `ci` | обязателен для рабочего дымового прогона; допускается технический `telegramId` для test-режима | допустим `true` только в выделенном дымовом прогоне test-режима | обязателен для рабочего дымового прогона, не нужен для test-режима | Проверки запроса на слияние не запускают e2e и разделяют рабочий режим и test-режим |
| `test` | обязателен; допустим технический тестовый `telegramId` | должен быть `true` | не требуется | Окружение разворачивается автоматически после merge в `main`, доступно через браузер без Telegram и используется `QA` для e2e после развёртывания |
| `production` | обязателен | должен быть `false` или не задан | обязателен | Прямой рабочий доступ по URL без Telegram запрещён |

## Маршрут непрерывной интеграции и доставки

- `ci.yml`
  - триггер: только `pull_request`
  - выполняет `npm ci`, модульные тесты `apps/server` и `apps/backoffice-web`, сборку обеих частей
  - валидирует контейнерный маршрут на базе `infra/docker/compose.yml` командой `npm run deploy:config`
  - запускает локальную дымовую проверку рабочего режима и отдельную локальную дымовую проверку test-режима через `SMOKE_MODE=test`
  - не устанавливает Playwright и не запускает `npm run test:e2e`
- `deploy.yml`
  - триггеры: автоматический `push` в `main` для `test`, ручной `workflow_dispatch` только для `production`
  - перед синхронизацией на VPS повторяет тот же набор non-e2e проверок, что и `ci.yml`
  - использует `infra/docker/compose.yml`, рендер `infra/docker/.env` и `infra/docker/.env.server`, затем `bash infra/scripts/deploy.sh`
  - для `test` жёстко задаёт `DISABLE_TG_AUTH=true` и запускает post-deploy дымовую проверку в `SMOKE_MODE=test`
  - для `production` выполняет post-deploy дымовую проверку рабочего режима
  - не устанавливает Playwright и не запускает e2e
- E2e не входят в маршрут непрерывной интеграции и доставки: их адаптирует и запускает `QA` на уже развернутом `test`-окружении VPS после завершения `deploy.yml`.

## Обязательные статусы GitHub

- Для ветки `main` обязательные статусы запроса на слияние должны совпадать с актуальными именами check runs из `ci.yml`: `quality` и `deployment-validation`.
- Workflow `deploy.yml` не входит в обязательные статусы запроса на слияние, потому что запускается только после `push` в `main` или вручную через `workflow_dispatch`.
- При переименовании workflow или job в `.github/workflows/` нужно в той же задаче обновить branch protection GitHub и этот документ, иначе маршрут допуска к слиянию считается устаревшим.

## GitHub Environments и VPS-маршрут

| GitHub Environment | Хранение | Использование |
| --- | --- | --- |
| `test` | environment variables и secrets | Автоматическое развёртывание ветки `main` на постоянное VPS-окружение без Telegram-авторизации для ручной проверки и e2e со стороны `QA` |
| `production` | environment variables и secrets | Только ручной выпуск через `workflow_dispatch` |

| Имя | Тип хранения | Где используется |
| --- | --- | --- |
| `VPS_HOST` | secret | SSH и `rsync` из `deploy.yml` |
| `VPS_USER` | secret | SSH и `rsync` из `deploy.yml` |
| `VPS_SSH_PRIVATE_KEY` | secret | Ключ доступа GitHub Actions к VPS |
| `VPS_APP_DIR` | variable | Каталог на VPS, куда синхронизируется репозиторий |
| `BACKOFFICE_PUBLIC_URL` | variable | Базовый URL для post-deploy дымовой проверки и ручной проверки через браузер |
| `SERVER_PORT` | variable | Публикуемый порт контейнера `apps/server` |
| `BACKOFFICE_PORT` | variable | Публикуемый порт контейнера `apps/backoffice-web` |
| `VITE_APP_TITLE` | variable | Build-time заголовок `apps/backoffice-web` |
| `VITE_API_BASE_URL` | variable | Build-time API base URL; для VPS-маршрута должен указывать на `/api` текущего origin |

## Переменные окружения и секреты

| Переменная | Контур | Тип | Назначение |
| --- | --- | --- | --- |
| `ADMIN_TELEGRAM_ID` | `apps/server` | secret в GitHub Environment, затем env-файл `infra/docker/.env.server` | Идемпотентный bootstrap главного `administrator` при старте |
| `DISABLE_TG_AUTH` | `apps/server`, `apps/backoffice-web` | фиксируется маршрутом `deploy.yml`, затем рендерится в `infra/docker/.env` и `infra/docker/.env.server` | Включает test-режим для входа без Telegram; в `test` жёстко задаётся `true`, в `production` жёстко задаётся `false` |
| `TG_BACKOFFICE_BOT_TOKEN` | `apps/server` | secret в GitHub Environment, затем env-файл `infra/docker/.env.server` | Токен служебного бота для рабочего входа во внутренний административный контур |
| `SERVER_PORT` | `infra/docker/compose.yml` | variable в GitHub Environment | Публикуемый порт контейнера серверной части на VPS |
| `BACKOFFICE_PORT` | `infra/docker/compose.yml` | variable в GitHub Environment | Публикуемый порт контейнера `apps/backoffice-web` на VPS |
| `VITE_APP_TITLE` | `apps/backoffice-web` | variable в GitHub Environment | Build-time заголовок контейнеризованной клиентской части |
| `VITE_API_BASE_URL` | `apps/backoffice-web` | variable в GitHub Environment | Build-time base URL API для контейнеризованной клиентской части; в VPS-маршруте остаётся относительным `/api` |
| `VITE_TEST_TELEGRAM_ID` | `apps/backoffice-web` | локальная переменная окружения | Нужна только для локального test-режима и не должна попадать в `production` |

Каждая новая переменная окружения должна быть описана здесь вместе с контуром, где она используется.

## Дымовая проверка для `FEATURE-001`

- Каждое развёртывание должно иметь зафиксированный дымовой сценарий для затронутой `FEATURE-*`.
- E2e-тесты создаются, поддерживаются и запускаются в `QA-*`; `DO` отвечает только за развёртывание, окружение, конвейер и дымовую проверку.
- Базовый smoke-скрипт `FEATURE-001` расположен в `infra/scripts/smoke-backoffice-access.mjs` и запускается командой `npm run smoke:backoffice-access`.
- Для `FEATURE-001` дымовая проверка обязана подтвердить:
  - идемпотентный старт `apps/server` с `ADMIN_TELEGRAM_ID`;
  - успешный bootstrap и `GET /api/backoffice/admin/ping` для `administrator` через валидный Telegram WebApp payload служебного бота в рабочем режиме;
  - наличие административных вкладок `menu`, `users`, `settings` в ответе bootstrap доступа;
  - отказ при прямом рабочем доступе без Telegram-контекста с причиной `telegram-context-required`, когда `DISABLE_TG_AUTH` выключен;
  - в `ci` отдельный позитивный прогон с `DISABLE_TG_AUTH=true` и `SMOKE_MODE=test`, не подменяющий post-deploy дымовую проверку `test` и не заменяющий e2e на VPS.

## Откат и порядок восстановления

- Каждое развёртывание должно иметь документированный откат или порядок восстановления.
- Если изменение затрагивает migration или несовместимый контракт, стратегия отката должна быть описана до начала реализации.
- Для `FEATURE-001` откат обязан возвращать согласованную пару версий `apps/server` и `apps/backoffice-web`, потому что контракт bootstrap доступа и причины отказа являются общими.
- Штатный порядок восстановления для `FEATURE-001`:
  1. Определить последний успешный commit SHA для целевого окружения.
  2. Для `test` повторно воспроизвести стандартное развёртывание последнего подтверждённого commit из ветки `main`; для `production` повторно запустить `deploy.yml` c нужным `git_ref`, если этот вход предусмотрен маршрутом.
  3. Дождаться повторного рендера `infra/docker/.env*`, выполнить `bash infra/scripts/deploy.sh` на VPS и убедиться, что предыдущий набор контейнеров заменён согласованной парой версий.
  4. Повторно прогнать post-deploy дымовую проверку и отдельно подтвердить, что `DISABLE_TG_AUTH=true` в `test` и `DISABLE_TG_AUTH=false` в `production`.

## Правила актуализации

- Обновляйте документ при изменении этапов конвейера, целей развёртывания, переменных окружения, работы с секретами, дымовой проверки или процесса отката.
- Если из этого документа уже нельзя восстановить путь от запроса на слияние до проверенного развёртывания, документ устарел и должен быть обновлён в той же задаче.
