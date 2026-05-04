# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-013`
- Родительская задача: `FEATURE-005`
- Заголовок: `E2E блокировки пользователя`
- Единица поставки: `FEATURE-005`
- Роль: `Тестирование`
- Контурная карта: `docs/architecture/application-map/qa-access.md`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Цель

`Добавить или обновить browser e2e coverage для FEATURE-005 и зафиксировать mapping scenario IDs to test files, titles and assertions.`

## Границы задачи

- Выполняется после завершения `AR-009`, `BE-008`, `FE-009`, QA handoff и готовности test target.
- Входит required e2e coverage для `FEATURE-005-SC-001`, `FEATURE-005-SC-002` и `FEATURE-005-SC-003`.
- Входит optional e2e coverage для `FEATURE-005-SC-004` и `FEATURE-005-SC-005`, если QA target предоставляет устойчивый route and data.
- Входит запуск канонического browser e2e route и фиксация pass/fail evidence.
- Если отсутствуют test actor, second user, seed, fixture, test-mode route или QA target, задача создает resolver по правилам QA precondition вместо hard blocker.
- Не входит исправление frontend/backend/runtime дефектов.
- Не входит acceptance `unblock_user`.
- Расширенный маршрут чтения допустим, потому что e2e QA требует package slices, QA standard, access/runtime maps and scenario coverage mapping.

## QA preconditions and actor/data route

- E2E QA uses `docs/architecture/application-map/qa-access.md` section `FEATURE-005 QA actor and data route`.
- Administrator actor uses `E2E_TEST_TELEGRAM_ID`, `ADMIN_TELEGRAM_ID` or an equivalent documented test-mode administrator identity for the selected QA target.
- Target user and non-administrator actor use distinct non-secret test-mode identities that are resolved through `GET /backoffice/user-management/users`.
- If blocked-access coverage needs pre-block protected access, e2e setup prepares the target through the existing role-management route before running `FEATURE-005-SC-001`.
- `FEATURE-005-SC-002` attempts access as the blocked target user through a protected boundary after `blocked=true`.
- `FEATURE-005-SC-003` attempts the block operation as the non-administrator actor and verifies the target user state is unchanged by that attempt.
- Missing actor materialization, target visibility or protected access route is routed to a backend-owner resolver or `BUG-*` under `FEATURE-005`, not to a vague owner request.

## Зона ответственности

### Разрешенная зона правок

- `e2e/access/**`
- `e2e/support/**`
- `tasks/QA-013-e2e-administrator-user-blocking.md`
- `tasks/BUG-*.md` только для воспроизводимых дефектов под `FEATURE-005`.

### Запрещенная зона правок

- `backend/**`
- `frontend/**`
- `.github/**`, `docker-compose.deploy.yml`, `scripts/**`, `package.json`, lock files, `.env*`
- `.references/**`
- `docs/system/**`
- `docs/architecture/**`
- `tasks/archive/**`
- Задачи других feature scope.

## Маршрут чтения

- `process/prompts/qa/prompt.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/qa-access.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/backend-access.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/index.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/behavior.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/interfaces.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/ui-behavior.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/test-scenarios.md`

## Справочные ссылки

- `не требуются`

## Результат готовности

`E2E QA has automated coverage or a resolvable blocker for required FEATURE-005 scenarios, with scenario ID mapping, required assertions and run evidence recorded.`

## Проверки

- `npm run test:e2e`
- Проверить, что e2e tests include `FEATURE-005-SC-001`, `FEATURE-005-SC-002` and `FEATURE-005-SC-003` in title, annotation, tag or coverage comment.
- Проверить, что e2e result records test file, test title and required assertions for each covered Scenario ID.
- Проверить, что e2e setup/evidence references administrator actor, target user, non-administrator actor and blocked-user access attempt from `qa-access.md`.
- Проверить, что no e2e assertion treats `unblock_user` as required FEATURE-005 behavior.

## Результат выполнения

`2026-05-04: e2e QA lane выполнен. Добавлено browser e2e coverage в e2e/access/administrator-user-blocking.spec.ts; общий лог canonical run сохранен в .agent-work/FEATURE-005/worker-results/P10-e2e-run.log.`

- `FEATURE-005-SC-001`: `failed`. Test file: `e2e/access/administrator-user-blocking.spec.ts`. Test title: `FEATURE-005-SC-001 administrator blocks existing user`. Required assertions: target user reaches `blocked=true`, administrator sees updated blocked state, PATCH `/backoffice/user-management/users/:userId/block` has no request body, no assertion requires `unblock_user`. Actual result: action `Заблокировать` is rendered as disabled `v-list-item--disabled`, so PATCH is not sent. Existing defect route: `tasks/BUG-001-feature-005-block-user-action-disabled.md`.
- `FEATURE-005-SC-002`: `passed`. Test file: `e2e/access/administrator-user-blocking.spec.ts`. Test title: `FEATURE-005-SC-002 blocked user loses application access`. Required assertions: blocked actor receives `user-blocked` denial at session boundary; administrator can still open users surface.
- `FEATURE-005-SC-003`: `passed`. Test file: `e2e/access/administrator-user-blocking.spec.ts`. Test title: `FEATURE-005-SC-003 non-administrator cannot block user`. Required assertions: non-administrator operation returns `administrator-role-required`; target user remains `blocked=false`.
- Actor/data evidence: administrator actor `telegramId=1001`, target user `telegramId=95005001`, non-administrator actor `telegramId=95005002`; blocked-user access attempt is represented through `POST /backoffice/auth/session` denial `user-blocked` per `qa-access.md`.
- Check `npm run test:e2e`: `failed`, 30 passed / 4 failed. FEATURE-005 failure is covered by existing `BUG-001`; three additional failures are existing `menu-catalog` suite failures outside `FEATURE-005` scope and were not routed as `FEATURE-005` defects.
- Scope guard: no e2e assertion treats `unblock_user` as required `FEATURE-005` behavior.
- P14 focused recheck `2026-05-04`: `failed`. Command `npm run test:e2e -- --grep "FEATURE-005-SC-001"` ran 1 browser test against the published QA target and failed because the `Заблокировать` list item remained disabled; `PATCH /backoffice/user-management/users/:userId/block` was not sent. `FEATURE-005-SC-001` remains blocked by QA target/deploy representation of the P13 fix.
- R04 deploy/target resolver `2026-05-04`: `blocked`. Repository evidence shows P13 frontend fix files remain uncommitted relative to `HEAD`/`origin/main` `a775755e640c3d857c756bc0d5dba8f9c38f8675`; the documented `main -> test-e2e` deploy route can publish only versioned images built from a GitHub SHA. No repo-owned evidence currently proves that the published QA target represents the P13 fix, so focused SC-001 e2e recheck is not restored until `test-e2e` is rolled out from a commit containing that fix or equivalent non-secret deploy evidence identifies such a deployed commit.
