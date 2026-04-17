# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-002`
- Родительская задача: `FEATURE-001`
- Заголовок: `HTTP-сервисы bootstrap доступа и маршрутизация apps/backoffice-web`
- Описание: `Нужно реализовать в apps/backoffice-web интеграционный слой FEATURE-001 поверх уже зафиксированных серверных контрактов: клиент для POST /api/backoffice/access/bootstrap и GET /api/backoffice/access/me, хранение accessToken и пользовательского контекста, восстановление сессии, карту маршрутов и каркас навигации вкладок внутреннего административного контура. В объём не входят финальные ролевые guard-правила, pre-bootstrap проверка Telegram-контекста и экран отказа в доступе: эти решения выносятся в FE-003. Клиентская часть не должна самостоятельно вычислять роли и права сверх ответа серверной части.`
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

- Зависимости: `AR-001`, `FE-001`
- Минимальный read set: `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/stack.md`, `docs/architecture/code-style.md`, `docs/architecture/application-map.md`
- Ожидаемый результат для ревью: `Apps/backoffice-web использует реальные серверные контракты bootstrap доступа и чтения текущего контекста, хранит accessToken и пользовательский контекст, восстанавливает сессию и строит рабочую маршрутизацию и навигационный каркас на основе ответа server без самостоятельного вычисления прав доступа.`
- Проверки: `Модульные тесты для HTTP-сервисов, хранилища состояния и инициализации пользовательского контекста; локальная проверка bootstrap доступа и восстановления сессии; ручная проверка открытия и переключения маршрутов в разрешённом контуре.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map.md, docs/architecture/README.md, README.md при необходимости`
- Критерии готовности: `Задача завершена, когда apps/backoffice-web умеет получить и восстановить контекст доступа по существующим серверным контрактам и строит поверх него маршрутизацию и навигационный каркас без реализации финальных guard-правил и экрана отказа.`

