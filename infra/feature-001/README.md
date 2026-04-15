# FEATURE-001 runtime foundation

Этот каталог хранит минимальный runtime-контур для `FEATURE-001`.

## Что входит в foundation runtime

- `apps/api`
- `apps/backoffice-web`
- `packages/shared-types` как build-time зависимость общего контракта

`apps/backoffice-bot`, `PostgreSQL`, Telegram auth/session и остальные контуры `DU-01` сюда не входят.

## Env templates

- `env/api.env.example`
- `env/backoffice-web.env.example`

Фактические локальные override-файлы остаются в пакетах приложений:

- `apps/api/.env.local`
- `apps/backoffice-web/.env.local`

## Команды

- `npm run dev:feature-001` поднимает локальный runtime `api + backoffice-web`
- `npm run smoke:feature-001` поднимает runtime и выполняет smoke-проверку `client -> server`
- `npm run verify:feature-001` выполняет `typecheck + test + build + smoke`
