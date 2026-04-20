# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-004`
- Родительская задача: `FEATURE-007`
- Заголовок: `Провести аудит UI parity вкладки Меню относительно прототипа`
- Описание: `Нужно провести полный gap analysis текущей реализации вкладки Меню против прототипа интерфейса. QA должен сравнить живой текущий frontend, живой прототип из .references/Expressa_admin и код референса как вспомогательный источник, затем подготовить полный отчет для frontend по всем расхождениям в составе экрана, расположении элементов, поведении, внешнем виде, состояниях и responsive-поведении.`
- Единица поставки: `FEATURE-007`
- Роль: `Тестирование`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`
- Контурная карта: `docs/architecture/application-map/qa-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `frontend/src/views/MenuCatalogView.vue`, `.references/Expressa_admin/README.md`, `.references/Expressa_admin/package.json`, `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`

## Примечания

- Зависимости: `FEATURE-002`
- Минимальный read set: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `frontend/src/views/MenuCatalogView.vue`, `.references/Expressa_admin/README.md`, `.references/Expressa_admin/package.json`, `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`
- Ожидаемый результат для ревью: `Подготовлен полный QA-отчет для frontend по вкладке Меню с воспроизводимым перечнем всех отличий от прототипа по экранным элементам, позиционированию, spacing, визуальным стилям, текстам, состояниям, поведению и desktop/mobile responsive.`
- Проверки: `Сравнение текущей реализации и прототипа на desktop/mobile; проверка пустого состояния, списка категорий, списка товаров, раскрытия категорий, диалогов, disabled/tooltip-состояний, текстов, spacing, цветов и поведения; фиксация результатов в отдельном отчете, пригодном как входной артефакт для FE bugfix задачи.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-menu-catalog.md, если меняются acceptance path, QA маршрут сравнения с прототипом, required evidence или структура итогового QA-отчета для Menu UI parity.`
- Критерии готовности: `QA-задача завершена, когда существует полный и воспроизводимый отчет по всем расхождениям вкладки Меню с прототипом, а frontend может использовать его как исчерпывающий входной артефакт для bugfix без дополнительных уточнений.`
