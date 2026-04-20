# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-002`
- Родительская задача: `FEATURE-002`
- Заголовок: `Ручное тестирование управления каталогом меню administrator`
- Описание: `Нужно вручную проверить собранную FEATURE-002: administrator во вкладке Меню управляет категориями, товарами, ценами, размерной моделью напитков S/M/L, группами дополнительных опций, опциями и назначением групп на категории; пользователь без capability menu не может выполнить сценарий. Manual QA также сверяет live-интерфейс с backoffice UI contract и .references/Expressa_admin, фиксирует exploratory findings и оформляет воспроизводимые defects через BUG-задачи с меткой контура причины.`
- Единица поставки: `FEATURE-002`
- Роль: `Тестирование`
- Приоритет: `Критический`
- Статус: `В тестировании`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`
- Контурная карта: `docs/architecture/application-map/qa-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`

## Примечания

- Зависимости: `BE-002`, `FE-002`
- Минимальный read set: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`
- Ожидаемый результат для ревью: `Есть manual QA evidence по пользовательским сценариям управления каталогом меню, negative evidence для доступа без capability menu, desktop/mobile UI parity evidence против backoffice UI contract и .references/Expressa_admin, а также список заведенных BUG-задач с метками контура причины или явное подтверждение, что воспроизводимые product defects не обнаружены.`
- Проверки: `Ручные сценарии: открыть вкладку Меню после backoffice session; создать категорию; создать товар в категории; задать цены S/M/L для напитка; создать группу дополнительных опций через toggle "Группа опций"; создать платные и бесплатные опции как товары внутри этой группы, где цена 0 означает бесплатную опцию; назначить группу на категорию через "Выбрать группу опций"; проверить отказ пользователю без capability menu. UI parity: desktop/mobile сравнение экрана Меню и диалогов категорий/товаров с .references/Expressa_admin. Exploratory checks: empty/error/disabled states, validation messages, responsive behavior. Defect handoff: список созданных BUG-задач с метками frontend/backend/devops/documentation или подтверждение отсутствия воспроизводимых defects.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-menu-catalog.md, если меняются manual acceptance path, UI parity route, required manual evidence или зона ответственности QA по menu catalog.`
- Критерии готовности: `Manual QA-задача завершена, когда ручные пользовательские сценарии и UI parity FEATURE-002 подтверждены, все воспроизводимые defects оформлены через BUG-задачи с метками контура причины или явно отсутствуют, а закрытие FEATURE-002 остается заблокированным только при незавершенной E2E QA-005 или открытых blocking BUG-задачах.`

## Результат выполнения

### Снятие стартового блокера

- Предыдущий процессный блокер снят: на момент продолжения `FEATURE-002` имеет статус `Ожидает тестирования`, `FE-002` и `BE-002` имеют статус `Выполнена`.
- `QA-002` переведена в `В тестировании`; обязательный read set прочитан: `prompts/qa/prompt.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md` и указанные `.references/Expressa_admin` материалы.

### Окружение и метод

- Окружение: local test-mode, backend `http://127.0.0.1:3000`, frontend `http://localhost:5173/menu`.
- Env route: `backend/.env.local` с `NODE_ENV=test`, `DISABLE_TG_AUTH=true`, `ADMIN_TELEGRAM_ID=123456789`; `frontend/.env.local` с `VITE_BACKOFFICE_API_BASE_URL=http://127.0.0.1:3000`, `VITE_BACKOFFICE_TEST_TELEGRAM_ID=123456789`.
- Smoke перед ручной проверкой: `GET /health` вернул `{"status":"ok"}`; `POST /backoffice/auth/session` для `123456789` вернул `administrator` с capabilities `orders`, `availability`, `menu`, `users`, `settings`; начальный `GET /backoffice/menu/catalog` вернул пустой snapshot.
- UI evidence снимался через live frontend в desktop и mobile viewport; текстовые browser snapshots зафиксировали доступные элементы экрана и модалок.

### Manual scenario evidence

