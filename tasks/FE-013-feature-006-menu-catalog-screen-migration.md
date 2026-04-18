# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-013`
- Родительская задача: `FEATURE-006`
- Заголовок: `Перенос реализованных экранов меню на новую систему компонентов`
- Описание: `Нужно пересобрать реализованные страницы категорий, товаров, карточки товара, групп дополнительных опций и панели сохранения на новой системе компонентов из FE-011, размещая компоненты функционального среза вкладки menu в apps/backoffice-web/src/components/menu. Нельзя менять хранилище состояния, HTTP-контракт, серверные DTO, маршруты вкладки меню и UX-валидации FEATURE-002, кроме точечных адаптаций представления.`
- Единица поставки: `FEATURE-006`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/frontend-architecture.md`
- Контурная карта: `docs/architecture/application-map/backoffice-web.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`

## Примечания

- Зависимости: `FE-011`
- Минимальный read set: `README.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/backoffice-web.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`, `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`
- Ожидаемый результат для ревью: `Реализованные экраны FEATURE-002 выглядят как часть нового макета, используют базовую систему компонентов и компоненты функционального среза из src/components/menu, сохраняя прежнее поведение редактирования каталога меню.`
- Проверки: `Menu*.spec.ts`; `menu-category-editor.spec.ts`; `menu-product-editor.spec.ts`; `menu-addon-group-editor.spec.ts`; `menu-catalog-store.spec.ts`; `npm run test --workspace @expressa/backoffice-web`; `npm run build --workspace @expressa/backoffice-web`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/backoffice-web.md при изменении структуры компонентов или страниц; README.md при необходимости`
- Критерии готовности: `Задача завершена, когда все текущие menu-подэкраны используют новую систему компонентов и проходят существующие проверки FEATURE-002.`
