# Карточка задачи

## Карточка задачи

- Идентификатор: `SA-001`
- Родительская задача: `FEATURE-004`
- Заголовок: `Уточнение contract boundary для users capability и списка пользователей`
- Описание: `Нужно устранить конфликт в системных артефактах по маршруту GET /backoffice/users. Сейчас contract FEATURE-001 фиксирует capability-check boundary GET /backoffice/:capability c допустимым значением users, а contract FEATURE-004 фиксирует тот же GET /backoffice/users как чтение списка пользователей с другой семантикой и shape ответа. Задача должна определить канонический boundary без догадок реализации, обновить системные артефакты так, чтобы backend и frontend handoff были однозначными, и явно зафиксировать, как проверка capability users сосуществует с чтением списка пользователей.`
- Единица поставки: `FEATURE-004`
- Роль: `Системный аналитик`
- Приоритет: `Критический`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/frontend-backoffice.md`
- Контурная карта: `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/frontend-backoffice.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `tasks/AR-007-feature-004-users-role-management-architecture-handoff.md`, `AR-007-execution-plan.md`

## Примечания

- Зависимости: `AR-007`, `FEATURE-001`, `FEATURE-004`
- Минимальный read set: `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/feature-specs/feature-001-administrator-telegram-backoffice-access.md`, `docs/system/feature-specs/feature-004-administrator-user-role-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/frontend-backoffice.md`, `tasks/AR-007-feature-004-users-role-management-architecture-handoff.md`
- Ожидаемый результат для ревью: `Системные артефакты однозначно фиксируют канонический маршрут и response shape для capability users и для чтения списка пользователей; исполнитель BE/FE больше не восстанавливает boundary из production-кода и не сталкивается с конфликтом двух contracts на одном GET route.`
- Проверки: `Проверить, что docs/system/contracts/backoffice-auth-and-capability-access.md и docs/system/contracts/user-role-and-blocking-management.md больше не задают несовместимые semantics для GET /backoffice/users`, `Проверить, что feature spec FEATURE-004 ссылается на обновленный canonical boundary`, `Проверить, что AR-007 может продолжить шаг BE-001 без догадок`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/backend-access.md, docs/architecture/application-map/frontend-backoffice.md; индекс и корневая навигация не требуются, если список карт не меняется`
- Критерии готовности: `Конфликт по GET /backoffice/users снят в канонических system artifacts; способ проверки capability users и чтения списка пользователей зафиксирован явно; AR-007 и дочерние FE/BE задачи получают self-contained read set без route ambiguity`
