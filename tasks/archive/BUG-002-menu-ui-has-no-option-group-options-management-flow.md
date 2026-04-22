# Карточка задачи

## Карточка задачи

- Идентификатор: `BUG-002`
- Родительская задача: `FEATURE-002`
- Заголовок: `documentation: QA-ожидание отдельного UI-flow групп опций не соответствует дизайну Меню`
- Описание: `Manual QA-002 трактовала создание групп дополнительных опций как отдельный route-level сценарий с панелью/диалогом управления OptionGroup.options. Это не соответствует визуальному канону .references/Expressa_admin и текущей реализации FEATURE-002: группа опций создается как обычная группа меню через переключатель "Группа опций", а платные и бесплатные опции добавляются как товары внутри этой группы. Отдельная кнопка или панель "Добавить группу опций" является лишним UI и должна быть удалена из клиентского дерева.`
- Единица поставки: `FEATURE-002`
- Роль: `Системный аналитик`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- Архитектурные артефакты: `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/qa-menu-catalog.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `frontend/src/views/MenuCatalogView.vue`, `frontend/src/components/menu-catalog/MenuCategoryDialog.vue`, `frontend/src/components/menu-catalog/MenuItemDialog.vue`, `tasks/QA-002-administrator-menu-catalog-management.md`

## Примечания

- Метка контура причины: `documentation`
- Зависимости: `FE-002`, `QA-002`
- Минимальный read set: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `frontend/src/views/MenuCatalogView.vue`, `frontend/src/components/menu-catalog/MenuCategoryDialog.vue`, `frontend/src/components/menu-catalog/MenuItemDialog.vue`
- Ожидаемый результат для ревью: `Документация и QA acceptance path фиксируют текущий UI-flow: administrator создает группу через "Добавить группу", включает "Группа опций", затем добавляет товары в эту группу как платные или бесплатные опции; обычная категория назначает такую группу через "Выбрать группу опций".`
- Проверки: `В local test-mode через UI создать группу с включенным флагом "Группа опций"; добавить в нее товар с ценой 0 как бесплатную опцию; добавить товар с ценой >0 как платную опцию; создать обычную группу и выбрать созданную группу опций в "Выбрать группу опций"; проверить snapshot /backoffice/menu/catalog и отображение связи после reload. Проверить, что во вкладке Меню нет отдельной кнопки, панели или диалога "Добавить группу опций".`
- Обновление карты приложения: `docs/architecture/application-map/frontend-backoffice.md обновлена: route-level экран Меню не содержит отдельный постоянный блок управления группами опций.`
- Критерии готовности: `BUG закрыт, когда лишний клиентский UI-flow удален, а системная/QA документация описывает прохождение option group, paid option, free option и category assignment через текущую реализацию интерфейса.`

## Evidence QA-002

- Окружение: local test-mode, backend `http://127.0.0.1:3000`, frontend `http://localhost:5173/menu`.
- На экране `/menu` по дизайну доступны actions `Добавить группу`, `Добавить товар`, раскрытие категории и `Редактировать группу`.
- В `MenuCategoryDialog` доступны `Название группы`, toggle `Группа опций` и select `Выбрать группу опций`.
- Toggle `Группа опций` является каноническим способом пометить группу меню как группу дополнительных опций; select `Выбрать группу опций` назначает такую группу на обычную группу меню.
- Платная или бесплатная опция в текущем UI создается как товар внутри группы, помеченной `Группа опций`; цена `0` означает бесплатную опцию, цена `>0` означает платную опцию.
- Отдельный route-level UI для `OptionGroup.options`, включая панель или кнопку `Добавить группу опций`, не требуется для FEATURE-002 и расходится с `.references/Expressa_admin`.
