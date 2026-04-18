# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-010`
- Родительская задача: `FEATURE-006`
- Заголовок: `Дизайн-токены и Vuetify theme из UI-контракта внутреннего административного контура`
- Описание: `Нужно привести src/vuetify.ts и src/styles/main.scss в клиентской части apps/backoffice-web к цветам, типографике, отступам, радиусам, теням и состояниям из docs/system/ui-contracts/expressa-backoffice-ui-contract.json. Токены должны стать единым источником визуальных значений для последующих компонентов и не должны менять маршруты, хранилища состояния, services или HTTP-контракты.`
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
- Дополнительные материалы: `.references/Expressa_admin/src/styles/theme.css`, `.references/Expressa_admin/src/styles/index.css`, `.references/Expressa_admin/src/app/components/ui/button.tsx`

## Примечания

- Зависимости: `AR-003`
- Минимальный read set: `README.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/application-map/backoffice-web.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`
- Ожидаемый результат для ревью: `Vuetify theme и глобальные стили клиентской части apps/backoffice-web используют значения из UI-контракта внутреннего административного контура и готовы для реализации базовой системы компонентов.`
- Проверки: `npm run test --workspace @expressa/backoffice-web`; `npm run build --workspace @expressa/backoffice-web`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/backoffice-web.md при изменении структуры стилей или фактических зависимостей; README.md при необходимости`
- Критерии готовности: `Задача завершена, когда токены доступны в приложении, существующие экраны собираются без визуальных регрессий сборки, а значения темы не дублируются случайно в новых местах.`
