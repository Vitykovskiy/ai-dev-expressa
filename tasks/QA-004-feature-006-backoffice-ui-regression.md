# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-004`
- Родительская задача: `FEATURE-006`
- Заголовок: `Проверка переноса текущего UI внутреннего административного контура на компонентную систему`
- Описание: `Нужно проверить, что после переноса визуального слоя на компонентную систему проходят сценарии доступа и управления каталогом меню, а mobile viewport 390px и tablet viewport 768px соответствуют ключевым правилам UI-контракта. Проверка должна подтвердить, что неподтверждённые сервером функции из React-макета не появились в рабочем Vue-приложении.`
- Единица поставки: `FEATURE-006`
- Роль: `Тестирование`
- Изменяемый контур: `qa`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/contracts/menu-and-availability-management.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/frontend-architecture.md`
- Контурная карта: `docs/architecture/application-map/backoffice-web.md`, `docs/architecture/application-map/quality-and-delivery.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `tasks/FEATURE-006-backoffice-ui-component-system-and-current-screen-migration.md`, `tasks/FE-012-feature-006-backoffice-layout-migration.md`, `tasks/FE-013-feature-006-menu-catalog-screen-migration.md`

## Примечания

- Зависимости: `FE-012`, `FE-013`
- Минимальный read set: `README.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/backoffice-web.md`, `docs/architecture/application-map/quality-and-delivery.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`
- Ожидаемый результат для ревью: `Зафиксированы успешные проверки FEATURE-001 и FEATURE-002 после переноса UI, а найденные визуальные или поведенческие дефекты оформлены воспроизводимо.`
- Проверки: `npm run test --workspace @expressa/backoffice-web`; `npm run build --workspace @expressa/backoffice-web`; `npm run test:e2e`; ручная проверка viewport 390px и 768px`
- Обновление карты приложения: `Не требуется, если QA-задача не меняет e2e-путь; при изменении проверок обновить docs/architecture/application-map/quality-and-delivery.md`
- Критерии готовности: `Задача завершена, когда перенос UI подтверждён проверками, а оставшиеся расхождения с React-референсом либо исправлены, либо оформлены отдельными дефектами.`
