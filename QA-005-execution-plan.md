# QA-005 execution plan: local containerized e2e workflow

## Назначение

Этот план декомпозирует перевод `QA-005` с ошибочного VPS e2e acceptance path на локальный QA workflow: QA запускает один локальный скрипт, скрипт собирает Docker-контейнер со всем приложением, внутри контейнера стартует приложение и выполняются browser e2e-тесты.

План не реализует изменения. Реализация выполняется только по отдельным подзадачам и контекстным пакетам.

## Source of truth

- Исходная задача: `tasks/QA-005-e2e-administrator-menu-catalog-management.md`.
- Текущий конфликт: `QA-005`, `docs/architecture/qa-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/devops-standards.md` и `docs/architecture/application-map/qa-menu-catalog.md` сейчас требуют финальный e2e-прогон на `test` VPS через `npm run test:vps:e2e`.
- Новое решение пользователя: QA должен запускать e2e локально через контейнер; VPS e2e route должен быть удален из acceptance workflow.

## Target workflow

- Система должна предоставлять QA одну локальную команду запуска e2e.
- Система должна собирать локальный Docker-контейнер со всем приложением перед e2e-прогоном.
- Система должна запускать backend, frontend и browser e2e внутри локального Docker runtime.
- Система должна сохранять pass/fail evidence локального контейнерного прогона.
- Система должна создавать `BUG-*` задачи на воспроизводимые ошибки продукта.
- Система должна создавать `BUG-*` задачи на воспроизводимые ошибки запуска e2e, контейнера, env/config или test runner.
- Система должна сохранять разделение ответственности: DevOps владеет локальным container runner, QA владеет feature e2e-сценариями и defect handoff.

## Scope Constraints

- Подзадачи этого плана переводят только e2e workflow `QA-005` и связанные инструкции.
- Подзадачи этого плана не меняют product behavior `FEATURE-002`.
- Подзадачи этого плана не меняют container-based deploy `main -> test VPS` для runtime поставки.
- Подзадачи этого плана не переносят QA ownership e2e-сценариев в DevOps.
- Подзадачи этого плана не делают e2e обязательным PR или deploy gate.

## Safety Constraints

- VPS e2e route не должен оставаться acceptance path для `QA-005`.
- `npm run test:vps:e2e` не должен использоваться как финальная команда закрытия e2e QA.
- Ошибки запуска e2e не должны теряться как инфраструктурный шум; они должны оформляться как `BUG-*` с контуром причины `devops`, если причина относится к local runner, Docker, env/config или test path.
- Product defects не должны маскироваться перезапуском e2e; они должны оформляться как `BUG-*` с контуром причины `frontend` или `backend`, если причина ясна.

## Subtasks

### 01. Realign task and instruction artifacts

- Context package: `QA-005-context-01-task-docs-realignment.md`.
- Role: `Архитектор` with System Analyst coordination if task cards need semantic rewrite.
- Goal: update task cards, role prompts, QA/DevOps standards, deployment/runtime maps and README navigation so they describe local containerized e2e as the QA acceptance workflow.
- Key result: `QA-005` and project instructions no longer require VPS e2e evidence; they require local containerized e2e evidence and bug creation for both product failures and launch failures.
- Depends on: none.
- Blocks: all implementation subtasks, because executors need the corrected source of truth first.

### 02. Build local e2e container runner

- Context package: `QA-005-context-02-local-e2e-container-runner.md`.
- Status: completed in this workspace.
- Role: `Девопс`.
- Goal: provide the local script and Docker runtime that QA uses to build the app container and run e2e inside it.
- Key result: QA can run one documented local command; DevOps includes one minimal smoke e2e test that proves the containerized route starts and reports failures.
- Depends on: subtask 01.
- Blocks: subtask 03 final QA suite execution.

### 03. Move QA browser suite to local container acceptance

- Context package: `QA-005-context-03-qa-browser-suite-local-container.md`.
- Status: completed in this workspace.
- Role: `Тестирование`.
- Goal: create or adapt browser e2e scenarios for `FEATURE-002` so they run through the local containerized command.
- Key result: e2e coverage validates the menu catalog scenarios from `QA-005` and produces local evidence artifacts.
- Depends on: subtasks 01 and 02.
- Blocks: final `QA-005` closure.

### 04. Execute defect handoff for e2e failures

- Context package: `QA-005-context-04-e2e-defect-handoff.md`.
- Role: `Тестирование`.
- Goal: after local containerized e2e execution, create reproducible `BUG-*` tasks for every observed product failure or launch failure.
- Key result: `QA-005` evidence links pass/fail output and lists created defects or explicitly states that no defects were found.
- Depends on: subtasks 02 and 03.
- Blocks: final `QA-005` closure.

## Expected execution order

1. Complete `01 Realign task and instruction artifacts`.
2. Complete `02 Build local e2e container runner`.
3. Complete `03 Move QA browser suite to local container acceptance`.
4. Complete `04 Execute defect handoff for e2e failures`.

## Review checklist for the full workflow

- `QA-005` no longer points final acceptance to `npm run test:vps:e2e`.
- Architecture and role instructions no longer describe VPS e2e as the target QA route.
- A local QA command builds the container and runs e2e inside it.
- The DevOps-owned runner contains one minimal test proving the local route can execute.
- QA-owned feature e2e tests cover administrator menu catalog scenarios and capability denial.
- Evidence includes local runner summary, browser report and clear pass/fail status.
- Every reproducible product or launch failure has a `BUG-*` card or a documented blocker when the cause contour is unclear.
