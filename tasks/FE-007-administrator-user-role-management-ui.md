# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-007`
- Родительская задача: `FEATURE-004`
- Заголовок: `Интерфейс управления ролями пользователей`
- Единица поставки: `FEATURE-004`
- Роль: `Фронтенд`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Цель

`Реализовать вкладку Пользователи во внутреннем административном контуре: список пользователей, поиск/фильтры, меню действия Назначить роль, диалог выбора роли и обновление строки после backend response.`

## Границы задачи

- Входит замена stub на route-level экран `/users` для administrator-only users-flow.
- Входит client API boundary для `GET /backoffice/user-management/users` и `PATCH /backoffice/user-management/users/:userId/role`.
- Входит отображение loading, empty, success, error, inline-error и disabled states из feature package.
- Входит UI parity с `.references/Expressa_admin` для вкладки `Пользователи`, меню `Назначить роль` и `AssignRoleDialog`.
- Маршрут чтения шире обычного FE read set, потому что package role route требует одновременно feature slices, UI contract и конкретные versioned reference files.
- Не входит блокировка, разблокировка, создание пользователя и снятие роли `barista`.
- Не входит изменение backend API, e2e suite, deployment route или системных документов.

## Зона ответственности

### Разрешенная зона правок

- `frontend/src/views/UsersView.vue`
- `frontend/src/components/users/**`
- `frontend/src/modules/users/**`
- `frontend/src/router/index.ts` только для подключения `UsersView` к существующему route `/users`
- `frontend/src/modules/navigation/**` только если требуется сохранить/проверить существующую capability `users`
- `frontend/src/ui/**` только при необходимости переиспользуемого backoffice primitive, подтвержденной `frontend-backoffice.md`
- `frontend/src/**/*.spec.ts` для unit/component-level проверок затронутого клиентского контура

### Запрещенная зона правок

- `backend/**`
- `e2e/**`
- `docs/system/**`
- `docs/business/**`
- `.references/**`
- Runtime/deployment configuration
- Реализация операций `block_user`, `unblock_user`, `revoke_barista` и создания пользователя

## Маршрут чтения

- `docs/system/feature-specs/feature-004-administrator-user-role-management/index.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/interfaces.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/ui-behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `.references/Expressa_admin/src/app/screens/UsersScreen.tsx`
- `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx`
- `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`

## Справочные ссылки

- `.references/Expressa_admin/src/app/components/AddUserDialog.tsx` — только для подтверждения out-of-scope создания пользователя при UI parity review.

## Результат готовности

`Administrator видит вкладку Пользователи, получает список пользователей из backend, назначает роль barista или administrator через диалог, видит результат операции, а final authorization и capabilities остаются backend-owned.`

## Проверки

- `npm --prefix frontend run lint`
- `npm --prefix frontend run stylelint`
- `npm --prefix frontend run format:check`
- `npm --prefix frontend run typecheck`
- `npm --prefix frontend test`
- `npm --prefix frontend run build`
- Ручная проверка локального `/users`: список или empty state, фильтры, меню `Назначить роль`, роли `Бариста` и `Администратор`, success/error states.

## Результат выполнения

`не заполнено`
