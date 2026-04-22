# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-008`
- Родительская задача: `нет`
- Заголовок: `Перевести автодеплой main на container-based runtime на VPS`
- Описание: `Нужно заменить текущий merge-driven deploy route на VPS, который выполняет git checkout, npm ci, build и restart на хосте, на container-based delivery path. Система должна при push или merge в main публиковать runtime-образы frontend и backend в registry, а VPS должен получать и запускать эти образы через Docker Compose без npm-сборки application-контуров на хосте. Система должна сохранить отдельный e2e route для QA как независимый pipeline path, но обычный Deploy Test должен использовать контейнерный runtime. Система должна обеспечить воспроизводимый rollout, post-deploy smoke-check и документированный restore path.`
- Единица поставки: `n/a`
- Роль: `Девопс`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `не требуются`
- Архитектурные артефакты: `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/stack.md`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.github/workflows/deploy-test.yml`, `scripts/deploy-test-vps.sh`, `docker-compose.deploy.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/nginx.conf`, `package.json`

## Примечания

- Зависимости: `DO-001`
- Минимальный read set: `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/stack.md`, `.github/workflows/deploy-test.yml`, `scripts/deploy-test-vps.sh`, `docker-compose.deploy.yml`, `backend/Dockerfile`, `frontend/Dockerfile`, `frontend/nginx.conf`
- Ожидаемый результат для ревью: `Автодеплой main на VPS больше не использует npm install, npm ci, npm build и runtime restart application-процессов на хосте. В репозитории есть container-based deploy route: GitHub Actions собирает и публикует frontend/backend runtime images в registry, VPS выполняет pull и docker compose up, post-deploy smoke-check подтверждает работоспособность стенда, а restore path и required env/secrets задокументированы.`
- Проверки: `Проверка, что workflow Deploy Test на push или merge в main собирает и публикует frontend/backend runtime images; проверка, что VPS launcher выполняет docker login при необходимости, docker compose pull и docker compose up -d без npm build на хосте; проверка, что backend и frontend поднимаются как отдельные контейнеры; smoke-check: GET /health и test-mode доступ к GET /backoffice/orders; negative check подтверждает, что production-like bypass остается недопустимым; проверка restore path на предыдущий image tag или digest.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/delivery-and-runtime.md, docs/architecture/deployment-map.md, docs/architecture/devops-standards.md, README.md при изменении deployment entrypoints, compose-артефактов, env/secrets или GitHub Actions navigation.`
- Критерии готовности: `Задача завершена, когда merge-driven deploy на VPS выполняется через контейнеры frontend и backend, runtime на хосте не собирает application-контуры через npm, GitHub Actions публикует versioned runtime images в registry, VPS выполняет воспроизводимый container rollout со smoke-check, а текущий e2e route QA остается отдельным и совместимым с новой delivery-схемой.`

## Scope Constraints

- Задача изменяет только merge-driven deploy route на VPS и связанные delivery/runtime документы.
- Задача сохраняет VPS как целевой runtime-хост.
- Задача сохраняет отдельный QA e2e route как независимый pipeline path.
- Задача не добавляет production deployment channel.
- Задача не переносит ownership e2e-сценариев из QA в DevOps.

## Safety Constraints

- Система не должна выполнять npm ci, npm install, npm run build frontend или npm run build backend на VPS как штатную часть merge-driven deploy.
- Система не должна смешивать Deploy Test и Test VPS E2E в один обязательный pipeline route.
- Система не должна делать e2e обязательным gate для PR Checks или Deploy Test без отдельного архитектурного решения.
- Система не должна хранить runtime secrets или registry credentials в исходном коде.
- Система не должна заменять versioned image rollout неверсируемым запуском из локального состояния VPS checkout.

## Результат выполнения

- Добавлен container-based deploy route `main -> test VPS` через registry images, `docker-compose.deploy.yml` и обновленный launcher `scripts/deploy-test-vps.sh`.
- Workflow `Deploy Test` теперь собирает и публикует backend/frontend runtime images в `ghcr.io`, а VPS выполняет `docker compose pull` и `docker compose up -d`.
- Для container runtime добавлены `backend/Dockerfile`, `frontend/Dockerfile` и `frontend/nginx.conf`.
- Восстановление после неудачного выката переведено на rollback через зафиксированные image refs в deploy artifacts вместо основного сценария с ручным `git checkout`.
