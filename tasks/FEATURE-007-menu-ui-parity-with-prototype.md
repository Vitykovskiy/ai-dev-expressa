# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-007`
- Родительская задача: `SPRINT-001`
- Заголовок: `Привести UI вкладки Меню к идентичности с прототипом`
- Описание: `Нужно оформить отдельную поставку на UI parity bugfix для вкладки Меню: провести полный аудит текущей реализации относительно прототипа интерфейса и устранить подтвержденные расхождения без изменения системных контрактов, API, auth/capability semantics и маршрутов. В этой сессии и в рамках самой feature сначала создаются только карточки задач; реализация и QA-отчет выполняются в отдельных рабочих сессиях.`
- Единица поставки: `FEATURE-007`
- Роль: `Разработка`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/qa-menu-catalog.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/qa-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`

## Примечания

- Зависимости: `FEATURE-002`
- Декомпозиция: `QA-004`, `FE-004`; `BE-*` и `DO-*` не требуются, если аудит не выявит отдельный blocker вне frontend/QA контура.
- Минимальный read set: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/qa-standards.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`
- Ожидаемый результат для ревью: `Вкладка Меню в текущем frontend приведена к идентичности с прототипом по составу элементов, их расположению, состояниям, внешнему виду и поведению в desktop/mobile сценариях без изменения системного поведения FEATURE-002.`
- Проверки: `Дочерние задачи должны предоставить полный QA-отчет по расхождениям между текущим frontend и прототипом, evidence повторного прохода по отчету после исправлений и подтверждение отсутствия изменений в системном поведении FEATURE-002.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/frontend-backoffice.md и docs/architecture/application-map/qa-menu-catalog.md, если изменяются правила frontend handoff для Меню, acceptance path, QA маршрут проверки или зона ответственности контуров.`
- Критерии готовности: `Feature завершена, когда есть полный QA-аудит экрана Меню относительно прототипа, все подтвержденные расхождения исправлены во frontend, а QA подтверждает визуально-поведенческий паритет без открытых product defects и без локального переопределения system contract.`
