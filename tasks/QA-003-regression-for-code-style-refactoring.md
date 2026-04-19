# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-003`
- Родительская задача: `FEATURE-006`
- Заголовок: `Проверить отсутствие регрессий после code style рефакторинга`
- Описание: `Нужно подтвердить, что архитектурная формализация, tooling/CI и frontend/backend рефакторинг не изменили поведение FEATURE-001 и FEATURE-002. QA принимает рефакторинг только при сохранении auth/capability behavior, menu catalog endpoint behavior и UI сценариев управления меню.`
- Единица поставки: `FEATURE-006`
- Роль: `Тестирование`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/devops-standards.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/application-map/qa-access.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`
- Контурная карта: `docs/architecture/application-map/qa-access.md`, `docs/architecture/application-map/qa-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `tasks/QA-001-administrator-telegram-backoffice-access.md`, `tasks/QA-002-administrator-menu-catalog-management.md`

## Примечания

- Зависимости: `DO-002`, `FE-003`, `BE-003`
- Минимальный read set: `docs/architecture/qa-standards.md`, `docs/architecture/devops-standards.md`, `docs/architecture/application-map/qa-access.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Ожидаемый результат для ревью: `Есть regression evidence, что test-mode/Telegram auth, server-driven actor/capabilities, forbidden screen, role-based navigation, menu catalog CRUD, validation errors и access denial работают как до рефакторинга.`
- Проверки: `Повторить обязательные проверки QA-001 и QA-002; проверить frontend/backend lint, format:check, typecheck, test, build и frontend stylelint evidence; проверить, что CI quality gates отражают те же команды.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-access.md и docs/architecture/application-map/qa-menu-catalog.md, если добавляются или меняются regression/e2e маршруты, fixtures, smoke-checks или acceptance evidence.`
- Критерии готовности: `Задача завершена, когда FEATURE-006 может быть закрыта без открытых regression defects, а все новые quality gates имеют воспроизводимое evidence.`
