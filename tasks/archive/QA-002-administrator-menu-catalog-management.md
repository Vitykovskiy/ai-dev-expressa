# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-002`
- Родительская задача: `FEATURE-002`
- Заголовок: `Ручное тестирование управления каталогом меню administrator`
- Описание: `Нужно вручную проверить собранную FEATURE-002: administrator во вкладке Меню управляет категориями, товарами, ценами, размерной моделью напитков S/M/L, группами дополнительных опций, опциями и назначением групп на категории; пользователь без capability menu не может выполнить сценарий. Manual QA также сверяет live-интерфейс с backoffice UI contract и .references/Expressa_admin, фиксирует exploratory findings и оформляет воспроизводимые defects через BUG-задачи с меткой контура причины.`
- Единица поставки: `FEATURE-002`
- Роль: `Тестирование`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`, `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`
- Контурная карта: `docs/architecture/application-map/qa-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`

## Примечания

- Зависимости: `BE-002`, `FE-002`
- Минимальный read set: `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`, `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`
- Ожидаемый результат для ревью: `Есть manual QA evidence по пользовательским сценариям управления каталогом меню, negative evidence для доступа без capability menu, desktop/mobile UI parity evidence против backoffice UI contract и .references/Expressa_admin, а также список заведенных BUG-задач с метками контура причины или явное подтверждение, что воспроизводимые product defects не обнаружены.`
- Проверки: `Ручные сценарии: открыть вкладку Меню после backoffice session; создать категорию; создать товар в категории; задать цены S/M/L для напитка; создать группу дополнительных опций через toggle "Группа опций"; создать платные и бесплатные опции как товары внутри этой группы, где цена 0 означает бесплатную опцию; назначить группу на категорию через "Выбрать группу опций"; проверить отказ пользователю без capability menu. UI parity: desktop/mobile сравнение экрана Меню и диалогов категорий/товаров с .references/Expressa_admin. Exploratory checks: empty/error/disabled states, validation messages, responsive behavior. Defect handoff: список созданных BUG-задач с метками frontend/backend/devops/documentation или подтверждение отсутствия воспроизводимых defects.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-menu-catalog.md, если меняются manual acceptance path, UI parity route, required manual evidence или зона ответственности QA по menu catalog.`
- Критерии готовности: `Manual QA-задача завершена, когда ручные пользовательские сценарии и UI parity FEATURE-002 подтверждены, все воспроизводимые defects оформлены через BUG-задачи с метками контура причины или явно отсутствуют, а закрытие FEATURE-002 остается заблокированным только при незавершенной E2E QA-005 или открытых blocking BUG-задачах.`

## Результат выполнения

### Снятие стартового блокера

- Предыдущий процессный блокер снят: на момент продолжения `FEATURE-002` имеет статус `Ожидает тестирования`, `FE-002` и `BE-002` имеют статус `Выполнена`.
- `QA-002` переведена в `В тестировании`; обязательный read set прочитан: `process/prompts/qa/prompt.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md` и указанные `.references/Expressa_admin` материалы.
- После закрытия `BUG-001` и `BUG-002` выполнен повторный manual QA-pass; `QA-002` переведена в `Выполнена`.

### Окружение и метод

- Окружение: local test-mode, backend `http://127.0.0.1:3000`, frontend `http://localhost:5173/menu`.
- Env route: `backend/.env.local` с `NODE_ENV=test`, `DISABLE_TG_AUTH=true`, `ADMIN_TELEGRAM_ID=123456789`; `frontend/.env.local` с `VITE_BACKOFFICE_API_BASE_URL=http://127.0.0.1:3000`, `VITE_BACKOFFICE_TEST_TELEGRAM_ID=123456789`.
- Smoke перед повторной ручной проверкой: `GET /health` вернул `{"status":"ok"}`; `POST /backoffice/auth/session` для `123456789` вернул `administrator` с capabilities `orders`, `availability`, `menu`, `users`, `settings`; начальный `GET /backoffice/menu/catalog` вернул пустой snapshot.
- UI evidence снимался через live frontend в desktop viewport `1440x900` и mobile viewport `390x844`; browser snapshots зафиксировали доступные элементы экрана и модалок.
- Визуальные screenshots сохранены локально в ignored `artifacts/`: `artifacts/qa-002-desktop-menu.png`, `artifacts/qa-002-mobile-menu.png`.

### Manual scenario evidence

