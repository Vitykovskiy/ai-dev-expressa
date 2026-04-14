# Карта развёртывания

## Контуры и окружения

| Окружение | Назначение | Обязательные проверки |
| --- | --- | --- |
| `local` | Разработка и ручная проверка child-задач | локальный запуск `api + backoffice-web + backoffice-bot + postgres`, unit tests, локальный smoke сценария administrator |
| `ci` | Проверка pull request и merge readiness | install, lint, unit tests, build административного среза |
| `staging` | Проверка интеграции перед выпуском | deploy административного среза, smoke-check сценария administrator, проверка env/config |
| `production` | Боевой выпуск | controlled deploy административного среза, post-deploy smoke-check, rollback path |

## Состав runtime для `DU-01`

- `PostgreSQL`
- `apps/api`
- `apps/backoffice-web`
- `apps/backoffice-bot`
- `apps/customer-web` и `apps/customer-bot` не входят в runtime `DU-01`.

## CI/CD-поток

- `pull request pipeline`
  - install dependencies
  - run lint
  - run unit tests по затронутым контурам `apps/api`, `apps/backoffice-web`, `packages/shared-types`
  - run build для `apps/api`, `apps/backoffice-web`, `apps/backoffice-bot`
- `main/release pipeline`
  - build runtime artifacts административного среза
  - publish container images для `api`, `backoffice-web`, `backoffice-bot`
  - apply schema/migration changes при наличии
  - deploy target environment
  - execute smoke-check `DU-01`

## Базовые env vars `DU-01`

- `ADMIN_TELEGRAM_ID`
- `DISABLE_TG_AUTH`
- `DATABASE_URL`
- `TG_BACKOFFICE_BOT_TOKEN`

Отложенные переменные вне `DU-01`:

- `TG_CUSTOMER_BOT_TOKEN`

Каждая новая переменная окружения должна быть описана здесь вместе с контуром, где она используется.

## Smoke-check и rollback

- Каждый deploy должен иметь зафиксированный smoke-сценарий для затронутой delivery unit.
- Для `DU-01` smoke-check обязан подтвердить:
  - bootstrap главного administrator из `ADMIN_TELEGRAM_ID`;
  - вход в backoffice через `Telegram backoffice-бота` или test mode при `DISABLE_TG_AUTH=true`;
  - сохранение изменений меню;
  - сохранение рабочих часов и вместимости слотов;
  - назначение роли и блокировку пользователя.
- Каждый deploy должен иметь документированный rollback или restore path.
- Если изменение затрагивает migration или несовместимый контракт, rollback strategy должна быть описана до начала реализации.

## Правила актуализации

- Обновляйте документ при изменении pipeline stages, deploy targets, env vars, secrets handling, smoke-check или rollback process.
- Если из этого документа уже нельзя восстановить путь от merge до проверенного deployment, документ устарел и должен быть обновлен в той же задаче.
