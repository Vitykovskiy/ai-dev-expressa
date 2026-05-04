# Карточка задачи

## Карточка задачи

- Идентификатор: `BUG-001`
- Родительская задача: `FEATURE-005`
- Заголовок: `UI не позволяет заблокировать активного пользователя из users surface`
- Единица поставки: `FEATURE-005`
- Роль: `Фронтенд`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Цель

`Исправить frontend-дефект, из-за которого administrator не может инициировать block_user для активного target user через users surface.`

## Границы задачи

- Входит исправление доступности и выполнения действия `Заблокировать` для существующего активного target user в `/users`.
- Входит обновление success/error feedback и строки пользователя после успешного `block_user`, если это затронуто причиной дефекта.
- Входит frontend evidence для сценария `FEATURE-005-SC-001`.
- Не входит `unblock_user`.
- Не входит изменение backend contract, runtime, deployment или e2e lane.

## Дефект

- Scenario ID: `FEATURE-005-SC-001`.
- QA target: `https://expressa-e2e-test.vitykovskiy.ru`.
- Actor: administrator test-mode telegramId `1`.
- Target user: telegramId `777008`, userId `fbafdfc5-1ab9-46c1-90bd-c901b71ee7fc`, role `barista`, initial `blocked=false`.
- Reproduction steps:
  1. Open `/users` as administrator.
  2. Find target user `Telegram 777008`.
  3. Open target user's actions menu.
  4. Try to choose `Заблокировать`.
- Expected result: administrator can initiate `block_user`; system confirms successful block and updates the target user state to `blocked`.
- Actual result: the `Заблокировать` menu item is rendered disabled for the active target user, so the UI route cannot initiate blocking.
- Contour cause: `frontend`.
- QA evidence: `tasks/QA-012-manual-administrator-user-blocking.md`.

## Зона ответственности

### Разрешенная зона правок

- `frontend/src/views/UsersView.vue`
- `frontend/src/components/users/**`
- `frontend/src/modules/users/**`
- `frontend/src/modules/users/*.spec.ts`
- `tasks/BUG-001-feature-005-block-user-action-disabled.md`

### Запрещенная зона правок

- `backend/**`
- `e2e/**`
- `.github/**`, `docker-compose.deploy.yml`, `scripts/**`, `package.json`, lock files, `.env*`
- `.references/**`
- `docs/system/**`
- `docs/architecture/**`
- `tasks/archive/**`
- Задачи других feature scope.

## Маршрут чтения

- `process/prompts/frontend/prompt.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/index.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/behavior.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/interfaces.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/ui-behavior.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/test-scenarios.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `tasks/QA-012-manual-administrator-user-blocking.md`

## Справочные ссылки

- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/ConfirmDialog.tsx`

## Результат готовности

`Administrator can initiate block_user for an active target user from users surface, and FEATURE-005-SC-001 can be rechecked without the disabled-action defect.`

## Проверки

- Reproduce `FEATURE-005-SC-001` before the fix or use QA evidence from `QA-012`.
- `npm run lint --prefix frontend`
- `npm run typecheck --prefix frontend`
- `npm test --prefix frontend`
- Focused manual recheck: `/users` action menu for active target user allows `Заблокировать` and does not add `unblock_user` acceptance.

## Результат выполнения

`2026-05-04: исправлен frontend disabled-state действия block_user. Изменены frontend/src/components/users/UserActionsMenu.vue, frontend/src/components/users/UsersList.vue, frontend/src/modules/users/presentation.ts, frontend/src/modules/users/presentation.spec.ts. Активный target user больше не наследует disabled-state block action от общего busy-state строки; block action отключается только для already blocked user или активной block operation. Проверки: npm run lint --prefix frontend, npm run typecheck --prefix frontend, npm test --prefix frontend — пройдены. Focused manual recheck на /users не запускался локально, потому что P14 остается отдельным QA recheck step. Scope guard: unblock_user не добавлен и не принят как критерий FEATURE-005.`

`2026-05-04 P14 QA recheck: focused e2e command npm run test:e2e -- --grep "FEATURE-005-SC-001" against https://expressa-e2e-test.vitykovskiy.ru failed: the users surface still rendered Заблокировать as disabled and no block PATCH was sent. BUG-001 is not accepted by QA on the published target until the QA target/deploy resolver confirms the P13 fix is represented and FEATURE-005-SC-001 passes.`

`2026-05-04 R04 deploy/target resolver: repository evidence shows the P13 frontend fix files remain uncommitted relative to HEAD/origin main a775755e640c3d857c756bc0d5dba8f9c38f8675. The documented main -> test-e2e deploy route publishes versioned images from a GitHub SHA, and no repo-owned deploy evidence currently proves that the published target represents the P13 fix. BUG-001 remains fixed in the frontend task evidence but not accepted by QA on the published target until test-e2e is rolled out from a commit containing the fix or equivalent non-secret deploy evidence identifies such a deployed commit.`
`2026-05-04 P14 QA recheck after deploy: BUG-001 accepted by QA on https://expressa-e2e-test.vitykovskiy.ru. Manual browser recheck for FEATURE-005-SC-001 confirmed the active target user action Заблокировать is selectable, PATCH /backoffice/user-management/users/4864b74b-0554-4c73-8e0c-6f7b51a939a3/block returns 200, the users row changes to Заблокирован, and success status is shown. Focused e2e recheck command npm run test:e2e -- --grep "FEATURE-005-SC-001" --reporter=line --output .agent-work/FEATURE-005/worker-results/P14-playwright-output passed 1/1. unblock_user remains outside FEATURE-005 acceptance.`