- Открытие вкладки `Меню` после backoffice session: `PASS`. `/menu` открылся под `Администратор`, видны административные вкладки и действия `Добавить группу` / `Добавить товар`.
- Empty state: `PASS`. При пустом каталоге показано `Меню пусто` / `Добавьте первую группу для начала работы`; `Добавить товар` disabled.
- Создание категории: `FAIL/BLOCKED BY BUG-001`. `POST /backoffice/menu/categories` вернул `201`, backend snapshot содержит категорию `Кофе`, но UI после сохранения завис в модалке `Новая группа` с busy/disabled state. После reload категория отображается.
- Создание товара в категории: `FAIL/BLOCKED BY BUG-001`. Товар `Брауни` с `basePrice=250` сохраняется в backend snapshot, но UI после `Добавить товар` зависает в busy/disabled state. После reload товар отображается в категории.
- Напиток с ценами `S/M/L`: `FAIL/BLOCKED BY BUG-001`. Напиток `Капучино` сохраняется в backend snapshot с `drinkSizePrices`: `S=180`, `M=220`, `L=260`, но UI после сохранения зависает до reload.
- Создание группы дополнительных опций: `FAIL/BLOCKED BY BUG-001`; `BUG-002` закрыт как ошибка документации. Канонический UI-flow: открыть `Добавить группу`, включить toggle `Группа опций`, сохранить группу. На проверенном проходе сохранение было заблокировано зависанием после save из `BUG-001`.
- Создание платных и бесплатных опций: `BLOCKED BY BUG-001 / RETEST REQUIRED`. После сохранения группы с флагом `Группа опций` нужно добавить товары в эту группу: товар с ценой `0` считается бесплатной опцией, товар с ценой `>0` считается платной опцией.
- Назначение группы дополнительных опций на категорию: `BLOCKED BY BUG-001 / RETEST REQUIRED`. После успешного создания группы опций через toggle обычная группа назначает ее через select `Выбрать группу опций`.
- Negative access evidence: `PARTIAL`. Direct API request `GET /backoffice/menu/catalog` с `x-test-telegram-id=2002` получил `403 Forbidden`, то есть пользователь без текущего administrator test id не может выполнить операцию. Capability-specific `barista without menu` не изолирован в local runtime, потому что подготовленный non-menu user не доступен через live session bootstrap.

### UI parity и exploratory findings

- Desktop/mobile shell, navigation, empty state, category row и product rows визуально соответствуют основному reference-flow на проверенных состояниях, но полная parity не подтверждена из-за blocking UI behavior.
- Category/item dialogs открываются и содержат reference-поля для category, regular item и drink size prices, но успешный save ломает interactive state.
- Option group parity требует ретеста после `BUG-001`: отдельная кнопка/панель групп опций не должна появляться, а сценарий должен проходить через `Добавить группу` -> `Группа опций` -> добавление товаров в эту группу.
- Console evidence для зависания: `Vue warn: Unhandled error during execution of render function`, затем `Uncaught (in promise)` со stack trace `MenuCatalogView.vue:8:29`, `store.ts:147:9`, `submitCategory` или `submitItem`.

### Defect handoff

- Создан `BUG-001` с меткой контура `frontend`: `tasks/BUG-001-menu-ui-freezes-after-successful-save.md`.
- `BUG-002` переклассифицирован с `frontend` на `documentation`: отдельный UI-flow групп опций не нужен, QA acceptance path обновлен под текущий дизайн.
- Новые `backend` или `devops` BUG не создавались: проверенные API-вызовы сохраняют category, regular item, drink item и option group snapshot; runtime health/session доступны.

### Итог QA-002

- `QA-002` не может быть закрыта как выполненная: обязательные сценарии manual QA и UI parity `FEATURE-002` не подтверждены из-за `BUG-001`.
- Закрытие `FEATURE-002` заблокировано открытым blocking defect `BUG-001`, а также остается зависимость от `QA-005` по e2e lane.
- После исправления `BUG-001` требуется повторный полный manual pass по сценариям этой карточки: category CRUD, regular item, drink S/M/L, option group через toggle, paid/free options как товары внутри option-group, category assignment, negative capability evidence и desktop/mobile UI parity.
