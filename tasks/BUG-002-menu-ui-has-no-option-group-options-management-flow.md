# Карточка задачи

## Карточка задачи

- Идентификатор: `BUG-002`
- Родительская задача: `FEATURE-002`
- Заголовок: `frontend: во вкладке Меню нет доступного UI-сценария управления опциями группы`
- Описание: `Manual QA-002 не может пройти обязательные сценарии создания группы дополнительных опций, платных и бесплатных опций и назначения группы на категорию через live UI. В коде есть `MenuOptionGroupDialog.vue`и`MenuCatalogOptionGroupsPanel.vue`, но текущий route-level экран `MenuCatalogView.vue` не рендерит панель/диалог групп опций и не предоставляет пользователю action для создания или редактирования состава опций. Переключатель "Группа опций" в category dialog создает только пустую option group с именем категории, без полей selectionMode/options и без явного сценария платных/бесплатных опций.`
- Единица поставки: `FEATURE-002`
- Роль: `Фронтенд`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- Архитектурные артефакты: `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/qa-menu-catalog.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `frontend/src/views/MenuCatalogView.vue`, `frontend/src/components/menu-catalog/MenuOptionGroupDialog.vue`, `frontend/src/components/menu-catalog/MenuCatalogOptionGroupsPanel.vue`, `tasks/QA-002-administrator-menu-catalog-management.md`

## Примечания

- Метка контура причины: `frontend`
- Зависимости: `FE-002`, `QA-002`
- Минимальный read set: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `frontend/src/views/MenuCatalogView.vue`, `frontend/src/components/menu-catalog/MenuOptionGroupDialog.vue`, `frontend/src/components/menu-catalog/MenuCatalogOptionGroupsPanel.vue`
- Ожидаемый результат для ревью: `Administrator во вкладке Меню имеет доступный UI-flow для создания/редактирования option group, выбора selectionMode single/multiple, добавления платной опции, добавления бесплатной опции и назначения группы на категорию в соответствии с contract Manage menu catalog.`
- Проверки: `В local test-mode через UI создать группу дополнительных опций, задать selectionMode, добавить бесплатную опцию priceDelta=0, добавить платную опцию priceDelta>0, назначить эту группу на категорию, проверить snapshot `/backoffice/menu/catalog` и отображение связи в UI. Проверить desktop/mobile доступность сценария и frontend lint/stylelint/typecheck/test/build.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/frontend-backoffice.md, если исправление добавляет новый постоянный route-level блок, action boundary или меняет frontend module/component map.`
- Критерии готовности: `BUG закрыт, когда обязательные option group / options / category assignment сценарии QA-002 проходятся через UI без обращения к API вручную.`

## Evidence QA-002

- Окружение: local test-mode, backend `http://127.0.0.1:3000`, frontend `http://localhost:5173/menu`.
- На экране `/menu` доступны только actions `Добавить группу`, `Добавить товар`, раскрытие категории и `Редактировать группу`.
- В `MenuCategoryDialog` доступны `Название группы`, toggle `Группа опций` и select `Выбрать группу опций`.
- После включения toggle `Группа опций` select блокируется, но не появляется UI для `Тип выбора`, `Добавить опцию`, `Название опции`, `Доплата`, `Доступна`.
- `MenuOptionGroupDialog.vue` содержит нужные поля, но `MenuCatalogView.vue` не импортирует и не рендерит этот компонент; `MenuCatalogOptionGroupsPanel.vue` также не подключен к текущему template экрана.
- Фактический backend snapshot после сохранения toggle содержит пустую option group `{"name":"Кофе","selectionMode":"multiple","options":[]}`, но обязательные платные/бесплатные опции через UI создать нельзя.
