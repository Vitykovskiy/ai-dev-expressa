# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-011`
- Родительская задача: `FEATURE-006`
- Заголовок: `Базовая система компонентов Vue 3 + Vuetify`
- Описание: `Нужно реализовать в клиентской части apps/backoffice-web базовые компоненты Button, StatusBadge, EmptyState, Skeleton, FilterTabs, SectionList, FormField, ToggleRow и ConfirmDialog как тонкие Vue-компоненты над Vuetify. Компоненты должны принимать данные и обработчики через props, emits или slots, не обращаться к API, router, хранилищам состояния и не вычислять права доступа.`
- Единица поставки: `FEATURE-006`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`
- Архитектурные артефакты: `docs/architecture/frontend-architecture.md`
- Контурная карта: `docs/architecture/application-map/backoffice-web.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/components`

## Примечания

- Зависимости: `FE-010`
- Минимальный read set: `README.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/backoffice-web.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`, `.references/Expressa_admin/src/app/components/Button.tsx`, `.references/Expressa_admin/src/app/components/StatusBadge.tsx`, `.references/Expressa_admin/src/app/components/EmptyState.tsx`, `.references/Expressa_admin/src/app/components/FilterTabs.tsx`, `.references/Expressa_admin/src/app/components/ToggleRow.tsx`, `.references/Expressa_admin/src/app/components/ConfirmDialog.tsx`
- Ожидаемый результат для ревью: `Внутри клиентской части apps/backoffice-web появился переиспользуемый слой базовых UI-компонентов, пригодный для переноса layout и экранов меню без смешения с транспортом, маршрутизацией и хранилищами состояния.`
- Проверки: `Компонентные Vitest-проверки props/emits/slots для нетривиальных состояний`; `npm run test --workspace @expressa/backoffice-web`; `npm run build --workspace @expressa/backoffice-web`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/backoffice-web.md; README.md при необходимости`
- Критерии готовности: `Задача завершена, когда базовые компоненты покрывают состояния из UI-контракта, проходят проверки и не знают о конкретных feature-сценариях.`
