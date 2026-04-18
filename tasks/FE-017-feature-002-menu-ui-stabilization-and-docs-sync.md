# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-017`
- Родительская задача: `FEATURE-002`
- Заголовок: `Финальная стабилизация переноса дизайна menu и синхронизация документации`
- Описание: `Нужно завершить перенос дизайна menu в apps/backoffice-web поверх FE-016: добить пропущенные визуальные регрессии, обновить модульные проверки по migrated UI-состояниям и синхронизировать README.md вместе с картой приложения, если в ходе переноса изменится структура apps/backoffice-web. Задача не должна менять публичные HTTP-контракты, DTO, маршруты menu.* или menuCatalogStore; ее цель — стабилизация, выравнивание покрытия проверками и фиксация итоговой структуры клиентской части в документации.`
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
- Дополнительные материалы: `README.md`

## Примечания

- Зависимости: `FE-016`
- Минимальный read set: `README.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/backoffice-web.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Ожидаемый результат для ревью: `Menu-подпоток стабилизирован после переноса дизайна, модульные проверки покрывают migrated UI-состояния, а README.md и контурная карта не расходятся с фактической структурой apps/backoffice-web.`
- Проверки: `После FE-017 выполнить полный проход по /menu/categories, /menu/categories/:categoryId/products, /menu/categories/:categoryId/products/:productId, /menu/categories/:categoryId/addon-groups/:optionGroupId на desktop и mobile, включая reload, save, error и leave-with-unsaved-changes; обновить и запустить модульные тесты по перенесенным UI-состояниям; npm run test:backoffice; npm run build:backoffice.`
- Обновление карты приложения: `Обязательно при изменении структуры apps/backoffice-web: обновить docs/architecture/application-map/backoffice-web.md и README.md; если структура не изменилась, зафиксировать, что документы остаются актуальными без правок.`
- Критерии готовности: `Задача завершена, когда перенос дизайна menu не оставляет незакрытых визуальных регрессий в согласованном scope, проверки отражают итоговые UI-состояния, а навигация по репозиторию и документация остаются актуальными.`
