# Карточка задачи

## Карточка задачи

- Идентификатор: `BUG-003`
- Родительская задача: `FEATURE-002`
- Заголовок: `devops: Test VPS E2E preflight не достигает опубликованный backoffice origin`
- Описание: `Ручной workflow Test VPS E2E после успешного Deploy Test не может пройти DevOps-owned preflight: backend health и test-mode API probe проходят, но проверка опубликованного backoffice origin из BACKOFFICE_PUBLIC_URL завершается HTTP 000. Из-за этого QA-005 не может собрать финальное deployed e2e evidence на test VPS.`
- Единица поставки: `FEATURE-002`
- Роль: `Девопс`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `не требуются`
- Архитектурные артефакты: `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/devops-standards.md`, `docs/architecture/qa-standards.md`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.github/workflows/test-vps-e2e.yml`, `scripts/run-test-vps-e2e.sh`, `tasks/QA-005-e2e-administrator-menu-catalog-management.md`

## Примечания

- Метка контура причины: `devops`
- Зависимости: `DO-003`, `QA-005`
- Минимальный read set: `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/devops-standards.md`, `.github/workflows/test-vps-e2e.yml`, `scripts/run-test-vps-e2e.sh`, `tasks/QA-005-e2e-administrator-menu-catalog-management.md`
- Ожидаемый результат для ревью: `Ручной workflow Test VPS E2E в режиме preflight проходит проверку backend health, test-mode API probe и опубликованного backoffice origin; после этого QA может запустить mode=run с QA-owned e2e command.`
- Проверки: `Запустить GitHub Actions workflow Test VPS E2E с mode=preflight. Ожидаемо: все preflight checks passed, summary artifact содержит Status passed. Затем запустить mode=run, scenario=menu-catalog-vps.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/delivery-and-runtime.md и docs/architecture/deployment-map.md, если меняются BACKOFFICE_PUBLIC_URL, frontend publish path, preflight path или Test VPS E2E route.`
- Критерии готовности: `BUG закрыт, когда Test VPS E2E preflight воспроизводимо проходит на test VPS, а QA-005 может собрать deployed e2e evidence без обхода проверки опубликованного frontend origin.`

## Evidence QA-005

- `Deploy Test` после merge PR #67: `success`, run `24692166511`, commit `147eeca345c401f40d82e76bd735025c0ff4c627`.
- `Test VPS E2E` mode `run`: `failed`, run `24692194679`, command `npm run test:e2e:menu-catalog:vps --workspace @expressa/backend`.
- Диагностический `Test VPS E2E` mode `preflight`: `failed`, run `24692219066`.
- Preflight evidence: backend health passed with HTTP `200`; test-mode backoffice API `/backoffice/orders` passed with HTTP `200`; published backoffice origin from `BACKOFFICE_PUBLIC_URL` failed with HTTP `000`.
- Wrapper artifact path from failed preflight: `artifacts/test-vps-e2e/test-vps-e2e-20260420T215106Z.summary.md` and `artifacts/test-vps-e2e/test-vps-e2e-20260420T215106Z.log`.

## Результат выполнения

- `Deploy Test` теперь передаёт `BACKOFFICE_PUBLIC_URL`, опциональный `FRONTEND_PUBLISH_DIR` и опциональную команду `TEST_DEPLOY_FRONTEND_RESTART_COMMAND` в VPS deploy route.
- `scripts/deploy-test-vps.sh` требует `BACKOFFICE_PUBLIC_URL`, при заданном `FRONTEND_PUBLISH_DIR` копирует `frontend/dist` в опубликованный каталог и выполняет smoke-check опубликованного frontend origin после рестарта.
- `scripts/run-test-vps-e2e.sh` нормализует пробельные значения route env и пишет stderr curl в workflow log, чтобы `HTTP 000` сопровождался причиной подключения.
- Обновлены `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md` и `docs/architecture/devops-standards.md`.
- Локальная проверка wrapper: `passed` — временные HTTP-серверы, `bash scripts/run-test-vps-e2e.sh --preflight-only`, backend/API/frontend probes вернули `HTTP 200`.
- Внешний VPS evidence нужно собрать повторным `Deploy Test`, затем `Test VPS E2E` mode `preflight` и mode `run` с командой QA-005.
