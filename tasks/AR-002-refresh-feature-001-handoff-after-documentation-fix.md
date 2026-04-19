# Карточка задачи

## Карточка задачи

- Идентификатор: `AR-002`
- Родительская задача: `FEATURE-001`
- Заголовок: `Обновить архитектурный handoff и child tasks FEATURE-001 после закрытия документационных пробелов`
- Описание: `После системного исправления документации FEATURE-001 нужно привести архитектурный handoff и дочерние карточки в самодостаточное состояние. Результат должен гарантировать, что FE/BE/QA-задачи FEATURE-001 опираются на явные system/architecture artifacts, включая consumer-facing contract, и больше не требуют чтения соседнего production-кода для восстановления auth, guard и integration semantics.`
- Единица поставки: `FEATURE-001`
- Роль: `Архитектор`
- Изменяемый контур: `architecture`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/README.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/README.md`, `docs/architecture/stack.md`, `docs/architecture/application-map.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/qa-access.md`
- Контурная карта: `docs/architecture/application-map.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/qa-access.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `tasks/FEATURE-001-administrator-telegram-backoffice-access.md`, `tasks/FE-001-administrator-backoffice-telegram-entry.md`, `tasks/BE-001-administrator-telegram-access-and-bootstrap.md`, `tasks/QA-001-administrator-telegram-backoffice-access.md`, `tasks/AR-001-feature-001-access-architecture-handoff.md`, `tasks/SA-003-close-feature-001-documentation-gaps-for-implementation-handoff.md`

## Примечания

- Зависимости: `SA-003`
- Минимальный read set: `docs/system/README.md`, `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/qa-access.md`, `tasks/FE-001-administrator-backoffice-telegram-entry.md`, `tasks/BE-001-administrator-telegram-access-and-bootstrap.md`, `tasks/QA-001-administrator-telegram-backoffice-access.md`
- Ожидаемый результат для ревью: `Архитектурные карты и child tasks FEATURE-001 обновлены так, что FE/BE/QA handoff самодостаточен, содержит явные ссылки на нужный contract и не допускает восстановления канонического поведения из production-кода.`
- Проверки: `Проверить, что FE/BE/QA карточки содержат достаточный Минимальный read set, явные ссылки на consumer-facing contract и корректные application maps; проверить, что docs/architecture/application-map/*.md обновлены при изменении handoff route или contour rules.`
- Обновление карты приложения: `Обязательно, если обновление handoff меняет frontend/backend/qa contour maps, auth route, config route или navigation path для FEATURE-001; индекс docs/architecture/application-map.md обновлять только если меняется карта навигации.`
- Критерии готовности: `Задача завершена, когда developer-facing cards FEATURE-001 и связанные архитектурные карты можно отдать исполнителю без дополнительных догадок, а FE-001 больше не требует чтения backend/src для implementable handoff.`

## Результат выполнения

- В `FEATURE-001`, `FE-001`, `BE-001` и `QA-001` добавлен явный consumer-facing contract `docs/system/contracts/backoffice-auth-and-capability-access.md` в `Ссылки на документы` и `Минимальный read set`.
- В `docs/architecture/application-map/frontend-backoffice.md`, `backend-access.md` и `qa-access.md` зафиксирован handoff route к каноническому contract и запрет восстанавливать auth/capability semantics из production-кода соседнего контура.
