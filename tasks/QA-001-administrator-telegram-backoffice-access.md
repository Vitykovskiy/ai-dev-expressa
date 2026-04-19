# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `Проверить вход administrator в backoffice через Telegram`
- Описание: `Нужно проверить собранную FEATURE-001: administrator открывает backoffice через служебного Telegram-бота, bootstrap administrator идемпотентен, вкладки доступны по роли, прямой production доступ без Telegram заблокирован, а DISABLE_TG_AUTH=true работает только в test environment.`
- Единица поставки: `FEATURE-001`
- Роль: `Тестирование`
- Изменяемый контур: `qa`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/application-map/qa-access.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Контурная карта: `docs/architecture/application-map/qa-access.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/routes.tsx`, `.references/Expressa_admin/src/app/components/SideNav.tsx`, `.references/Expressa_admin/src/app/components/TabBar.tsx`

## Примечания

- Зависимости: `FE-001`, `BE-001`, `DO-001`
- Минимальный read set: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/application-map/qa-access.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Ожидаемый результат для ревью: `Есть воспроизводимый e2e-сценарий administrator Telegram entry, проверки bootstrap idempotency, role guard и test-mode исключения; дефекты зафиксированы с шагами воспроизведения.`
- Проверки: `E2e administrator opens backoffice via service Telegram entrypoint; integration Telegram/test-mode auth; unit evidence for bootstrap and role guard; smoke build/start for affected contours.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-access.md, если появляются новые e2e маршруты, fixtures, test env rules или smoke-check.`
- Критерии готовности: `QA-задача завершена, когда FEATURE-001 может быть переведена в статус Выполнена на основании e2e, integration, unit и smoke evidence.`
