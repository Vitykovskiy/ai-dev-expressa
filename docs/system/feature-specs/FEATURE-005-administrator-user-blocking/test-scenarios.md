# Test Scenarios: FEATURE-005 Administrator User Blocking

## Карточка документа

- Feature: `FEATURE-005`
- Package root: `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/`
- Index: [index.md](./index.md)
- Behavior: [behavior.md](./behavior.md)
- Interfaces: [interfaces.md](./interfaces.md)
- UI behavior: [ui-behavior.md](./ui-behavior.md)
- Статус сценариев: `ready-for-architecture`
- Источники: `administrator-block-user.md`, `user-role-and-blocking-management.md`, `identity-and-access.md`, `backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- Последняя проверка согласованности: `2026-05-04`

## Coverage Matrix

| Scenario ID          | Название                              | Тип        | Manual QA  | E2E QA     | Приоритет  | Источник                                                 |
| -------------------- | ------------------------------------- | ---------- | ---------- | ---------- | ---------- | -------------------------------------------------------- |
| `FEATURE-005-SC-001` | Administrator blocks existing user    | `main`     | `required` | `required` | `critical` | `behavior.md`, `interfaces.md`, `ui-behavior.md`         |
| `FEATURE-005-SC-002` | Blocked user loses application access | `guard`    | `required` | `required` | `critical` | `identity-and-access.md`, `behavior.md`, `interfaces.md` |
| `FEATURE-005-SC-003` | Non-administrator cannot block user   | `negative` | `optional` | `required` | `high`     | `user-role-and-blocking-management.md`, `interfaces.md`  |
| `FEATURE-005-SC-004` | Missing target user returns not found | `negative` | `optional` | `optional` | `medium`   | `user-role-and-blocking-management.md`, `interfaces.md`  |
| `FEATURE-005-SC-005` | Unblock remains outside feature scope | `guard`    | `required` | `optional` | `high`     | `index.md`, `ui-behavior.md`, `backoffice-ui-binding.md` |

## Manual QA route

1. Manual QA uses an administrator actor to open the users surface.
2. Manual QA blocks an existing target user through `block_user`.
3. Manual QA verifies the success state, updated blocked state and blocked-user access denial.
4. Manual QA verifies that `unblock_user` is not part of `FEATURE-005` acceptance.
5. Manual QA records the result against the stable `Scenario ID` values in this document.

## E2E coverage expectation

- E2E QA must cover `FEATURE-005-SC-001`, `FEATURE-005-SC-002` and `FEATURE-005-SC-003`.
- E2E QA may cover `FEATURE-005-SC-004` and `FEATURE-005-SC-005` if child task scope provides the required test route and data.
- E2E QA must include the stable `Scenario ID` in the automated test title, annotation, tag or coverage comment.
- E2E QA must implement the `Required assertions` listed in each automated scenario mapping.

## Сценарии

### `FEATURE-005-SC-001` — Administrator blocks existing user

- Цель: подтвердить основной сценарий блокировки существующего пользователя.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: [behavior.md](./behavior.md), [interfaces.md](./interfaces.md), [ui-behavior.md](./ui-behavior.md)
- Предусловия: actor имеет роль `administrator`; целевой пользователь существует и не находится в принятом acceptance route как уже заблокированный.
- Тестовые данные: administrator actor; target user with known identifier and application access before block.
- Шаги:
  1. Administrator открывает users surface.
  2. Administrator выбирает целевого пользователя.
  3. Administrator инициирует `block_user`.
- Ожидаемый результат:
  1. Система должна сохранить для целевого пользователя статус `blocked`.
  2. Система должна показать administrator успешное завершение блокировки.
  3. Система должна обновить представление пользователя в users surface.
- Проверяемые инварианты:
  - Пользователь с `blocked=true` не может пользоваться приложением.
  - Actor должен иметь роль `administrator`.
- E2E mapping:
  - Test file: `e2e/...` to be assigned by e2e QA child task.
  - Test title / ID: must include `FEATURE-005-SC-001`.
  - Required assertions: target user reaches `blocked` state; administrator sees success or updated user state; test does not rely on `unblock_user`.

### `FEATURE-005-SC-002` — Blocked user loses application access

- Цель: подтвердить side effect прекращения доступа для заблокированного пользователя.
- Тип: `guard`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: [behavior.md](./behavior.md), [interfaces.md](./interfaces.md), [docs/system/domain-model/identity-and-access.md](../../domain-model/identity-and-access.md)
- Предусловия: target user has `blocked=true` after `FEATURE-005-SC-001`; QA target provides a way to attempt access as target user.
- Тестовые данные: blocked target user; access entry point supported by QA target.
- Шаги:
  1. QA attempts to use the application as the blocked target user.
  2. QA observes the access outcome.
- Ожидаемый результат:
  1. Система должна deny application access for user with `blocked=true`.
  2. Система должна keep administrator access unaffected.
- Проверяемые инварианты:
  - Blocked access denial applies after the block operation.
- E2E mapping:
  - Test file: `e2e/...` to be assigned by e2e QA child task.
  - Test title / ID: must include `FEATURE-005-SC-002`.
  - Required assertions: blocked target user cannot access protected application surface; administrator actor remains able to access users surface.

### `FEATURE-005-SC-003` — Non-administrator cannot block user

- Цель: подтвердить role guard for block operation.
- Тип: `negative`
- Покрытие: `Manual QA: optional; E2E QA: required`
- Источники: [interfaces.md](./interfaces.md), [docs/system/contracts/user-role-and-blocking-management.md](../../contracts/user-role-and-blocking-management.md)
- Предусловия: actor exists without role `administrator`; target user exists.
- Тестовые данные: non-administrator actor; target user.
- Шаги:
  1. Non-administrator actor attempts to invoke block operation or reach the block UI route through the assigned test path.
  2. QA observes the result.
- Ожидаемый результат:
  1. Система должна return or surface `administrator-role-required`.
  2. Система должна keep target user state unchanged.
- Проверяемые инварианты:
  - Actor without role `administrator` cannot block users.
- E2E mapping:
  - Test file: `e2e/...` to be assigned by e2e QA child task.
  - Test title / ID: must include `FEATURE-005-SC-003`.
  - Required assertions: operation denied for non-administrator; target user remains not newly blocked by this attempt.

### `FEATURE-005-SC-004` — Missing target user returns not found

- Цель: подтвердить business error for missing target user.
- Тип: `negative`
- Покрытие: `Manual QA: optional; E2E QA: optional`
- Источники: [interfaces.md](./interfaces.md), [docs/system/contracts/user-role-and-blocking-management.md](../../contracts/user-role-and-blocking-management.md)
- Предусловия: administrator actor exists; assigned QA path can reference a missing target user.
- Тестовые данные: missing or stale target user identifier.
- Шаги:
  1. Administrator attempts to block a target user that does not exist.
  2. QA observes the operation outcome.
- Ожидаемый результат:
  1. Система должна return or surface `user-not-found`.
  2. Система должна показывать исход `user-not-found` вместо подтверждения успешной блокировки.
- Проверяемые инварианты:
  - `user-not-found` does not change user state.
- E2E mapping:
  - Test file: `e2e/...` if e2e QA child task assigns a direct operation path.
  - Test title / ID: must include `FEATURE-005-SC-004` if automated.
  - Required assertions: not-found outcome is visible or returned; no success confirmation is shown.

### `FEATURE-005-SC-005` — Unblock remains outside feature scope

- Цель: подтвердить, что `FEATURE-005` не принимает разблокировку как часть реализации или QA acceptance.
- Тип: `guard`
- Покрытие: `Manual QA: required; E2E QA: optional`
- Источники: [index.md](./index.md), [ui-behavior.md](./ui-behavior.md), [docs/system/ui-behavior-mapping/backoffice-ui-binding.md](../../ui-behavior-mapping/backoffice-ui-binding.md)
- Предусловия: users surface is available to administrator; target user may be blocked.
- Тестовые данные: administrator actor; blocked or blockable target user.
- Шаги:
  1. QA inspects the implemented `FEATURE-005` flow and assigned child task scope.
  2. QA checks that acceptance does not require `unblock_user`.
- Ожидаемый результат:
  1. Система должна keep unblock behavior outside `FEATURE-005` acceptance.
  2. Система должна keep blocked-user access denial as the terminal outcome for this feature.
- Проверяемые инварианты:
  - Разблокировка требует отдельного системного решения outside `FEATURE-005`.
- E2E mapping:
  - Test file: `e2e/...` only if e2e QA child task assigns UI-scope assertion.
  - Test title / ID: must include `FEATURE-005-SC-005` if automated.
  - Required assertions: no automated assertion may treat unblock as required behavior for `FEATURE-005`.

## Правила покрытия

- Каждый сценарий получает стабильный `Scenario ID`.
- Manual QA и e2e QA ссылаются на `Scenario ID` в результатах проверки.
- E2E tests must include `Scenario ID` in test title, annotation, tag or coverage comment.
- Coverage mapping fixes the future test file, test title and required assertions for each e2e-covered scenario.
- Scenario with `E2E QA: required` is covered only after a browser e2e test or assigned e2e-compatible check verifies required assertions.
- Scenario with `Manual QA: required` is covered only after manual pass and recorded QA result in `QA-*`.
- Expected behavior in scenarios must not introduce behavior absent from [behavior.md](./behavior.md), [interfaces.md](./interfaces.md), or [ui-behavior.md](./ui-behavior.md).

## QA feedback loop

- Reproducible defects found during manual QA or e2e QA are filed as `BUG-*` tasks under `FEATURE-005`.
- `BUG-*` task must reference affected `Scenario ID`, cause contour when known, reproduction steps, expected result and actual result.
- QA rechecks affected scenarios after blocking `BUG-*` tasks are closed.
- `FEATURE-005` can be completed only after required manual QA, required e2e QA and blocking defect rechecks are complete.

## Scope Constraints

- Один документ покрывает одну `FEATURE-005`.
- Сценарии описывают проверяемое поведение фичи из package slices.
- Результат manual QA хранится в `QA-*` карточке.

## Safety Constraints

- Ожидаемые результаты сценариев сохраняют смысл feature package, contracts and use cases.
- Ослабление e2e assertions требует предварительного обновления сценария через системную аналитику.
- Закрытие e2e QA требует соответствия automated coverage mapping сценариям с `E2E QA: required`.
