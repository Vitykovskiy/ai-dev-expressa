# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-008`
- Родительская задача: `FEATURE-002`
- Заголовок: `Проверка и устранение предупреждения Vue Router для маршрута menu`
- Описание: `Во время e2e-проверки FEATURE-002 Vite выводит предупреждение Vue Router: route named "menu" has a child without a name, an empty path, and no children. Нужно проверить конфигурацию маршрутов apps/backoffice-web для вкладки menu, убрать причину предупреждения без изменения пользовательского сценария управления каталогом и сохранить рабочие переходы /menu, /menu/categories, /menu/categories/:categoryId/products, карточку товара и карточку группы дополнительных опций. Задача не должна менять серверные контракты каталога или бизнес-правила FEATURE-002.`
- Единица поставки: `FEATURE-002`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Средний`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/menu-and-availability-management.md`
- Архитектурные артефакты: `docs/architecture/frontend-architecture.md`
- Контурная карта: `docs/architecture/application-map/backoffice-web.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `FE-004`, `FE-005`, `FE-006`, `FE-007`, `QA-002`
- Минимальный read set: `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/backoffice-web.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Ожидаемый результат для ревью: `apps/backoffice-web больше не выводит предупреждение Vue Router для маршрута menu, при этом навигация вкладки menu и дочерних экранов каталога меню остаётся прежней для administrator.`
- Проверки: `npm run test:backoffice; npm run test:e2e или точечный запуск npx playwright test e2e/feature-002/menu-catalog-management.spec.ts с подтверждением отсутствия предупреждения Vue Router в выводе Vite.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/backoffice-web.md при изменении структуры маршрутов; README.md при необходимости`
- Критерии готовности: `Задача завершена, когда предупреждение Vue Router устранено, существующие маршруты menu-подпотоков не регрессировали, а модульные и сквозные проверки FEATURE-002 проходят.`
