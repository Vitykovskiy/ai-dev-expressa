# Карточка задачи

## Карточка задачи

- Идентификатор: `FEATURE-006`
- Родительская задача: `Sprint-002`
- Заголовок: `Customer shell and session`
- Описание: `Стартовая customer-фича второго спринта: customer открывает приложение через Telegram, получает валидную сессию и видит базовый customer shell, пригодный для дальнейших customer-фич.`
- Единица поставки: `DU-02.F01`
- Роль: `Разработка`
- Изменяемый контур: `feature`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Vision: `docs/business/vision/expressa-v1-telegram-ordering.md`
- Сценарии: `docs/business/scenarios/customer-place-pickup-order.md`
- Требования / правила: `docs/business/business-rules/access-and-roles.md`
- Дополнительные материалы: `tasks/Sprint-002-customer-ordering.md`, `docs/system/contracts/customer-ordering.md`, `docs/system/ui-behavior-mapping/customer-ordering-ui-binding.md`

## Примечания

- Зависимости: `Sprint-001`
- Минимальный read set: `tasks/Sprint-002-customer-ordering.md`, `docs/system/contracts/customer-ordering.md`, `docs/system/ui-behavior-mapping/customer-ordering-ui-binding.md`
- Ожидаемый результат для ревью: `Customer получает отдельный session/bootstrap slice для входа в приложение.`
- Проверки: `Smoke customer session bootstrap и открытия базового shell.`
- Обновление карты приложения: `Обязательно при изменении entrypoints, env/config или runtime path.`
- Критерии готовности: `Фича отдельно демонстрирует старт customer-контурa и не включает заказ или историю.`
