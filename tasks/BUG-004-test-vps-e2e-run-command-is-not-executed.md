# Карточка задачи

## Карточка задачи

- Идентификатор: `BUG-004`
- Родительская задача: `FEATURE-002`
- Заголовок: `devops: Test VPS E2E run не запускает QA-owned command`
- Описание: `Ручной workflow Test VPS E2E после успешного preflight падает в режиме run до первого лога wrapper scripts/run-test-vps-e2e.sh, когда input e2e_command содержит каноническую QA-команду npm run test:e2e:menu-catalog:vps --workspace @expressa/backend. Из-за этого QA-005 не может собрать финальное deployed e2e evidence на test VPS, хотя BUG-003 с недоступным backoffice origin закрыт.`
- Единица поставки: `FEATURE-002`
- Роль: `Девопс`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `не требуются`
- Архитектурные артефакты: `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/devops-standards.md`, `docs/architecture/qa-standards.md`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.github/workflows/test-vps-e2e.yml`, `scripts/run-test-vps-e2e.sh`, `tasks/QA-005-e2e-administrator-menu-catalog-management.md`, `tasks/BUG-003-test-vps-e2e-preflight-cannot-reach-backoffice-origin.md`

## Примечания

- Метка контура причины: `devops`
- Зависимости: `DO-003`, `BUG-003`, `QA-005`
- Минимальный read set: `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/devops-standards.md`, `.github/workflows/test-vps-e2e.yml`, `scripts/run-test-vps-e2e.sh`, `tasks/QA-005-e2e-administrator-menu-catalog-management.md`, `tasks/BUG-003-test-vps-e2e-preflight-cannot-reach-backoffice-origin.md`
- Ожидаемый результат для ревью: `Workflow Test VPS E2E в mode=run корректно передает QA-owned e2e command на VPS, wrapper печатает preflight/e2e логи, запускает npm run test:e2e:menu-catalog:vps --workspace @expressa/backend и возвращает pass/fail summary artifact.`
- Проверки: `Запустить GitHub Actions workflow Test VPS E2E с mode=preflight: ожидаемо passed. Затем запустить mode=run с e2e_command npm run test:e2e:menu-catalog:vps --workspace @expressa/backend: ожидаемо wrapper логирует Test VPS e2e route started, preflight checks, Running QA-owned e2e command и итоговый Status passed или предметный failure e2e command, а не немой SSH exit 1 до wrapper logs.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/delivery-and-runtime.md и docs/architecture/deployment-map.md, если меняется Test VPS E2E route, способ передачи TEST_E2E_COMMAND, env vars или command wrapper.`
- Критерии готовности: `BUG закрыт, когда Test VPS E2E mode=run воспроизводимо доходит до запуска QA-owned e2e command на test VPS и QA-005 может собрать deployed e2e evidence без ручного обхода workflow route.`

## Evidence QA-005

- `Deploy Test` после исправления `BUG-003`: `success`, GitHub Actions run `24693626653`, stand commit `e12d1580f197e35f9d66cf4f0547aa2a92d82955`.
- `Test VPS E2E` mode `preflight`: `success`, GitHub Actions run `24693649262`; backend health `200`, test-mode API probe `/backoffice/orders` `200`, published backoffice origin `200`.
- `Test VPS E2E` mode `run`: `failed before wrapper logs`, GitHub Actions run `24707861478`, input command `npm run test:e2e:menu-catalog:vps --workspace @expressa/backend`; job `Run Test VPS e2e route` завершился `Process exited with status 1` до вывода `Test VPS e2e route started`.
- Локальный debug e2e QA-005: `passed` — `npm run test --workspace @expressa/backend -- menu-catalog.e2e.spec.ts`; 4 теста passed.
- Гипотеза для DevOps-проверки: проблема находится в workflow/SSH route передачи `TEST_E2E_COMMAND` со spaces через `appleboy/ssh-action envs` или в удаленной shell-инициализации run-mode до запуска wrapper; preflight без `TEST_E2E_COMMAND` проходит.

## Результат выполнения

- `.github/workflows/test-vps-e2e.yml` кодирует input `e2e_command` в `TEST_E2E_COMMAND_B64` перед SSH route и больше не передаёт raw command со spaces через `appleboy/ssh-action envs`.
- `scripts/run-test-vps-e2e.sh` поддерживает `TEST_E2E_COMMAND_B64`, декодирует его в `TEST_E2E_COMMAND` на VPS, валидирует base64 payload и логирует фактическую QA-owned command перед запуском.
- Обновлены `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md` и `docs/architecture/devops-standards.md` для shell-safe command transport.
- Локальные проверки: `passed` — `bash -n scripts/run-test-vps-e2e.sh`; `passed` — `git diff --check`; `passed` — `npm run test --workspace @expressa/backend -- menu-catalog.e2e.spec.ts`.
- PR `#70` смержен в `main` squash commit `33de12f8f8a3f9d66b47dd867e3c3258ca4063f7`; `PR Checks` run `24709144118`: `build` passed, `quality` passed.
- `Deploy Test` после merge PR `#70`: `success`, GitHub Actions run `24709188255`, stand commit `33de12f8f8a3f9d66b47dd867e3c3258ca4063f7`.
- `Test VPS E2E` mode `preflight` после merge PR `#70`: `success`, GitHub Actions run `24709198119`, stand commit `33de12f8f8a3f9d66b47dd867e3c3258ca4063f7`; backend health `200`, test-mode API probe `/backoffice/orders` `200`, published backoffice origin `200`.
- `Test VPS E2E` mode `run` после merge PR `#70`: `failed before wrapper start log`, GitHub Actions run `24709212245`, input command `npm run test:e2e:menu-catalog:vps --workspace @expressa/backend`; workflow encoded command to `TEST_E2E_COMMAND_B64`, SSH action received `TEST_E2E_COMMAND_B64`, but job exited with `Process exited with status 1` before `Test VPS e2e route started`.
- Текущая классификация: `devops/runtime route`; исходная гипотеза про raw `TEST_E2E_COMMAND` со spaces через `appleboy/ssh-action envs` не закрывает дефект полностью. Следующая проверка должна диагностировать участок wrapper до стартового лога: наличие `TEST_E2E_COMMAND_B64` внутри remote shell, декодирование base64, `require_env "TEST_E2E_COMMAND"` и ранний fail/log output.
