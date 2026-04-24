# План выполнения `AR-007`

## Исходная задача

- Карточка: `tasks/AR-007-feature-004-users-role-management-architecture-handoff.md`
- Цель: зафиксировать архитектурный handoff `FEATURE-004`, обновить архитектурные карты и довести дочерние `FE/BE/DO/QA` задачи до исполнимого состояния с self-contained read set.

## Порядок выполнения

| Порядок | Подзадача                                    | Связанная карточка | Контекст                                                           | Зависимости  | Статус |
| ------- | -------------------------------------------- | ------------------ | ------------------------------------------------------------------ | ------------ | ------ |
| 1       | Архитектурный handoff и обновление карт      | `AR-007`           | `FEATURE-004-context-01-architecture-handoff.md`                   | нет          | `done` |
| 2       | Backend contract и PostgreSQL persistence    | `BE-001`           | `FEATURE-004-context-02-backend-postgresql-and-users-api.md`       | шаг 1        | `todo` |
| 3       | Frontend users screen и role assignment flow | `FE-001`           | `FEATURE-004-context-03-frontend-users-screen-and-role-flow.md`    | шаг 1        | `todo` |
| 4       | Runtime и delivery path PostgreSQL           | `DO-010`           | `FEATURE-004-context-04-devops-postgresql-runtime-and-delivery.md` | шаг 1, шаг 2 | `todo` |
| 5       | Manual QA acceptance                         | `QA-001`           | `FEATURE-004-context-05-qa-manual-user-role-management.md`         | шаги 1-4     | `todo` |
| 6       | E2E QA coverage                              | `QA-002`           | `FEATURE-004-context-06-qa-e2e-user-role-management.md`            | шаги 1-4     | `todo` |

## Правила исполнения

- Каждый субагент берет только следующую подзадачу из этого плана.
- После завершения подзадачи субагент делает отдельный commit в формате Conventional Commits.
- После commit субагент отмечает статус соответствующего шага как `done` в этом файле.
- Следующий субагент запускается только после завершения предыдущего шага.
- `QA-001` и `QA-002` не расширяют scope до `block_user` или `unblock_user`.

## Критерии завершения плана

- Все шесть шагов имеют статус `done`.
- Архитектурные карты и handoff для `FEATURE-004` согласованы с feature spec, test scenarios и contract.
- Дочерние `FE/BE/DO/QA` задачи остаются исполнимыми без чтения production-кода соседнего контура.
