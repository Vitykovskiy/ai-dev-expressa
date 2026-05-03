# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-010`
- Родительская задача: `FEATURE-008`
- Заголовок: `Ручное тестирование tooling-first alignment`
- Единица поставки: `FEATURE-008`
- Роль: `Тестирование`
- Контурная карта: `docs/architecture/application-map/qa-access.md`; `docs/architecture/application-map/qa-menu-catalog.md`; `docs/architecture/application-map/qa-slot-settings.md`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Цель

`Провести ручную regression-приемку результата tooling-first alignment и подтвердить, что пользовательское поведение административного контура сохранено.`

## Границы задачи

### Behavioral Requirements

- Система должна проверить затронутые backoffice routes после `FE-008`, `BE-007` и `DO-010`.
- Система должна сравнить наблюдаемое поведение с текущими feature scenarios и QA application maps.
- Система должна проверить, что tooling-first рефакторинг не изменил auth/session bootstrap, capability guards, role-based navigation, menu catalog behavior, slot settings behavior и users role-management behavior.
- Система должна фиксировать воспроизводимые дефекты как `BUG-*` под `FEATURE-008` или исходной feature с явной меткой контура причины.

### Назначенные инструменты и официальная документация

- Playwright reports and traces: `https://playwright.dev/docs/test-reporters`
- Playwright trace viewer: `https://playwright.dev/docs/trace-viewer`
- QA standards: `docs/architecture/qa-standards.md`

### Scope Constraints

- Задача охватывает manual QA acceptance и defect handoff.
- Изменение production-кода, e2e tests, system contracts, architecture standards и approved UI source находится вне области задачи.

### Safety Constraints

- QA не утверждает новое поведение по production-коду.
- QA фиксирует blocker, если canonical scenario или contract не позволяет однозначно принять поведение.
- QA создает `BUG-*` только для воспроизводимых дефектов с установленным контуром причины.

## Зона ответственности

### Разрешенная зона правок

- `tasks/QA-010-manual-tooling-first-regression.md`
- `tasks/BUG-*.md` только для воспроизводимых дефектов, найденных при ручной приемке

### Запрещенная зона правок

- `frontend/**`
- `backend/**`
- `e2e/**`
- `.github/**`
- `scripts/**`
- `docs/system/**`
- `docs/architecture/**`
- `docs/business/**`
- `.references/**`

## Маршрут чтения

- `process/workflow.md`
- `docs/architecture/qa-standards.md`
- `docs/architecture/application-map/qa-access.md`
- `docs/architecture/application-map/qa-menu-catalog.md`
- `docs/architecture/application-map/qa-slot-settings.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `docs/architecture/application-map/delivery-and-runtime.md`

## Справочные ссылки

- `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.test-scenarios.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`
- `docs/system/feature-specs/feature-004-administrator-user-role-management/test-scenarios.md`
- `https://playwright.dev/docs/test-reporters`
- `https://playwright.dev/docs/trace-viewer`

## Результат готовности

`Manual QA подтверждает сохранение пользовательского поведения после tooling-first alignment либо создает воспроизводимые BUG-* задачи с контуром причины и ссылкой на affected scenario.`

## Проверки

- Ручная проверка входа administrator и отказа для недостаточных прав.
- Ручная проверка navigation visibility для `barista` и `administrator`.
- Ручная проверка `/menu` по основным сценариям управления каталогом без повторной постановки `BUG-004`.
- Ручная проверка `/settings` по сценарию чтения и сохранения настроек слотов.
- Ручная проверка `/users` по сценарию просмотра пользователей и назначения роли.
- Проверка, что все найденные дефекты оформлены как `BUG-*` или явно отсутствуют.

## Результат выполнения

`2026-05-02` — ручная приемка начата на локальном test-mode окружении:

- Environment: `http://localhost:5173` + `http://127.0.0.1:3000`, `testTelegramId=123456789`.
- `FTS-001-001`, `FTS-001-002`, `FTS-001-003`: administrator bootstrap прошел, session вернула `roles=["administrator"]`, `capabilities=["orders","availability","menu","users","settings"]`, видимы вкладки `Заказы`, `Доступность`, `Меню`, `Пользователи`, `Настройки`.
- `FTS-002-001`, `FTS-002-002`: вкладка `Меню` открылась, создана группа `QA кофе 008`, создан товар `QA американо 008` с ценой `180 ₽`, товар отображается внутри группы.
- `FTS-003-001`, `FTS-003-002`: вкладка `Настройки` открылась, вместимость слота изменена на `6`, сохранение завершилось сообщением `Настройки сохранены`.
- `F004-SC-001`, `F004-SC-002`, `F004-SC-008`: вкладка `Пользователи` открылась, список содержит administrator `Telegram 123456789`, поиск по `123456789` фильтрует список, вкладка `Баристы` показывает empty state, dialog `Назначить роль` открывается и показывает роли `Бариста` и `Администратор`.

