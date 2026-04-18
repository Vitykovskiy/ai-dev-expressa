# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-003`
- Родительская задача: `FEATURE-006`
- Заголовок: `Архитектурная рамка переноса React-макета в Vue 3 + Vuetify`
- Описание: `Нужно зафиксировать архитектурную рамку переноса React-макета .references/Expressa_admin в клиентскую часть apps/backoffice-web на Vue 3 + Vuetify. Первая версия системы компонентов должна размещаться внутри apps/backoffice-web, а не в packages/ui. Нужно определить границы design-system компонентов, layout-компонентов и feature-компонентов, а также правила использования React-референса как визуального источника без переноса React/MUI/Radix/Tailwind-зависимостей.`
- Единица поставки: `FEATURE-006`
- Роль: `Архитектор`
- Изменяемый контур: `architecture`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map.md`
- Контурная карта: `docs/architecture/application-map/backoffice-web.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app`, `terms-map.md`

## Примечания

- Зависимости: `FEATURE-001`, `FEATURE-002`
- Минимальный read set: `README.md`, `terms-map.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/backoffice-web.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`, `.references/Expressa_admin/src/app`
- Ожидаемый результат для ревью: `Архитектурные документы фиксируют внутренний слой компонентов клиентской части apps/backoffice-web, границы ответственности компонентов и запрет на перенос неподтверждённых сервером действий из React-макета.`
- Проверки: `Документальная проверка соответствия terms-map.md и docs/architecture/frontend-architecture.md`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/backoffice-web.md; docs/architecture/application-map.md и README.md при необходимости`
- Критерии готовности: `Задача завершена, когда следующий фронтенд-исполнитель может реализовать токены, компоненты и перенос экранов без самостоятельного выбора архитектурных границ.`
