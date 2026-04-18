# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-016`
- Родительская задача: `FEATURE-002`
- Заголовок: `Сквозные состояния menu и согласованность маршрутов`
- Описание: `Нужно довести сквозные состояния menu в apps/backoffice-web поверх FE-015: предупреждение о несохраненном черновике, feedback после save/reload, toast-уведомления, подтверждения destructive-действий, mobile/desktop breakpoints и sticky actions должны работать одинаково на всех menu-маршрутах. При этом сохраняются текущие публичные HTTP-контракты, DTO, маршруты menu.* и menuCatalogStore; задача должна согласовать визуальное поведение существующих маршрутов, а не менять архитектурную рамку. Оркестрация предупреждений, сохранения и навигации остается в композиционных функциях и хранилищах состояния.`
- Единица поставки: `FEATURE-002`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/frontend-architecture.md`
- Контурная карта: `docs/architecture/application-map/backoffice-web.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `FE-015`
- Минимальный read set: `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/backoffice-web.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Ожидаемый результат для ревью: `Все menu-маршруты используют единые сквозные состояния и feedback-паттерны для save/reload/error/leave-with-unsaved-changes на desktop и mobile, а переходы между категориями, товарами и группами дополнительных опций остаются согласованными и предсказуемыми.`
- Проверки: `После FE-016 выполнить полный проход по /menu/categories, /menu/categories/:categoryId/products, /menu/categories/:categoryId/products/:productId, /menu/categories/:categoryId/addon-groups/:optionGroupId на desktop и mobile, включая reload, save, error и leave-with-unsaved-changes; модульные тесты предупреждений маршрутизации и сквозных состояний при наличии ветвящейся логики; npm run test:backoffice.`
- Обновление карты приложения: `Не требуется, если маршрутная структура и точки входа не меняются; при изменении навигационных соглашений, защит маршрутов или структуры menu shell обновить docs/architecture/application-map/backoffice-web.md и README.md при необходимости.`
- Критерии готовности: `Задача завершена, когда все menu-маршруты демонстрируют единый набор сквозных состояний и responsive-поведения без локальных расхождений между shell, категориями, товарами и группами дополнительных опций.`
