# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `Клиентская часть входа в backoffice через Telegram и ролевых guard-правил`
- Описание: `Нужно реализовать в apps/backoffice-web клиентскую часть FEATURE-001: инициализацию backoffice веб-приложения внутри Telegram, получение и хранение пользовательского контекста administrator, ролевое отображение административных вкладок и пользовательское поведение при прямом рабочем переходе по URL без Telegram, включая экран отказа в доступе. Результат должен отдельно покрывать маршрутизацию, guard-логику и состояние клиентской части без захвата серверной авторизации и bootstrap главного administrator.`
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

- Зависимости: `AR-001`
- Минимальный read set: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Backoffice веб-приложение корректно открывается в Telegram-контексте для administrator, показывает только разрешённые административные вкладки, а при прямом рабочем переходе по URL без Telegram или без требуемой роли показывает отказ в доступе вместо обхода guard-правил.`
- Проверки: `Модульные тесты для stores, композиционных функций и route guards клиентской части; локальная дымовая проверка открытия backoffice в Telegram-контексте administrator; ручная проверка экрана отказа при прямом рабочем переходе по URL без Telegram.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map.md, docs/architecture/README.md, README.md при необходимости`
- Критерии готовности: `Задача завершена, когда клиентская часть backoffice поддерживает вход administrator через Telegram и корректно применяет ролевые guard-правила ко вкладкам и маршрутам, а логика покрыта модульными тестами.`
