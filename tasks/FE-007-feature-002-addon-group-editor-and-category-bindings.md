# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-007`
- Родительская задача: `FEATURE-002`
- Заголовок: `Редактор групп дополнительных опций и назначение на категории`
- Описание: `Нужно реализовать в apps/backoffice-web редактор групп дополнительных опций поверх FE-004 и общего каркаса FE-005: создание и изменение группы, настройку режима выбора single или multiple, управление бесплатными и платными вариантами через priceDelta, а также назначение групп дополнительных опций на категории через optionGroupRefs. Клиентская часть должна ограничиться UX-валидациями формы, отображением ошибок сохранения и подготовкой структурного снимка; серверная часть остаётся источником истины по правилам групп дополнительных опций.`
- Единица поставки: `FEATURE-002`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `AR-002`, `BE-002`, `FE-004`, `FE-005`
- Минимальный read set: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `apps/backoffice-web позволяет administrator создавать и изменять группы дополнительных опций, задавать бесплатные и платные варианты, выбирать режим single или multiple, назначать группы на категории menu и видеть серверные ошибки invalid-option-group-rule без дублирования серверных правил.`
- Проверки: `Модульные тесты валидаторов или композиционных функций редактора групп дополнительных опций и назначения на категории; локальная проверка назначения взаимоисключающей группы на категорию; npm run test:backoffice.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map.md, README.md при необходимости`
- Критерии готовности: `Задача завершена, когда administrator может из вкладки menu поддерживать группы дополнительных опций и их связи с категориями, а сохранение использует существующий структурный снимок каталога и общие DTO.`
