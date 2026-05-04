# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-009`
- Родительская задача: `FEATURE-005`
- Заголовок: `UI блокировки пользователя`
- Единица поставки: `FEATURE-005`
- Роль: `Фронтенд`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Цель

`Реализовать backoffice users flow для действия block_user и отображения blocked state без добавления unblock behavior.`

## Границы задачи

- Зависит от завершения `AR-009` и backend handoff `BE-008`.
- Входит binding UI action `block_user` на backend contract, success notification, обновление строки пользователя и отображение blocked state.
- Входит отображение documented errors `administrator-role-required` и `user-not-found` без добавления новых бизнес-состояний.
- Входит parity с versioned UI reference для users surface в пределах accepted FEATURE-005 scope.
- Не входит `unblock_user`, назначение ролей, изменение route guard semantics и runtime config.
- Расширенный маршрут чтения допустим, потому что UI task требует package slices, architecture map, UI mapping и versioned design source.
- Если после `AR-009` не зафиксирован frontend API boundary для `Block user`, задача фиксирует blocker вместо восстановления API shape из backend-кода.

## Зона ответственности

### Разрешенная зона правок

- `frontend/src/views/UsersView.vue`
- `frontend/src/components/users/**`
- `frontend/src/modules/users/**`
- `frontend/src/ui/**` только если требуется существующий или новый reusable primitive по `frontend-ui-kit.md`.
- `frontend/src/**/*.spec.ts` только для affected users flow coverage.
- `docs/architecture/application-map/frontend-backoffice.md` только если реализация меняет frontend implementation map.
- `tasks/FE-009-administrator-user-blocking-ui.md`

### Запрещенная зона правок

- `backend/**`
- `e2e/**`
- `.github/**`, `docker-compose.deploy.yml`, `scripts/**`, `package.json`, lock files, `.env*`
- `.references/**`
- `docs/system/**`
- `tasks/archive/**`
- Задачи других feature scope.

## Маршрут чтения

- `process/prompts/frontend/prompt.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/frontend-ui-kit.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/index.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/behavior.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/interfaces.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/ui-behavior.md`
- `docs/system/feature-specs/FEATURE-005-administrator-user-blocking/test-scenarios.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/ConfirmDialog.tsx`

## Справочные ссылки

- `не требуются`

## Результат готовности

`Administrator can initiate block_user from /users, sees documented success/error states, and the users representation updates to blocked without accepting unblock behavior.`

## Проверки

- `cd frontend && npm run lint`
- `cd frontend && npm run stylelint`
- `cd frontend && npm run format:check`
- `cd frontend && npm run typecheck`
- `cd frontend && npm test`
- `cd frontend && npm run build`
- Проверить, что `unblock_user` не принят как часть реализации FEATURE-005.

## Результат выполнения

`2026-05-04: UI блокировки пользователя выполнен. Изменены frontend/src/views/UsersView.vue, frontend/src/components/users/UserActionsMenu.vue, frontend/src/components/users/UsersList.vue, frontend/src/modules/users/api.ts, store.ts, types.ts, presentation.ts и focused users specs. Реализован вызов PATCH /backoffice/user-management/users/:userId/block без request body, обновление target row по response { user }, success snackbar, error snackbar для administrator-role-required/user-not-found и disabled busy state на строке. Parity: используется существующий users surface, фильтр "Заблокированные", destructive action "Заблокировать" из users actions; unblock не добавлен как accepted behavior и backend API для unblock не реализован. Проверки: npm run lint, npm run stylelint, npm run format:check, npm run typecheck, npm test, npm run build — пройдены.`
