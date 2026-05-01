# Карточка задачи

## Карточка задачи

- Идентификатор: `BUG-003`
- Родительская задача: `FEATURE-004`
- Заголовок: `Диалог назначения роли не соответствует desktop parity`
- Единица поставки: `FEATURE-004`
- Роль: `Фронтенд`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Цель

`Исправить воспроизводимое frontend-расхождение F004-SC-008: на desktop диалог назначения роли должен открываться как центрированный modal, а меню действий пользователя должно закрываться перед показом диалога.`

## Границы задачи

- Контур причины: `frontend`.
- Входит исправление desktop-позиционирования `AssignRoleDialog` для вкладки `Пользователи`.
- Входит закрытие меню действий пользователя после выбора `Назначить роль`.
- Входит проверка, что варианты `Бариста` и `Администратор`, primary action `Назначить роль` и secondary action `Отмена` остаются видимыми.
- Не входит изменение backend role assignment behavior.
- Не входит изменение `.references/Expressa_admin`.
- Не входит добавление новых действий управления пользователями.

## Зона ответственности

### Разрешенная зона правок

- `frontend/src/components/users/AssignRoleDialog.vue`
- `frontend/src/components/users/UserActionsMenu.vue`
- `frontend/src/ui/UiDialogShell.vue`
- `frontend/src/views/UsersView.vue`
- `frontend/src/modules/users/*.spec.ts`
- `frontend/src/components/users/*.spec.ts`, если потребуется добавить focused test

### Запрещенная зона правок

- `backend/**`
- `e2e/**`
- `docs/system/**`
- `docs/business/**`
- `.references/**`
- Deployment/runtime configuration

## Маршрут чтения

- `tasks/BUG-003-users-role-dialog-desktop-parity.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/ui-behavior.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `.references/Expressa_admin/src/app/components/AssignRoleDialog.tsx`
- `.references/Expressa_admin/src/app/components/UserActionsMenu.tsx`
- `docs/architecture/application-map/frontend-backoffice.md`

## Справочные ссылки

- `tasks/QA-008-manual-administrator-user-role-management.md` — QA evidence по `F004-SC-008`.

## Результат готовности

`На desktop viewport 1280x900 выбор Назначить роль закрывает user actions menu и открывает полностью видимый центрированный dialog, соответствующий .references/Expressa_admin/src/app/components/AssignRoleDialog.tsx.`

## Проверки

- Вручную открыть `Пользователи` на desktop viewport `1280x900`, открыть меню активного пользователя и выбрать `Назначить роль`.
- Проверить, что меню действий не остается видимым под dialog overlay.
- Проверить, что dialog не прижат к нижнему краю viewport и полностью видим без вертикального clipping.
- Проверить `F004-SC-008` для labels `Бариста`, `Администратор`, `Назначить роль`, `Отмена`.
- `npm run test:frontend`
- `npm run typecheck:frontend`

## Результат выполнения

`2026-05-01: исправлено desktop-позиционирование AssignRoleDialog через UiDialogShell и закрытие UserActionsMenu перед открытием диалога. Проверки: npm run test:frontend, npm run typecheck:frontend, npm run lint:frontend, npm run stylelint:frontend, npm run format:check:frontend; manual browser check 1280x900 с mock backend подтвердил, что menu закрыт, dialog полностью видим и labels Бариста/Администратор/Назначить роль/Отмена отображаются. Focused component test не добавлен, потому что текущий frontend Vitest настроен на node environment без component mount harness.`
