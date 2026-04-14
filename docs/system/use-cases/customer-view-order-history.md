# Use Case: Customer View Order History

## Граница

Один use case: просмотр customer собственной истории заказов.

## Источники

- `docs/business/scenarios/customer-view-order-history.md`
- `docs/business/business-rules/access-and-roles.md`
- `docs/business/business-rules/order-lifecycle-and-history.md`

## Триггер

Customer открывает раздел истории заказов.

## Предусловия

- Пользователь идентифицирован через Telegram customer-бота или test-mode исключение.
- Пользователь не заблокирован.

## Основной поток

1. Система допускает customer в customer-приложение.
2. Customer инициирует просмотр истории заказов.
3. Система выбирает заказы, принадлежащие этому customer.
4. Система отображает customer список его заказов с текущими статусами.

## Альтернативы и исключения

- Если у customer нет заказов, система отображает пустую историю.
- Если пользователь заблокирован, система не допускает его к приложению.

## Постусловия

- Customer получил доступ только к собственной истории заказов.
