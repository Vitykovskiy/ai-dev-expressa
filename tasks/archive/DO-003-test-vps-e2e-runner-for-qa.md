# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-003`
- Родительская задача: `FEATURE-002`
- Заголовок: `Historical baseline запуска e2e QA на test VPS`
- Описание: `Система должна сохранять DO-003 только как historical/deprecated baseline запуска QA-owned e2e command на уже задеплоенном test VPS. Этот route не является acceptance path для QA-005. DevOps отвечал за скрипты, переменные окружения, секреты, SSH/runtime route и диагностические проверки доступности стенда, но не создавал, не адаптировал и не владел e2e-сценариями QA-005. E2E не должны становиться обязательным PR или deploy gate.`
- Единица поставки: `FEATURE-002`
- Роль: `Девопс`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`, `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- Архитектурные артефакты: `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/qa-standards.md`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `scripts/deploy-test-vps.sh`, `.github/workflows/`, `package.json`, `backend/package.json`

## Примечания

- Зависимости: `DO-001`, `BE-002`, `FE-002`
- Минимальный read set: `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`, `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`, `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/qa-standards.md`, `scripts/deploy-test-vps.sh`, `package.json`, `backend/package.json`
- Ожидаемый результат для ревью: `В репозитории сохранен historical/deprecated DevOps-owned baseline запуска QA-owned e2e command на test VPS: скрипт или documented command wrapper, список обязательных env/secrets, preflight проверки доступности backend/frontend и инструкция по получению pass/fail артефакта для QA.`
- Проверки: `Dry-run/preflight скрипта без запуска e2e-сценариев; проверка обязательных env/secrets; проверка доступности test VPS backend health и опубликованного backoffice origin; подтверждение, что PR Checks и Deploy Test не запускают e2e как обязательный gate.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/delivery-and-runtime.md, docs/architecture/deployment-map.md и docs/architecture/devops-standards.md, если добавляются e2e run path, env vars, secrets, script или diagnostic checks.`
- Критерии готовности: `Задача завершена, когда historical baseline задокументирован как не являющийся QA-005 acceptance path, DevOps preflight отделен от QA-сценариев, а e2e не встроены в обязательные PR/deploy gates.`

## Результат выполнения

- Этот результат является historical/deprecated baseline и не закрывает `QA-005` после перехода на локальный containerized e2e workflow.
- Добавлен historical/deprecated DevOps-owned wrapper `scripts/run-test-vps-e2e.sh` и root-команды `npm run test:vps:e2e:preflight` / `npm run test:vps:e2e`.
- Добавлен historical/deprecated ручной non-gate workflow `Test VPS E2E`, который использует существующие GitHub environment `test` secrets/vars и запускает wrapper на VPS без новых secret names.
- Preflight отделен от QA-сценариев: режим `--preflight-only` проверяет обязательные env, `GET /health`, test-mode API probe и опубликованный backoffice origin без запуска e2e.
- Полный запуск требует `TEST_E2E_COMMAND`, использует явные `TEST_E2E_*` или существующие deploy/runtime names из `test` VPS, передает QA-owned команде `E2E_BACKEND_BASE_URL`, `E2E_BACKOFFICE_ORIGIN`, `E2E_TEST_TELEGRAM_ID`, `E2E_STAND_COMMIT` и пишет `.log` / `.summary.md` артефакты.
- `PR Checks` и `Deploy Test` не изменены и не запускают e2e как обязательный gate.

## Связь с новым QA-005 route

- `DO-003` является historical/deprecated baseline для запуска QA-owned команды против уже опубликованного `test` стенда.
- Feature package `FEATURE-002` используется только как контекст границы фичи и сценариев проверки; `DO-003` не становится acceptance path для `QA-005`.
- `DO-009` не задает acceptance path для `QA-005` после перехода на локальный containerized e2e workflow.
- Non-gate policy из `DO-003` сохраняется для `DO-009`: browser e2e не входит в обязательные `PR Checks` или `Deploy Test` gates без отдельного архитектурного решения.