Initial blocker: обязательные сценарии `FTS-001-004`, `FTS-001-005`, `FTS-001-006`, `FTS-002-007`, `FTS-003-005`, `F004-SC-003`, `F004-SC-004`, `F004-SC-005`, `F004-SC-006`, `F004-SC-007` не были закрыты до resolver `R03`, потому что текущий QA route не предоставлял второго backoffice user. Попытка подготовить пользователя через штатный test-mode bootstrap `POST /backoffice/auth/session` с `testTelegramId=777008` вернула `403 backoffice-user-not-found`.

Resolver `R02-qa-manual-test-data-route`: по `QA-010`, `qa-access.md` и `delivery-and-runtime.md` документирован только local/test-mode route для `ADMIN_TELEGRAM_ID=123456789` и `VITE_BACKOFFICE_TEST_TELEGRAM_ID=123456789`. Документированный repo-scoped route для создания или использования второго backoffice user не найден. Повторная проверка уже запущенного local API подтвердила `GET /health -> 200` и `POST /backoffice/auth/session` с `testTelegramId=777008 -> 403`.

Дефекты не созданы: наблюдаемое поведение является QA precondition gap, а не подтвержденным product regression defect с ясным контуром причины.

Blocker status: resolver `R03-backend-test-mode-second-actor` снял blocker; после повторной проверки `P05-manual-qa` закрыта.

Resolver `R03-backend-test-mode-second-actor`: backend test-mode bootstrap теперь создает repo-scoped lower-privilege fixture только при `NODE_ENV=test DISABLE_TG_AUTH=true`. Manual QA может использовать существующий session contract с `testTelegramId=777008`; ожидаемый actor имеет `roles=["barista"]` и `capabilities=["orders","availability"]`. Для проверки отказов administrator-only routes использовать тот же `testTelegramId=777008`; production Telegram auth restrictions и public API shape не менялись. Проверки resolver пройдены: `npm run lint:backend`, `npm run format:check:backend`, `npm run typecheck:backend`, `npm run test:backend`.

`2026-05-02` — ручная приемка продолжена после `R03` на локальном test-mode окружении:

- Environment: `http://localhost:5173` + `http://127.0.0.1:3000`; administrator `testTelegramId=123456789`; lower-privilege actor `testTelegramId=777008`.
- `FTS-001-004`, `FTS-002-007`, `FTS-003-005`, `F004-SC-004`, `F004-SC-005`: browser route с `testTelegramId=777008` вернул actor `roles=["barista"]`, `capabilities=["orders","availability"]`; UI показал только вкладки `Заказы` и `Доступность`; прямые `/menu`, `/settings`, `/users` показали `403 Доступ к этой вкладке запрещён`.
- `FTS-001-005`: simulated auth failure `401 backoffice-auth-failed` показал экран `Вход в backoffice недоступен` без рабочих вкладок.
- `FTS-001-006`: `POST /backoffice/auth/session` с `testTelegramId=777008` больше не возвращает roleless/unknown user; actor получает только backoffice capability `orders` и `availability`, administrator-only рабочие экраны недоступны.
- `F004-SC-001`, `F004-SC-002`, `F004-SC-003`: вкладка `Пользователи` показывает administrator `Telegram 123456789` и barista `Telegram 777008`; administrator assignment boundary `PATCH /backoffice/user-management/users/:id/role` с `assignedRole=barista` успешно возвращает target user с ролью `barista`.
- `F004-SC-006`: `PATCH /backoffice/user-management/users/:id/role` с `assignedRole=owner` отклонен `400`; роли target user не изменились.
- `F004-SC-007`: `PATCH /backoffice/user-management/users/:id/role` из barista context отклонен `403`; main-administrator guard не ослаблен.
- Defect handoff: новых воспроизводимых дефектов не найдено; `BUG-004` scope не дублировался.
- Итог: manual QA acceptance для `FEATURE-008` пройдена на доступном local test-mode route; блокеров для `P06-e2e-qa` не осталось.
