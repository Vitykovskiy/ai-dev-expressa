# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-002`
- Родительская задача: `Sprint-001`
- Заголовок: `Administrator auth/session`
- Описание: `Реализовать отдельную фичу `DU-01.F02`: administrator проходит Telegram или test-mode session bootstrap, получает корректную административную сессию и может войти в backoffice. Фича не включает управление меню, ролями и слотами, а только готовит проверяемый auth/session slice.`
- Единица поставки: `DU-01.F02`
- Роль: `Разработка`
- Изменяемый контур: `feature`
- Приоритет: `Средний`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/administrator-manage-users-and-roles.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`, `docs/business/business-rules/backoffice-operations.md`
- Дополнительные материалы: `tasks/Sprint-001-administration-foundation.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/architecture/du-01-administration.md`

## Примечания

- Зависимости: `FEATURE-001`
- Минимальный read set: `tasks/Sprint-001-administration-foundation.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/architecture/du-01-administration.md`
- Ожидаемый результат для ревью: `Administrator может получить валидную сессию и открыть административный shell как отдельный feature slice.`
- Проверки: `Smoke входа через Telegram/test mode; проверка session bootstrap и role guard для administrator.`
- Обновление карты приложения: `Обязательно при изменении auth entrypoints, env/config или runtime path.`
- Критерии готовности: `Фича отдельно подтверждает работоспособную auth/session-модель и не смешивает ее с последующими административными capability.`
