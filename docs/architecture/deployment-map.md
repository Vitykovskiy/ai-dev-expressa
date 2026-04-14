# Карта развёртывания

## Контуры и окружения

| Окружение | Назначение | Обязательные проверки |
| --- | --- | --- |
| `local` | Разработка и ручная проверка child-задач | `pnpm install`, `pnpm prisma:generate`, `pnpm build`, `pnpm test`, ручной запуск `apps/api` |
| `ci` | Проверка pull request и merge readiness | install, `prisma generate`, build, unit/smoke tests backend slice |
| `staging` | Проверка интеграции перед выпуском | deploy административного среза, smoke-check сценария administrator, проверка env/config |
| `production` | Боевой выпуск | controlled deploy административного среза, post-deploy smoke-check, rollback path |

## Состав runtime для `DU-01`

- `PostgreSQL`
- `apps/api`
- `apps/backoffice-web` и `apps/backoffice-bot` остаются обязательными для полного runtime `DU-01`, но в текущем состоянии репозитория ещё не реализованы.
- `apps/customer-web` и `apps/customer-bot` не входят в runtime `DU-01`.

## CI/CD-поток

- `Текущее исполняемое ядро проверки в репозитории`
  - `pnpm install`
  - `pnpm prisma:generate`
  - `pnpm build`
  - `pnpm test`
- `pull request pipeline` в `.github/workflows`
  - должен материализовать текущее исполняемое ядро проверки для `apps/api` и `packages/shared-types`
  - после появления `apps/backoffice-web` и `apps/backoffice-bot` должен расшириться на них
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
- `PERSISTENCE_DRIVER`
- `ADMINISTRATOR_PROMOTION_MODE`

Отложенные переменные вне `DU-01`:

- `TG_CUSTOMER_BOT_TOKEN`

Каждая новая переменная окружения должна быть описана здесь вместе с контуром, где она используется.

### Назначение env vars backend slice

- `ADMIN_TELEGRAM_ID` — обязательный bootstrap Telegram ID главного administrator.
- `DISABLE_TG_AUTH` — включает test mode и разрешает вход по `x-test-telegram-id`.
- `DATABASE_URL` — обязателен для `PERSISTENCE_DRIVER=prisma`.
- `TG_BACKOFFICE_BOT_TOKEN` — обязателен для рабочей проверки Telegram init data.
- `PERSISTENCE_DRIVER` — `prisma` для runtime с `PostgreSQL`, `memory` для smoke/unit сценариев.
- `ADMINISTRATOR_PROMOTION_MODE` — backend policy для спорного назначения роли `administrator`; поддерживаются `bootstrap-only` и `any-administrator`.

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