- `FTS-002-001` `Создание обычной группы меню`: `PASS`. `/menu` открылся под `Администратор`; при пустом каталоге показано `Меню пусто` / `Добавьте первую группу для начала работы`, `Добавить товар` disabled; через `Добавить группу` создана категория `Кофе`, `POST /backoffice/menu/categories` вернул `201`, модалка закрылась, список обновился без reload.
- `FTS-002-002` `Создание обычного товара с базовой ценой`: `PASS`. Через `Добавить товар` создан товар `Брауни` в категории `Кофе` с `basePrice=250`; `POST /backoffice/menu/items` вернул `201`, UI показал `Кофе 1 товар` и строку `Брауни 250 ₽`.
- `FTS-002-003` `Создание напитка с ценами S/M/L`: `PASS`. Создан `Капучино` с включенным `Размеры S / M / L` и ценами `S=180`, `M=220`, `L=260`; UI показал `Капучино от 180 ₽`, backend snapshot содержит полный `drinkSizePrices`.
- `FTS-002-004` `Создание группы опций через флаг Группа опций`: `PASS`. Через `Добавить группу` создана группа `Сиропы` с включенным toggle `Группа опций`; `POST /backoffice/menu/categories` и `POST /backoffice/menu/option-groups` вернули успешные ответы; отдельной route-level кнопки или панели `Добавить группу опций` на экране нет.
- `FTS-002-005` `Создание платной и бесплатной опции внутри группы опций`: `PASS`. В группе `Сиропы` добавлены товары `Без сиропа` с ценой `0` и `Ваниль` с ценой `40`; UI показал `Без сиропа 0 ₽` и `Ваниль 40 ₽`.
- `FTS-002-006` `Назначение группы опций на обычную группу`: `PASS`. В форме редактирования группы `Кофе` выбран option group `Сиропы` через `Выбрать группу опций`; `PATCH /backoffice/menu/categories/:menuCategoryId` вернул `200`, backend snapshot содержит `Кофе.optionGroupRefs = [Сиропы.optionGroupId]`.
- `FTS-002-007` `Guard доступа к вкладке меню`: `PASS`. Direct API request `GET /backoffice/menu/catalog` с `x-test-telegram-id=2002` получил `403 Forbidden`, то есть пользователь без administrator capability `menu` не может выполнить операцию управления каталогом в local test-mode.
- `FTS-002-008` `Ошибка неполной ценовой модели напитка`: `EVIDENCE GAP`. В архивной карточке зафиксированы только validation-adjacent результаты повторного pass: кнопка сохранения товара оставалась disabled до заполнения обязательных полей, форма сохраняла редактируемое состояние. Явный manual evidence с user-visible ошибкой `invalid-drink-size-model` в текущем тексте карточки отсутствует.
- `FTS-002-009` `Удаление категории с товарами отклоняется`: `EVIDENCE GAP`. В архивной карточке отсутствует явная фиксация ручной проверки удаления непустой категории и user-visible отказа; supporting contract и automated evidence существуют вне этой manual lane, но в текущем тексте `QA-002` этот manual scenario не записан.

### Результат нормализации manual lane

- Stable scenario IDs `FTS-002-001` ... `FTS-002-009` привязаны к evidence в явном виде.
- Архивная карточка сохраняет исходный итог manual pass без ретрокоррекции фактов; для `FTS-002-008` и `FTS-002-009` зафиксирован документальный evidence gap, а не новый product verdict.

### UI parity и exploratory findings

- Desktop/mobile shell, navigation, empty state, category row, product rows, category dialog, item dialog and mobile bottom navigation соответствуют `docs/system/ui-contracts/expressa-backoffice-ui-contract.md` и `.references/Expressa_admin` на проверенных состояниях.
- Category/item dialogs содержат reference-поля для названия группы, toggle `Группа опций`, select `Выбрать группу опций`, выбора категории товара, названия товара, базовой цены и цен `S/M/L`.
- Option group parity подтверждена по каноническому flow: `Добавить группу` -> `Группа опций` -> товары внутри этой группы -> назначение через `Выбрать группу опций`; отдельной постоянной панели групп опций нет.
- Empty, disabled и validation-adjacent состояния проверены: в пустом каталоге `Добавить товар` disabled; для option group disabled toggle `Размеры S / M / L`; кнопка сохранения товара disabled до заполнения обязательных полей; select option group disabled при создании самой option group.
- Console evidence после повторного pass: отсутствуют Vue render/update errors и unhandled promise errors. Зафиксированы только dev-server сообщения Vite, `favicon.ico` `404`, browser accessibility issues по `aria-labelledby`/field `id or name` и autofocus info; они не блокируют product acceptance `FEATURE-002`.

### Defect handoff

- Создан `BUG-001` с меткой контура `frontend`: `tasks/BUG-001-menu-ui-freezes-after-successful-save.md`.
- `BUG-001` имеет статус `Выполнена`; повторный pass подтвердил закрытие: модалки закрываются, busy/disabled state снимается, snapshot обновляется без reload.
- `BUG-002` имеет статус `Выполнена` и закрыт как documentation mismatch; QA acceptance path подтвержден под текущий дизайн.
- Новые `frontend`, `backend` или `devops` BUG не создавались: проверенные API-вызовы сохраняют category, regular item, drink item, option group category, paid/free option items и category assignment; runtime health/session доступны.

### Итог QA-002

- `QA-002` закрыта как `Выполнена`: обязательные ручные сценарии и UI parity `FEATURE-002` подтверждены в local test-mode.
- Blocking manual QA defects по `FEATURE-002` отсутствуют: `BUG-001` и `BUG-002` закрыты, новых воспроизводимых product defects по manual lane не обнаружено.
- Закрытие `FEATURE-002` по-прежнему зависит от отдельной e2e lane `QA-005`, потому что `QA-002` закрывает только manual QA.
