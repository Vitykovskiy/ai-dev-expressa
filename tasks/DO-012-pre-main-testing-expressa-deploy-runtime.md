# Карточка задачи

- Идентификатор: `DO-012`
- Родительская задача: `нет`
- Заголовок: `Предмержевое развёртывание на expressa-deploy`
- Единица поставки: `n/a`
- Роль: `Девопс`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Цель

Система должна предоставлять проверяемый маршрут `deploy -> expressa-deploy`, при котором push в ветку `deploy` разворачивает текущий commit на стенде `expressa-deploy` и выполняет post-deploy дымовую проверку до merge в `main`.

## Границы задачи

- В задачу входит аудит и правка workflow `Deploy Expressa Deploy`, deploy launcher и compose-манифеста только в части предмержевого стенда `expressa-deploy`.
- В задачу входит фиксация в архитектурных документах того, что `expressa-deploy` является стендом проверки развернутого окружения до merge в `main`.
- В задачу входит проверка, что маршрут использует ветку `deploy`, GitHub environment `expressa-deploy`, отдельный env-файл и отдельные host ports.

### Scope Constraints

- Задача покрывает только маршрут `deploy -> expressa-deploy`.
- Клиентское и серверное прикладное поведение остается вне области задачи.
- Значения GitHub Secrets, GitHub environment variables, VPS env-файлов и локальных `.env` остаются вне tracked-файлов.

### Safety Constraints

- Маршрут `main -> test/test-e2e` сохраняет существующее назначение.
- Production route сохраняет отдельный канал поставки.
- Host ports и env-файл стенда `expressa-deploy` остаются независимыми от стендов `test` и `test-e2e`.

## Зона ответственности

### Разрешенная зона правок

- `.github/workflows/deploy-expressa-deploy.yml`
- `scripts/deploy-test-vps.sh`
- `docker-compose.deploy.yml`
- `docs/architecture/deployment-map.md`
- `docs/architecture/devops-standards.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `README.md` только в разделах про развёртывание и стенды

### Запрещенная зона правок

- `backend/**`
- `frontend/**`
- `e2e/**`
- `.github/workflows/deploy-test.yml`
- `.env`, env-файлы стендов, значения секретов и приватные ключи

## Маршрут чтения

- `docs/architecture/devops-standards.md`
- `docs/architecture/deployment-map.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `.github/workflows/deploy-expressa-deploy.yml`
- `scripts/deploy-test-vps.sh`
- `docker-compose.deploy.yml`
- `README.md`

## Справочные ссылки

- `https://docs.github.com/en/actions`
- `https://docs.docker.com/compose/`

## Результат готовности

Push в ветку `deploy` запускает `Deploy Expressa Deploy`, публикует versioned backend/frontend images, разворачивает стенд `expressa-deploy`, выполняет post-deploy дымовую проверку и оставляет документацию с актуальным предмержевым route.

## Проверки

- `bash -n scripts/deploy-test-vps.sh`
- `git diff --check`
- GitHub Actions run `Deploy Expressa Deploy` на push в `deploy` завершается успешно.
- Post-deploy smoke-check подтверждает `GET /health`, frontend root `https://expressa-deploy.vitykovskiy.ru/`, published proxy `GET /backoffice/orders`, published proxy `GET /customer/slots` и production-like bypass rejection.

## Результат выполнения

2026-05-04: маршрут `deploy -> expressa-deploy` проверен и закрыт. Runtime-аудит подтвердил ветку `deploy`, workflow `Deploy Expressa Deploy`, GitHub environment `expressa-deploy`, изолированный env-файл, отдельные host ports, публикацию versioned images и post-deploy smoke checks. Документация обновлена для предмержевого стенда `expressa-deploy`.

Локальные проверки `bash -n scripts/deploy-test-vps.sh` и `git diff --check` прошли. Внешний GitHub Actions run и published smoke-check evidence для `expressa-deploy` подтверждены человеком и зафиксированы в `.agent-work/DO-012/orchestration-checkpoint.md`.
