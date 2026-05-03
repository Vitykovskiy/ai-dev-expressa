# Размещение queue-driven orchestration prompts в process-layer

## Рекомендуемая структура

```text
process/
|-- README.md
|-- workflow.md
|-- prompts/
|   |-- orchestration/
|   |   |-- README.md
|   |   |-- main-orchestrator.md
|   |   |-- universal-worker.md
|   |   `-- sub-orchestrator.md        # deprecated compatibility shim
|   |-- architect/prompt.md
|   |-- backend/prompt.md
|   |-- context-collector/prompt.md
|   |-- devops/prompt.md
|   |-- frontend/prompt.md
|   |-- qa/prompt.md
|   `-- system-analyst/
|       |-- prompt.md
|       `-- task-tree-rules.md
`-- templates/
```

## Изменение `process/README.md`

В раздел `Состав process-layer` добавить:

```markdown
- [prompts/orchestration/](./prompts/orchestration/) — queue-driven orchestration prompts для больших задач.
  - [main-orchestrator.md](./prompts/orchestration/main-orchestrator.md) — главный оркестратор очереди, который запускает прямых Universal Worker-субагентов.
  - [universal-worker.md](./prompts/orchestration/universal-worker.md) — единый worker-промпт для выполнения одного atomic step из execution plan.
```

## Изменение `process/workflow.md`

В раздел `Ролевые промпты` добавить:

```markdown
- `process/prompts/orchestration/main-orchestrator.md` — главный оркестратор queue-driven workflow для больших задач.
- `process/prompts/orchestration/universal-worker.md` — универсальный worker, выполняющий один atomic step по `execution-plan.md` и context package.
```

В раздел `Подготовка контекста` можно добавить уточнение:

```markdown
Для Codex VS Code workflow большая задача может выполняться в queue-driven режиме: основной агент создает `.agent-work/<TASK-ID>/execution-plan.md`, а затем последовательно запускает прямых Universal Worker-субагентов. Каждый worker берет следующую допустимую подзадачу из плана, создает недостающий context package или выполняет одну подзадачу по готовому context package. Разрешимые blocker'ы оформляются как resolver-подзадачи в том же execution plan.
```

## Что удалить из старой версии

Удалить или заменить устаревшие правила:

- `phase-orchestrator`;
- `sub-orchestrator запускает worker'ов`;
- `одна phase за сессию` как обязательную модель;
- `READINESS -> FEATURE_PACKAGE -> stop` как жесткий маршрут.

Вместо этого использовать очередь atomic steps.

## Каноническая команда продолжения

После checkpoint новая сессия получает только `RESUME_PROMPT`, а не полный лог прошлой работы.
