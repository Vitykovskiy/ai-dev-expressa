# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-006`
- Родительская задача: `SPRINT-001`
- Заголовок: `Внутренний административный контур использует компонентную систему Vue 3 + Vuetify`
- Описание: `Нужно перенести визуальный слой текущей клиентской части apps/backoffice-web на компонентную систему Vue 3 + Vuetify по React-референсу .references/Expressa_admin, сохранив существующие маршруты, bootstrap доступа, guard-правила и реализованное управление каталогом меню. В объём входят архитектурная рамка внутренней системы компонентов, дизайн-токены, базовые компоненты, перенос root layout и реализованных экранов FEATURE-001/FEATURE-002. В объём не входят неподтверждённые сервером действия из React-макета, перенос React/MUI/Radix/Tailwind-зависимостей и создание отдельного packages/ui.`
- Единица поставки: `FEATURE-006`
- Роль: `Разработка`
- Изменяемый контур: `delivery-unit`
- Приоритет: `Высокий`
- Статус: `В работе`

## Ссылки на документы

- Системные артефакты: `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map.md`
- Контурная карта: `docs/architecture/application-map/backoffice-web.md`, `docs/architecture/application-map/quality-and-delivery.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app`

## Примечания

- Зависимости: `FEATURE-001`, `FEATURE-002`
- Согласованный состав дочерних задач: `AR-003` — архитектурная рамка переноса React-макета в Vue 3 + Vuetify; `FE-010` — дизайн-токены и Vuetify theme из UI-контракта внутреннего административного контура; `FE-011` — базовая система компонентов Vue 3 + Vuetify; `FE-012` — перенос root layout, TopBar, TabBar и SideNav; `FE-013` — перенос реализованных экранов меню; `QA-004` — проверка переноса текущего UI на компонентную систему.
- Рекомендованный порядок выполнения: `AR-003`, затем `FE-010`, затем `FE-011`, после чего параллельно `FE-012` и `FE-013`, затем `QA-004`.
- Минимальный read set: `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/backoffice-web.md`, `.references/Expressa_admin/src/app`
- Ожидаемый результат для ревью: `Текущая клиентская часть apps/backoffice-web визуально следует React-референсу, использует внутреннюю систему компонентов Vue 3 + Vuetify и сохраняет поведение доступа и управления каталогом меню из FEATURE-001 и FEATURE-002.`
- Проверки: `npm run test --workspace @expressa/backoffice-web`; `npm run build --workspace @expressa/backoffice-web`; `npm run test:e2e` для сценариев FEATURE-001 и FEATURE-002; ручная проверка viewport 390px и 768px`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/backoffice-web.md; docs/architecture/application-map.md и README.md при необходимости`
- Критерии готовности: `Фича завершена, когда текущая клиентская часть визуально следует React-референсу, новая компонентная система используется в реализованных экранах, проверки клиентской части проходят, а неподтверждённые сервером функции из React-макета не добавлены.`
