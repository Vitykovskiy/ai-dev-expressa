# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-002`
- Родительская задача: `FEATURE-002`
- Заголовок: `Реализовать UI управления каталогом меню во вкладке Меню`
- Описание: `Нужно реализовать клиентский сценарий administrator во вкладке Меню на Vue 3/Vuetify: просмотр каталога по категориям, создание и изменение категорий, товаров, базовых цен, цен напитков S/M/L, групп дополнительных опций, опций и назначений групп на категории. React-референс используется как визуальный и поведенческий ориентир, но реализация должна опираться на backend contract и существующий server-driven backoffice session.`
- Единица поставки: `FEATURE-002`
- Роль: `Фронтенд`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-menu-catalog.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`

## Примечания

- Зависимости: `FEATURE-001`, `AR-003`, `BE-002 для финальной интеграции; можно начать с contract/mock adapter.`
- Минимальный read set: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`
- Ожидаемый результат для ревью: `Administrator во вкладке Меню может создать и изменить категорию, товар с basePrice или ценами S/M/L, группу дополнительных опций, опции и назначение группы на категорию; UI корректно показывает ошибки backend validation и не открывает сценарий пользователю без capability menu.`
- Проверки: `Frontend unit/component tests для menu state, form validation и error mapping; integration test с contract/mock adapter для catalog API; frontend build/test; ручная проверка desktop/mobile поведения по React-референсу.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/frontend-backoffice.md, если появляются новые routes, frontend modules, client API boundary, guard states или menu UI handoff rules.`
- Критерии готовности: `FE-задача завершена, когда клиентский сценарий Меню работает на server-driven actor/capabilities и backend catalog contract, не хардкодит роль administrator и не смешивает структурное управление каталогом с оперативной доступностью barista.`
