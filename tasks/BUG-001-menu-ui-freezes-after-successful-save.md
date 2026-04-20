# Карточка задачи

## Карточка задачи

- Идентификатор: `BUG-001`
- Родительская задача: `FEATURE-002`
- Заголовок: `frontend: вкладка Меню зависает после успешного сохранения каталога`
- Описание: `При ручной проверке QA-002 live UI вкладки Меню зависает после успешных операций сохранения каталога. Backend возвращает успешный ответ и snapshot обновляется, но Vue получает unhandled render error, модальный диалог остается открытым в busy/disabled состоянии, основные CTA также disabled. Пользователь видит незавершенное сохранение и может продолжить работу только после reload страницы.`
- Единица поставки: `FEATURE-002`
- Роль: `Фронтенд`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/qa-menu-catalog.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `frontend/src/views/MenuCatalogView.vue`, `frontend/src/modules/menu-catalog/store.ts`, `tasks/QA-002-administrator-menu-catalog-management.md`

## Примечания

- Метка контура причины: `frontend`
- Зависимости: `FE-002`, `QA-002`
- Минимальный read set: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `frontend/src/views/MenuCatalogView.vue`, `frontend/src/modules/menu-catalog/store.ts`
- Ожидаемый результат для ревью: `После успешного create/update/delete в каталоге UI закрывает модалку, снимает busy/disabled state, отображает обновленный snapshot без reload и без Vue unhandled render error.`
- Проверки: `В local test-mode открыть /menu, создать категорию, создать regular товар, создать drink товар с ценами S/M/L, сохранить изменение категории; после каждой операции модалка закрывается, CTA активны, список обновлен. Проверить отсутствие console errors Vue render/update и пройти frontend lint/stylelint/typecheck/test/build.`
- Обновление карты приложения: `Не требуется, если исправление не меняет маршруты, modules, API boundary или QA acceptance path.`
- Критерии готовности: `BUG закрыт, когда сценарии сохранения каталога из QA-002 проходят без зависания UI и без reload workaround.`

## Evidence QA-002

- Окружение: local test-mode, backend `http://127.0.0.1:3000`, frontend `http://localhost:5173/menu`, `VITE_BACKOFFICE_TEST_TELEGRAM_ID=123456789`.
- Repro 1:
  1. Открыть `/menu` с пустым каталогом.
  2. Нажать `Добавить группу`.
  3. Ввести `Кофе`.
  4. Нажать `Добавить категорию`.
  5. Backend request `POST /backoffice/menu/categories` возвращает `201`.
  6. Фактически модалка `Новая группа` остается открытой, кнопка `Добавить категорию` в busy/disabled, основные `Добавить группу` / `Добавить товар` disabled.
- Repro 2:
  1. После reload открыть `/menu`.
  2. Нажать `Добавить товар`, выбрать категорию `Кофе`, ввести `Брауни`, цену `250`.
  3. Нажать `Добавить товар`.
  4. Backend request `POST /backoffice/menu/items` возвращает успешный ответ, snapshot содержит товар.
  5. Фактически модалка `Новый товар` остается открытой, кнопка сохранения busy/disabled, список обновляется только после reload.
- Repro 3:
  1. После reload открыть `Добавить товар`.
  2. Ввести `Капучино`, включить `Размеры S / M / L`, задать `180`, `220`, `260`.
  3. Нажать `Добавить товар`.
  4. Backend сохраняет drink item с полным `drinkSizePrices`.
  5. Фактически UI зависает аналогично.
- Console evidence: `Vue warn: Unhandled error during execution of render function`, затем `Uncaught (in promise)`. Stack trace указывает `MenuCatalogView.vue:8:29`, `store.ts:147:9`, `save`, `submitCategory` или `submitItem`.
