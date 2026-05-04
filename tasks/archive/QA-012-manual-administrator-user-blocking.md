# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-012`
- Родительская задача: `FEATURE-005`
- Заголовок: `Ручное тестирование блокировки пользователя`
- Единица поставки: `FEATURE-005`
- Роль: `Тестирование`
- Контурная карта: `docs/architecture/application-map/qa-access.md`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Цель

`Провести manual QA acceptance для FEATURE-005 по stable scenario IDs и зафиксировать pass/fail evidence или BUG-* задачи.`

## Границы задачи

- Выполняется после завершения `AR-009`, `BE-008`, `FE-009` и QA handoff.
- Входит ручная проверка `FEATURE-005-SC-001`, `FEATURE-005-SC-002` и `FEATURE-005-SC-005`.
- Входит optional ручная проверка `FEATURE-005-SC-003` и `FEATURE-005-SC-004`, если QA target предоставляет устойчивый route and data.
- Входит defect triage с созданием `BUG-*` под `FEATURE-005`, если дефект воспроизводим и контур причины ясен.
- Не входит исправление frontend/backend/runtime дефектов.
- Не входит acceptance `unblock_user`.
- Расширенный маршрут чтения допустим, потому что manual QA проверяет сценарии, UI behavior, QA standard, access map и versioned UI source.

## QA preconditions and actor/data route

- Manual QA uses `docs/architecture/application-map/qa-access.md` section `FEATURE-005 QA actor and data route`.
- Administrator actor uses the documented test-mode administrator identity for the selected QA target.
- Target user is a distinct non-secret test-mode identity resolved through the users list before blocking.
- If the target user does not have protected application access before blocking, QA prepares that precondition through the existing role-management route and records it as setup evidence.
- Blocked-user access denial is checked with the target user's identity after `blocked=true` at a protected application boundary.
- Manual QA does not require `unblock_user` and does not use unblock as cleanup or acceptance evidence.

## Зона ответственности

### Разрешенная зона правок

- `tasks/QA-012-manual-administrator-user-blocking.md`
- `tasks/BUG-*.md` только для воспроизводимых дефектов под `FEATURE-005`.

### Запрещенная зона правок

- `backend/**`
- `frontend/**`
- `e2e/**`
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
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/index.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/behavior.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/ui-behavior.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/test-scenarios.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`

## Справочные ссылки

- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/interfaces.md`

## Результат готовности

`Manual QA result records scenario-level pass/fail evidence for required FEATURE-005 scenarios, confirms no-unblock acceptance, and routes reproducible defects to BUG-* if present.`

## Проверки

- Manual route from `test-scenarios.md` for `FEATURE-005-SC-001`.
- Manual route from `test-scenarios.md` for `FEATURE-005-SC-002`.
- Manual scope guard from `test-scenarios.md` for `FEATURE-005-SC-005`.
- Проверить, что evidence фиксирует administrator actor, target user, blocked-user access attempt and QA target route from `qa-access.md`.
- Проверить, что QA result references stable Scenario IDs.
- Проверить, что every reproducible defect has expected result, actual result, reproduction steps and contour cause when known.

## Результат выполнения

`2026-05-04: manual QA выполнен на https://expressa-e2e-test.vitykovskiy.ru. Administrator actor: test-mode telegramId=1; target user: telegramId=777008, userId=fbafdfc5-1ab9-46c1-90bd-c901b71ee7fc, role=barista, initial blocked=false.`

- `FEATURE-005-SC-001`: `failed`. Users surface показывает target user как `Бариста` / `Активен`, но действие `Заблокировать` в меню target user отображается disabled и не позволяет инициировать `block_user`. Создан `tasks/BUG-001-feature-005-block-user-action-disabled.md`.
- `FEATURE-005-SC-002`: `blocked by FEATURE-005-SC-001 failure`. До блокировки target user имеет защищенный доступ через `GET /backoffice/orders` с `x-test-telegram-id=777008`; blocked-user denial не проверен, потому что блокировка через users surface недоступна.
- `FEATURE-005-SC-005`: `passed`. Manual acceptance не использует `unblock_user` как cleanup или критерий закрытия `FEATURE-005`.
- Optional `FEATURE-005-SC-003` и `FEATURE-005-SC-004`: `not executed`; required manual lane остановлен на воспроизводимом дефекте основного UI route.
- Supporting check: documented direct block proxy `PATCH /backoffice/user-management/users/:userId/block` on the same target returned `404` on the published QA target; this is recorded as supporting evidence for follow-up in e2e/bug-loop, not as a separate manual-lane contour assignment.
- P14 focused recheck `2026-05-04`: `blocked`. Focused browser e2e route `npm run test:e2e -- --grep "FEATURE-005-SC-001"` against `https://expressa-e2e-test.vitykovskiy.ru` still rendered `Заблокировать` as disabled for the target user and did not send the block PATCH. Manual pass evidence is not recorded until the QA target/deploy resolver confirms the P13 fix is represented by the checked target.
- R04 deploy/target resolver `2026-05-04`: `blocked`. Repository evidence shows P13 frontend fix files remain uncommitted relative to `HEAD`/`origin/main` `a775755e640c3d857c756bc0d5dba8f9c38f8675`; the documented `main -> test-e2e` deploy route can publish only versioned images built from a GitHub SHA. No repo-owned evidence currently proves that the published QA target represents the P13 fix, so SC-001 remains blocked until `test-e2e` is rolled out from a commit containing that fix or equivalent non-secret deploy evidence identifies such a deployed commit.
- P14 focused recheck after deploy `2026-05-04`: `FEATURE-005-SC-001 passed`. Manual browser check on `https://expressa-e2e-test.vitykovskiy.ru/users` used administrator actor `telegramId=1` and target user `Telegram 777008`. Users surface showed the target as `Бариста` / `Активен`; the `Заблокировать` action was selectable, sent `PATCH /backoffice/user-management/users/4864b74b-0554-4c73-8e0c-6f7b51a939a3/block` with status `200`, updated the row to `Заблокирован`, and showed status text `Пользователь "Telegram 777008" заблокирован`. Evidence artifacts: `.agent-work/FEATURE-005/worker-results/P14-manual-recheck-snapshot.txt`, `.agent-work/FEATURE-005/worker-results/P14-manual-recheck.png`. Scope guard: `unblock_user` was not used as cleanup or acceptance.
