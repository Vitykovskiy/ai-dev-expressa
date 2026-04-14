# Карта развёртывания

## Контуры и окружения

| Окружение | Назначение | Обязательные проверки |
| --- | --- | --- |
| `local` | Разработка и ручная проверка child-задач | локальный запуск нужных контуров, unit tests, локальный smoke сценария |
| `ci` | Проверка pull request и merge readiness | install, lint, unit tests, build |
| `staging` | Проверка интеграции перед выпуском | deploy, smoke-check критического сценария, проверка env/config |
| `production` | Боевой выпуск | controlled deploy, post-deploy smoke-check, rollback path |

## CI/CD-поток

- `pull request pipeline`
  - install dependencies
  - run lint
  - run unit tests по затронутым контурам
  - run build
- `main/release pipeline`
  - build runtime artifacts
  - publish container images
  - deploy target environment
  - execute smoke-check

## Базовые env vars

- `ADMIN_TELEGRAM_ID`
- `DISABLE_TG_AUTH`
- `DATABASE_URL`
- `TG_CUSTOMER_BOT_TOKEN`
- `TG_BACKOFFICE_BOT_TOKEN`

Каждая новая переменная окружения должна быть описана здесь вместе с контуром, где она используется.

## Smoke-check и rollback

- Каждый deploy должен иметь зафиксированный smoke-сценарий для затронутой delivery unit.
- Каждый deploy должен иметь документированный rollback или restore path.
- Если изменение затрагивает migration или несовместимый контракт, rollback strategy должна быть описана до начала реализации.

## Правила актуализации

- Обновляйте документ при изменении pipeline stages, deploy targets, env vars, secrets handling, smoke-check или rollback process.
- Если из этого документа уже нельзя восстановить путь от merge до проверенного deployment, документ устарел и должен быть обновлен в той же задаче.
