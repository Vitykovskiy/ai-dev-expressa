# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-004`
- Родительская задача: `FEATURE-007`
- Заголовок: `Исправить расхождения UI вкладки Меню относительно прототипа`
- Описание: `Нужно устранить только те отклонения UI вкладки Меню, которые будут подтверждены QA-отчетом в рамках FEATURE-007. Исправления должны привести экран к идентичности с прототипом по элементам, их расположению, внешнему виду, состояниям и поведению, но не должны локально переопределять system contract, API, auth/capability semantics, маршруты или acceptance FEATURE-002.`
- Единица поставки: `FEATURE-007`
- Роль: `Фронтенд`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/frontend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/qa-menu-catalog.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `tasks/QA-004-audit-menu-ui-parity-with-prototype.md`, `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`, `frontend/src/views/MenuCatalogView.vue`

## Примечания

- Зависимости: `QA-004`
- Минимальный read set: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `tasks/QA-004-audit-menu-ui-parity-with-prototype.md`, `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`, `frontend/src/views/MenuCatalogView.vue`
- Ожидаемый результат для ревью: `Все подтвержденные QA-отчетом расхождения UI вкладки Меню устранены, а текущая реализация совпадает с прототипом по композиции экрана, позиционированию, визуальным стилям, состояниям и поведению без изменения системного поведения FEATURE-002.`
- Проверки: `Повторный проход по полному QA-отчету после исправлений; frontend lint, stylelint, format:check, typecheck, test, build; подтверждение, что расхождения устранены без изменения system contract, API, auth/capability semantics и маршрутов FEATURE-002.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/frontend-backoffice.md, если исправления меняют documented handoff rules, component boundaries, responsive expectations или visual parity assumptions для вкладки Меню.`
- Критерии готовности: `FE-задача завершена, когда текущий frontend соответствует прототипу по подтвержденным зонам расхождений, повторный QA-проход не выявляет незакрытых mismatch, а все системные ограничения FEATURE-002 сохранены.`
