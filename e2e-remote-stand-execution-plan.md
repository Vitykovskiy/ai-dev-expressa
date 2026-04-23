# План перевода e2e на отдельный удаленный стенд

## Summary

- Текущий основной путь `npm run test:e2e:local` дорогой по времени, потому что на каждом прогоне пересобирает backend, frontend и containerized runner.
- Целевое состояние должно использовать два постоянно развернутых стенда на одном VPS:
  - основной: `https://expressa.vitykovskiy.ru`
  - e2e: `https://expressa-e2e-test.vitykovskiy.ru`
- Основной e2e-маршрут должен запускаться локально и обращаться к уже развернутому `expressa-e2e-test.vitykovskiy.ru`.
- Канонический локальный запуск должен фиксировать удаленный стенд через env vars, как минимум `E2E_BASE_URL=https://expressa-e2e-test.vitykovskiy.ru`.
- Локальный containerized runner должен остаться поддерживаемым fallback/debug path и не должен оставаться основным acceptance path.

## Целевое состояние

- Система должна собирать GHCR-образы backend/frontend один раз на merge в `main`.
- Система должна разворачивать на одном VPS два изолированных compose-стека из одних и тех же образов.
- Система должна использовать отдельные env-файлы, compose project names и host ports для основного и e2e-стендов.
- Система должна запускать локальный Playwright against `https://expressa-e2e-test.vitykovskiy.ru` без локальной сборки приложения.
- Система должна фиксировать удаленный e2e-стенд через соответствующие env vars репозитория и workflow-контракта.
- Система должна сохранять `Dockerfile.e2e` и `npm run test:e2e:local` как fallback/debug route.

## Подзадачи

### 1. Параметризовать deploy route для двух стендов [Выполнено]

- Обобщить `scripts/deploy-test-vps.sh` под произвольный стенд через `ENV_FILE`, `DEPLOY_PROJECT_NAME`, host ports и smoke URLs.
- Проверить, что `docker-compose.deploy.yml` уже совместим с переиспользованием через разные project names и порты.
- Зафиксировать отдельные runtime-параметры для:
  - основного test-стенда
  - e2e-стенда
- Подготовить smoke-check так, чтобы оба стенда проверялись независимо и не конфликтовали по контейнерам, портам и rollback metadata.

### 2. Перевести e2e route на локальный запуск против удаленного стенда [Выполнено]

- Сделать локальный запуск Playwright каноническим маршрутом для e2e against deployed stand.
- Зафиксировать env-контракт локального запуска:
  - `E2E_BASE_URL=https://expressa-e2e-test.vitykovskiy.ru`
  - `E2E_BACKEND_BASE_URL` и другие `E2E_*` переменные только если они реально нужны suite/preflight
- Убрать зависимость основного e2e-маршрута от SSH-запуска команды на VPS.
- Привести smoke/preflight и e2e-спеки к модели, в которой тесты обращаются к удаленному опубликованному стенду, а не к локально поднятому приложению.
- Если suite требует прямого backend probe, зафиксировать отдельный routable contract или перевести probe на публичный origin без нарушения правила “backend отдельно не публикуется”.

### 3. Нормализовать GitHub Actions и script contracts

- Расширить `deploy-test.yml` до rollout двух стендов после единственной сборки образов.
- Пересмотреть роль `test-vps-e2e.yml`:
  - либо перевести в вспомогательный non-canonical маршрут,
  - либо сохранить только preflight/операционный smoke path.
- Зафиксировать в `package.json` штатную команду локального запуска remote e2e.
- Перенести второй стенд в GitHub Secrets/Vars только там, где значения отличаются от основного стенда:
  - env file path
  - frontend smoke URL
  - project name
  - host ports
  - public hostname

### 4. Обновить документацию и runtime map

- Обновить `README.md`.
- Обновить `docs/architecture/deployment-map.md`.
- Обновить `docs/architecture/devops-standards.md`.
- Обновить `docs/architecture/application-map/delivery-and-runtime.md`.
- Зафиксировать новый основной маршрут: `merge -> deploy two stands`, затем локальный `playwright test` against published e2e stand.
- Пометить `Dockerfile.e2e` и локальный containerized runner как debug/fallback route.

## Scope Constraints

- План не должен требовать немедленного удаления `Dockerfile.e2e`, `scripts/run-local-container-e2e.sh` или `npm run test:e2e:local`.
- План не должен делать e2e обязательным merge gate без отдельного архитектурного решения.
- План не должен требовать отдельного публичного backend-домена, если frontend origin может обслуживать нужные e2e-paths по текущему reverse-proxy контракту.

## Safety Constraints

- Изоляция стендов должна сохраняться на уровне compose project name, container names, env files и host ports.
- `DISABLE_TG_AUTH=true` должен оставаться допустимым только для `NODE_ENV=test`.
- Rollout второго стенда не должен ломать текущий основной test runtime.
- Локальный e2e against удаленного стенда не должен триггерить локальную сборку backend/frontend как обязательный шаг acceptance path.

## Проверяемый результат

- Merge в `main` разворачивает два стенда на одном VPS из одних и тех же GHCR-образов.
- `https://expressa.vitykovskiy.ru` и `https://expressa-e2e-test.vitykovskiy.ru` доступны одновременно.
- Локальный запуск Playwright использует `expressa-e2e-test.vitykovskiy.ru` через env vars и не требует `docker build` приложения.
- Документация фиксирует локальный remote e2e как основной маршрут, а local container runner как fallback/debug route.

## Зависимости между подзадачами

1. Сначала должна быть выполнена параметризация deploy route и зафиксирован контракт двух стендов.
2. Затем должен быть обновлен локальный e2e route и env contract against удаленный стенд.
3. После этого должны быть выровнены GitHub workflows и root script contracts.
4. Документация должна быть обновлена по итоговому согласованному контракту.

## Риски

- Текущие e2e-спеки и preflight частично ожидают прямой backend base URL и `GET /health`; это нужно согласовать с правилом отсутствия отдельного публичного backend-домена.
- Текущий `test-vps-e2e.yml` запускает wrapper по SSH на VPS и противоречит целевой модели локального запуска.
- Текущая документация явно объявляет remote e2e route historical/deprecated; без синхронного обновления карт появится конфликт контрактов.

## Assumptions

- Оба стенда размещаются на одном VPS.
- `review.vitykovskiy.ru` больше не используется и может быть исключен из документации и серверной конфигурации.
- Управление инфраструктурой остается через GitHub Actions и versioned repo scripts.
- Отдельный backend-домен не нужен; frontend origin должен обслуживать UI и проксировать backend-paths, необходимые для штатного e2e-маршрута.
