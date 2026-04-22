# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-003`
- Родительская задача: `FEATURE-006`
- Заголовок: `Отрефакторить frontend каталог меню по стандарту code architecture`
- Описание: `Нужно привести frontend код управления каталогом меню к архитектурному стандарту без изменения UI behavior, маршрутов, auth/capability semantics и API contracts. Первый обязательный кандидат — MenuCatalogView.vue: разнести большой view на feature components, composables, typed module functions и scoped SCSS, сохранив поведение FEATURE-002.`
- Единица поставки: `FEATURE-006`
- Роль: `Фронтенд`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-menu-catalog.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `frontend/src/views/MenuCatalogView.vue`

## Примечания

- Зависимости: `AR-004`; `DO-002` для финальной проверки quality gates
- Минимальный read set: `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Ожидаемый результат для ревью: `MenuCatalogView.vue и связанные frontend modules соответствуют SFC порядку template -> script -> style, используют style scoped lang="scss" в рефакторимых SFC, не превышают целевые пороги декомпозиции без обоснования и сохраняют все сценарии управления каталогом меню.`
- Проверки: `frontend lint, stylelint, format:check, typecheck, test, build; regression-проверка сценариев FEATURE-002: создание/редактирование категории, товара с basePrice или S/M/L ценами, группы дополнительных опций, опций и назначения группы на категорию; проверка доступа без capability menu.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/frontend-backoffice.md, если появляются новые components, composables, client API modules, route guards или меняются frontend boundaries.`
- Критерии готовности: `Задача завершена, когда frontend рефакторинг уменьшил размер и связность MenuCatalogView.vue, сохранил публичное поведение и проходит обязательные quality gates. Если требуется изменить контракт или поведение, исполнитель фиксирует blocker и не меняет поведение локально.`
