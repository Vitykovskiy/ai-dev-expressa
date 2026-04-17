# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-003`
- Родительская задача: `FEATURE-001`
- Заголовок: `Ролевые guard-правила и экран отказа в доступе apps/backoffice-web`
- Описание: `Нужно завершить клиентскую часть FEATURE-001 в apps/backoffice-web: реализовать pre-bootstrap проверку Telegram-контекста, поведение test environment при DISABLE_TG_AUTH=true, фильтрацию вкладок по доступным ролям, route guards для прямого рабочего перехода по URL и экран отказа в доступе для недопущенных сценариев. В основе решения должны оставаться ответы существующих серверных контрактов bootstrap доступа и чтения текущего контекста; клиентская часть не должна подменять собой серверную авторизацию и окончательное решение о допуске во внутренний административный контур.`
- Единица поставки: `FEATURE-001`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `AR-001`, `FE-002`
- Минимальный read set: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Apps/backoffice-web корректно блокирует прямой рабочий доступ без Telegram вне test environment, показывает только разрешённые вкладки, защищает маршруты route guards и рендерит экран отказа в доступе вместо обхода ограничений по URL или роли.`
- Проверки: `Модульные тесты для композиционных функций и route guards клиентской части; локальная дымовая проверка открытия внутреннего административного контура в Telegram-контексте administrator; ручная проверка экрана отказа при прямом рабочем переходе по URL без Telegram или без требуемой роли.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map.md, docs/architecture/README.md, README.md при необходимости`
- Критерии готовности: `Задача завершена, когда apps/backoffice-web применяет ролевые guard-правила к вкладкам и маршрутам, корректно обрабатывает отсутствие Telegram-контекста и не допускает обход ограничений прямым рабочим переходом по URL.`
