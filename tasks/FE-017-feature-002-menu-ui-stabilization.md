# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-017`
- Родительская задача: `FEATURE-002`
- Заголовок: `Стабилизация UI-состояний menu после переноса дизайна`
- Описание: `Нужно завершить перенос дизайна menu в apps/backoffice-web поверх FE-016: добить пропущенные визуальные регрессии, выровнять desktop/mobile-поведение и обновить модульные проверки по перенесенным UI-состояниям. Задача не должна менять публичные HTTP-контракты, DTO, маршруты menu.* или menuCatalogStore; ее цель — стабилизация интерфейса и выравнивание покрытия проверками без изменения документации. Если в ходе выполнения потребуется изменить структуру apps/backoffice-web, исполнитель должен зафиксировать фактическое изменение для последующей FE-018.`
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

- Зависимости: `FE-016`
- Минимальный read set: `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/backoffice-web.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Ожидаемый результат для ревью: `Menu-подпоток стабилизирован после переноса дизайна, а модульные проверки покрывают перенесенные UI-состояния без изменений публичных контрактов, DTO, маршрутов menu.* и menuCatalogStore.`
- Проверки: `После FE-017 выполнить полный проход по /menu/categories, /menu/categories/:categoryId/products, /menu/categories/:categoryId/products/:productId, /menu/categories/:categoryId/addon-groups/:optionGroupId на desktop и mobile, включая reload, save, error и leave-with-unsaved-changes; обновить и запустить модульные тесты по перенесенным UI-состояниям; npm run test:backoffice; npm run build:backoffice.`
- Обновление карты приложения: `Не входит в FE-017; если в ходе стабилизации фактически изменилась структура apps/backoffice-web, передать это как входное условие для FE-018.`
- Критерии готовности: `Задача завершена, когда перенос дизайна menu не оставляет незакрытых визуальных регрессий в согласованном объеме, проверки отражают итоговые UI-состояния, а необходимость изменений документации явно зафиксирована для FE-018.`
