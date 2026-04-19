# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-003`
- Родительская задача: `FEATURE-002`
- Заголовок: `Зафиксировать архитектурный handoff управления каталогом меню`
- Описание: `Нужно определить контуры реализации FEATURE-002: frontend вкладка Меню, backend menu catalog boundary и QA-проверки. Результат должен позволить FE/BE/QA задачам выполняться без локального переопределения маршрутов, endpoint boundary, DTO, guard-правил и доменных проверок каталога.`
- Единица поставки: `FEATURE-002`
- Роль: `Архитектор`
- Изменяемый контур: `architecture`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/qa-menu-catalog.md`
- Контурная карта: `docs/architecture/application-map.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/qa-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`

## Примечания

- Зависимости: `FEATURE-001`
- Минимальный read set: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`
- Ожидаемый результат для ревью: `Архитектурные карты FEATURE-002 обновлены, а FE/BE/QA задачи имеют достаточный read set для выполнения управления каталогом без чтения production-кода соседнего контура.`
- Проверки: `Проверить наличие backend-menu-catalog и qa-menu-catalog карт; проверить, что FE/BE/QA карточки содержат consumer-facing contract, профильную карту и не требуют бизнес-артефактов.`
- Обновление карты приложения: `Выполнено: обновлены docs/architecture/application-map.md, docs/architecture/README.md, docs/architecture/frontend-architecture.md, docs/architecture/backend-architecture.md, docs/architecture/qa-standards.md, docs/architecture/application-map/frontend-backoffice.md; созданы docs/architecture/application-map/backend-menu-catalog.md и docs/architecture/application-map/qa-menu-catalog.md.`
- Критерии готовности: `Задача завершена, когда архитектурный handoff покрывает frontend, backend и QA контуры FEATURE-002, а DO-контур признан не требующим отдельной задачи.`

## Результат выполнения

- Созданы контурные карты `backend-menu-catalog.md` и `qa-menu-catalog.md`.
- Обновлены архитектурная навигация и frontend/backend/QA стандарты под `FEATURE-002`.
- `DO-*` задача не создана, потому что feature не меняет env vars, GitHub Actions, deployment path, VPS runtime или smoke-check route.
