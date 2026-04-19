# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-002`
- Родительская задача: `FEATURE-002`
- Заголовок: `Проверить управление каталогом меню administrator`
- Описание: `Нужно проверить собранную FEATURE-002: administrator во вкладке Меню управляет категориями, товарами, ценами, размерной моделью напитков S/M/L, группами дополнительных опций, опциями и назначением групп на категории; пользователь без capability menu не может выполнить сценарий.`
- Единица поставки: `FEATURE-002`
- Роль: `Тестирование`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`
- Контурная карта: `docs/architecture/application-map/qa-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`

## Примечания

- Зависимости: `BE-002`, `FE-002`
- Минимальный read set: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`
- Ожидаемый результат для ревью: `Есть воспроизводимый e2e-сценарий создания категории, товара-напитка с ценами S/M/L, группы дополнительных опций, опций и назначения группы на категорию; есть negative evidence для неполной размерной модели, неверного правила группы опций и доступа без capability menu.`
- Проверки: `E2E administrator manages menu catalog; backend integration Manage menu catalog; frontend component/route checks; unit evidence доменных правил; smoke build/start affected backend/frontend contours.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-menu-catalog.md, если появляются новые e2e маршруты, fixtures, contract mocks, smoke-check или acceptance path.`
- Критерии готовности: `QA-задача завершена, когда FEATURE-002 может быть закрыта на основании e2e, integration, unit и smoke evidence без открытых product defects.`
