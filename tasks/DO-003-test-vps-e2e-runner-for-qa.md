# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-003`
- Родительская задача: `FEATURE-002`
- Заголовок: `Подготовить запуск e2e QA на test VPS`
- Описание: `Система должна иметь воспроизводимый historical baseline для запуска QA-owned e2e command на уже задеплоенном test VPS. DevOps отвечает за скрипты, переменные окружения, секреты, SSH/runtime route и диагностические проверки доступности стенда, но не создает, не адаптирует и не владеет e2e-сценариями QA-005. E2E не должны становиться обязательным PR или deploy gate.`
- Единица поставки: `FEATURE-002`
- Роль: `Девопс`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `не требуются`
- Архитектурные артефакты: `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/qa-standards.md`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `scripts/deploy-test-vps.sh`, `.github/workflows/`, `package.json`, `backend/package.json`

## Примечания

- Зависимости: `DO-001`, `BE-002`, `FE-002`
- Минимальный read set: `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/qa-standards.md`, `scripts/deploy-test-vps.sh`, `package.json`, `backend/package.json`
- Ожидаемый результат для ревью: `В репозитории есть воспроизводимый DevOps-owned baseline запуска QA-owned e2e command на test VPS: скрипт или documented command wrapper, список обязательных env/secrets, preflight проверки доступности backend/frontend и инструкция по получению pass/fail артефакта для QA.`
- Проверки: `Dry-run/preflight скрипта без запуска e2e-сценариев; проверка обязательных env/secrets; проверка доступности test VPS backend health и опубликованного backoffice origin; подтверждение, что PR Checks и Deploy Test не запускают e2e как обязательный gate.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/delivery-and-runtime.md, docs/architecture/deployment-map.md и docs/architecture/devops-standards.md, если добавляются e2e run path, env vars, secrets, script или diagnostic checks.`
- Критерии готовности: `Задача завершена, когда QA может запустить свои e2e-сценарии против задеплоенного test VPS по документированной baseline-команде, DevOps preflight отделен от QA-сценариев, а e2e не встроены в обязательные PR/deploy gates.`

## Результат выполнения

- Добавлен DevOps-owned wrapper `scripts/run-test-vps-e2e.sh` и root-команды `npm run test:vps:e2e:preflight` / `npm run test:vps:e2e`.
- Добавлен ручной non-gate workflow `Test VPS E2E`, который использует существующие GitHub environment `test` secrets/vars и запускает wrapper на VPS без новых secret names.
- Preflight отделен от QA-сценариев: режим `--preflight-only` проверяет обязательные env, `GET /health`, test-mode API probe и опубликованный backoffice origin без запуска e2e.
- Полный запуск требует `TEST_E2E_COMMAND`, использует явные `TEST_E2E_*` или существующие deploy/runtime names из `test` VPS, передает QA-owned команде `E2E_BACKEND_BASE_URL`, `E2E_BACKOFFICE_ORIGIN`, `E2E_TEST_TELEGRAM_ID`, `E2E_STAND_COMMIT` и пишет `.log` / `.summary.md` артефакты.
- `PR Checks` и `Deploy Test` не изменены и не запускают e2e как обязательный gate.

## Связь с новым isolated route

- `DO-003` является historical baseline для запуска QA-owned команды против уже опубликованного `test` стенда.
- `DO-009` должен расширить этот baseline до isolated VPS browser acceptance route для `FEATURE-002`: отдельный compose project или эквивалентная изоляция, browser report artifacts и cleanup после pass/fail.
- Non-gate policy из `DO-003` сохраняется для `DO-009`: browser e2e не входит в обязательные `PR Checks` или `Deploy Test` gates без отдельного архитектурного решения.
