# Шаблон задачи

## Карточка задачи

- Идентификатор: `DO-011`
- Родительская задача: `нет`
- Заголовок: `Развёртывание ветки deploy на стенд expressa-deploy`
- Единица поставки: `n/a`
- Роль: `Девопс`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Цель

Создать отдельный маршрут развёртывания из ветки `deploy` на поддомен `https://expressa-deploy.vitykovskiy.ru`, подготовить SSH-доступ через отдельного пользователя агента и зафиксировать переменные окружения в корневом `.env`.

## Границы задачи

- В задачу входит создание ветки `deploy` без branch protection.
- В задачу входит настройка отдельного VPS-стенда `expressa-deploy` с изоляцией compose project, портов, env-файла и smoke-check.
- В задачу входит создание отдельного пользователя VPS для агентского SSH-доступа.
- В задачу входит документирование `.env` только в DevOps-документации.
- В задачу входит обновление GitHub Actions только для маршрута развёртывания ветки `deploy`.
- В задачу не входит изменение production route.
- В задачу не входит изменение клиентской или серверной бизнес-логики.
- В задачу не входит включение e2e в обязательные GitHub Actions gates.

## Зона ответственности

### Разрешенная зона правок

- `.github/workflows/`
- `docs/architecture/devops-standards.md`
- `docs/architecture/deployment-map.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `tasks/DO-011-deploy-branch-expressa-deploy-stand.md`
- `.agent-work/DO-011/`
- локальный корневой `.env`
- локальные SSH-ключи агента вне репозитория
- VPS bootstrap отдельного пользователя агента и stand-конфигурации `expressa-deploy`
- Git branch `deploy`

### Запрещенная зона правок

- `frontend/`
- `backend/`
- `e2e/`
- `.references/`
- `tasks/archive/`
- production route и production-секреты
- branch protection для `main`

## Маршрут чтения

- `process/prompts/devops/prompt.md`
- `docs/architecture/devops-standards.md`
- `docs/architecture/deployment-map.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `.github/workflows/deploy-test.yml`
- `scripts/deploy-test-vps.sh`

## Справочные ссылки

- `https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax`

## Результат готовности

Ветка `deploy` существует без branch protection, push в `deploy` запускает отдельное развёртывание на `https://expressa-deploy.vitykovskiy.ru`, VPS принимает SSH-вход отдельным пользователем агента, а DevOps-документация описывает назначение переменных корневого `.env` без раскрытия секретных значений.

## Проверки

- `git status --short`
- `gh api repos/Vitykovskiy/ai-dev-expressa/branches/deploy/protection`
- `ssh -i <AGENT_SSH_KEY_PATH> <AGENT_SSH_USER>@<IP> true`
- `curl --fail --silent --show-error https://expressa-deploy.vitykovskiy.ru/`
- `curl --fail --silent --show-error https://expressa-deploy.vitykovskiy.ru/health`
- GitHub Actions run для workflow развёртывания ветки `deploy`.

## Результат выполнения

2026-05-03: задача выполнена.

- Ветка `deploy` существует и используется отдельным workflow `Deploy Expressa Deploy` для развёртывания стенда `expressa-deploy`.
- Стенд доступен по `https://expressa-deploy.vitykovskiy.ru`; отдельный SSH-доступ агента проверен без раскрытия секретов.
- DevOps-документация описывает route `deploy -> expressa-deploy`, GitHub environment `expressa-deploy`, runtime-переменные и назначение корневого `.env` без секретных значений.
- Проверки: `git status --short` выполнен; branch protection API для `deploy` вернул отсутствие защиты; `ssh -i <AGENT_SSH_KEY_PATH> <AGENT_SSH_USER>@<IP> true` прошёл; `curl` для `/` и `/health` прошёл; GitHub Actions run `25283780662` attempt `4` завершён `success`.
