# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-001`
- Родительская задача: `FEATURE-001`
- Заголовок: `E2E-покрытие входа administrator во внутренний административный контур через Telegram`
- Описание: `Нужно создать и поддерживать e2e-покрытие FEATURE-001 для законченного пользовательского результата: вход administrator во внутренний административный контур через служебного Telegram-бота, доступ к разрешённым административным вкладкам и отказ в доступе при прямом рабочем переходе без Telegram. Тесты должны проверять сквозной сценарий фичи, а не отдельные внутренние технические детали server и клиентской части.`
- Единица поставки: `FEATURE-001`
- Роль: `Тестирование`
- Изменяемый контур: `qa`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`
- Дополнительные материалы: `не требуются`

## Примечания

- Зависимости: `AR-001`, `BE-001`, `FE-001`
- Минимальный read set: `docs/system/system-context/expressa-v1-telegram-ordering.md`, `docs/system/domain-model/identity-and-access.md`, `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map.md`, `docs/architecture/deployment-map.md`
- Ожидаемый результат для ревью: `Есть e2e-сценарии, которые подтверждают вход administrator через служебного Telegram-бота, видимость только разрешённых административных вкладок и отказ при прямом рабочем доступе по URL без Telegram.`
- Проверки: `Запуск e2e-набора FEATURE-001 на собранной фиче; подтверждение прохождения позитивного сценария входа administrator и негативного сценария прямого рабочего доступа без Telegram.`
- Обновление карты приложения: `Не требуется`
- Критерии готовности: `Задача завершена, когда e2e-покрытие стабильно подтверждает законченный пользовательский результат FEATURE-001 и может использоваться в локальной проверке и в конвейере поставки.`
