# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-002`
- Родительская задача: `FEATURE-002`
- Заголовок: `Реализовать frontend auth/session для FEATURE-002`
- Описание: `Реализовать frontend-срез `FEATURE-002` в `apps/backoffice-web`: принять Telegram WebApp init data или test-mode bootstrap, вызвать typed auth/session-контракт backend, сохранить состояние административной сессии, настроить administrator guard и открыть минимальный административный shell после успешного входа. В UI должны быть различимы успешный вход, отказ по недостаточной роли и blocked-состояние, но сама фича не должна реализовывать бизнес-операции `menu-management`, `user-access-management` и `slot-settings`; нужен только reviewable вход в backoffice и role-aware shell, который можно показать отдельно.`
- Единица поставки: `DU-01.F02`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-users-and-roles.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `tasks/FEATURE-002-administrator-auth-session.md`, `tasks/AR-002-feature-002-auth-session-slicing.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/du-01/features/feature-002-auth-session.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`

## Примечания

- Зависимости: `AR-002`, `BE-002`
- Минимальный read set: `tasks/FEATURE-002-administrator-auth-session.md`, `tasks/AR-002-feature-002-auth-session-slicing.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/du-01/features/feature-002-auth-session.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Administrator может пройти Telegram/test-mode session bootstrap и открыть минимальный backoffice shell с корректным administrator guard как отдельный user-visible slice `DU-01.F02`.`
- Проверки: `Vitest unit tests для session-store, router guard и typed API adapter; smoke входа через Telegram/test mode до административного shell; проверка UI-веток access denied и blocked-состояния без смешивания с последующими вкладками управления.`
- Обновление карты приложения: `Обязательно при изменении frontend entrypoints, router/guard path, shared adapters или env/config относительно `AR-002`: docs/architecture/application-map.md, docs/architecture/README.md, README.md при изменении корневой навигации.`
- Критерии готовности: `Frontend auth/session-срез даёт воспроизводимый вход в backoffice для administrator, не открывает прямой рабочий URL в обход Telegram вне test mode и не тащит в фичу недоставленные административные capability следующих задач.`
