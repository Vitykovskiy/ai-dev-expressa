# Карточка задачи

## Карточка задачи

- Идентификатор: `SA-003`
- Родительская задача: `FEATURE-004`
- Заголовок: `Восстановить context package manual QA для FEATURE-004`
- Описание: `Карточка QA-001 ссылается на FEATURE-004-context-05-qa-manual-user-role-management.md, но файл отсутствует в корне и не найден через rg. Нужно восстановить недостающий контекстный пакет либо обновить текущий read set QA-001 так, чтобы он ссылался только на существующие канонические источники. Решение должно сохранить правило явного read set и не использовать tasks/archive как источник формата, решений или эталона.`
- Единица поставки: `FEATURE-004`
- Роль: `Системный аналитик`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `tasks/QA-001-feature-004-manual-user-role-management.md`, `QA-001-evidence.md`, `process/templates/context-package-template.md`

## Примечания

- Зависимости: `QA-001`
- Минимальный read set: `process/workflow.md`, `process/templates/context-package-template.md`, `tasks/QA-001-feature-004-manual-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.test-scenarios.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `QA-001-evidence.md`
- Ожидаемый результат для ревью: `QA-001 read set больше не содержит битую ссылку: либо создан FEATURE-004-context-05-qa-manual-user-role-management.md по process/templates/context-package-template.md, либо task-card QA-001 обновлена на существующий достаточный маршрут чтения.`
- Проверки: `rg --files -g "*FEATURE-004-context-05*"`, `проверка QA-001-evidence.md на закрытие QA-001-GAP-001 или явное обновление статуса gap`, `проверка отсутствия ссылок на tasks/archive как источник текущего read set`
- Обновление карты приложения: `Не требуется`
- Критерии готовности: `Повторная manual QA может стартовать без input gap QA-001-GAP-001 и без обращения к архивным задачам`
