# Контекстный пакет подзадачи

## Карточка контекста

- Исходная задача: `tasks/QA-005-e2e-administrator-menu-catalog-management.md`
- Подзадача: `01 — realign task and instruction artifacts`
- Роль исполнителя: `Архитектор`
- Зона ответственности: `task cards, role prompts, QA/DevOps standards, deployment/runtime maps, README navigation`
- Связанный план: `QA-005-execution-plan.md`

## Цель подзадачи

Система должна иметь согласованный документированный workflow, где `QA-005` закрывается локальным containerized e2e-прогоном, а VPS e2e route удален из acceptance path.

## Поведенческий промпт исполнителя

```text
You operate as a strict architect.

Complete only the task and instruction realignment subtask within QA-005.

Follow the read and edit boundaries from this context package. Do not implement Docker scripts, test code, application behavior, or deployment changes. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed documentation consistency checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `README.md`
- `QA-005-execution-plan.md`
- `tasks/QA-005-e2e-administrator-menu-catalog-management.md`
- `tasks/DO-003-test-vps-e2e-runner-for-qa.md`
- `tasks/DO-008-containerized-main-deploy-on-vps.md`
- `templates/task-template-instruction.md`
- `prompts/qa/prompt.md`
- `prompts/devops/prompt.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/devops-standards.md`
- `docs/architecture/deployment-map.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/architecture/application-map/qa-menu-catalog.md`

## Ключевые факты из источников

- `tasks/QA-005-e2e-administrator-menu-catalog-management.md` сейчас требует финальный acceptance-прогон через `npm run test:vps:e2e` на isolated test VPS route.
- `docs/architecture/qa-standards.md` сейчас описывает full browser suite на isolated test VPS route как финальное evidence для deployed route.
- `docs/architecture/deployment-map.md` и `docs/architecture/application-map/delivery-and-runtime.md` сейчас фиксируют `Test VPS e2e route`, `scripts/run-test-vps-e2e.sh` и `npm run test:vps:e2e`.
- `docs/architecture/devops-standards.md` сейчас описывает DevOps-owned VPS e2e run path и historical baseline `DO-003`.
- `docs/architecture/application-map/qa-menu-catalog.md` сейчас требует финальный e2e acceptance на isolated route задеплоенного `test` VPS.
- Новое пользовательское решение: QA запускает e2e локально через контейнер; e2e на VPS был ошибкой и должен быть удален из QA workflow.

## Разрешенная зона правок

- `tasks/QA-005-e2e-administrator-menu-catalog-management.md`
- `tasks/DO-003-test-vps-e2e-runner-for-qa.md` только для пометки исторического/deprecated статуса VPS e2e route, если это нужно для устранения противоречий
- `prompts/qa/prompt.md`
- `prompts/devops/prompt.md`
- `templates/task-template-instruction.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/devops-standards.md`
- `docs/architecture/deployment-map.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/architecture/application-map/qa-menu-catalog.md`
- `README.md` только если меняются навигация, команды или описания workflow

## Запрещенная зона правок

- `backend/**`
- `frontend/**`
- `scripts/**`
- `.github/workflows/**`
- `docker-compose*.yml`
- `package.json`
- `package-lock.json`
- Production code, test code and Docker implementation artifacts

## Входы и зависимости

- Эта подзадача должна выполняться первой.
- `QA-005-context-02-local-e2e-container-runner.md` и `QA-005-context-03-qa-browser-suite-local-container.md` используют результат этой подзадачи как обновленный source of truth.

## Ожидаемый результат

Документы и инструкции согласованы: `QA-005` требует локальный containerized e2e evidence; VPS e2e route не является acceptance path; bug handoff включает ошибки запуска e2e.

## Проверки

- `rg -n "test:vps:e2e|Test VPS E2E|isolated test VPS|VPS e2e|test VPS e2e" README.md tasks prompts docs/architecture`
- Ручная проверка: найденные упоминания VPS e2e либо удалены из target workflow, либо явно помечены как historical/deprecated и не являются acceptance route.
- Ручная проверка: e2e QA instructions говорят о локальном контейнерном запуске и defect handoff для product failures и launch failures.

## Критерии готовности

- `QA-005` содержит локальную containerized команду как финальный acceptance path.
- QA standards описывают local containerized e2e как стандартный route для feature-level browser e2e.
- DevOps standards описывают local runner ownership без владения QA feature assertions.
- Deployment/runtime maps больше не задают VPS e2e acceptance для QA.
- README обновлен, если изменились команды, скрипты или навигация.

## Риски и запреты

- Риск: оставить одновременно локальный и VPS e2e acceptance, что снова создаст конфликт источников истины.
- Риск: перенести e2e в обязательные PR/deploy gates вместо QA-owned local run.
- Запрет: реализовывать runner или тесты в этой подзадаче.

## Открытые вопросы

- Нужно ли удалить `scripts/run-test-vps-e2e.sh` сразу или оставить как deprecated historical artifact до отдельной cleanup-задачи.
