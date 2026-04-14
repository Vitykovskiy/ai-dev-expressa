# Contract: Telegram Notifications

## Граница

Один набор контрактов: исходящие Telegram-уведомления customer и Telegram-напоминания barista.

## Источники

- `docs/business/business-rules/order-lifecycle-and-history.md`
- `docs/business/business-rules/backoffice-operations.md`
- `docs/business/scenarios/barista-confirm-order.md`
- `docs/business/scenarios/barista-reject-order.md`
- `docs/business/scenarios/barista-mark-order-ready.md`
- `docs/business/scenarios/barista-receive-order-reminder.md`
- `Expressa — Требования к продукту.txt`

## Contract `Notify customer about order status change`

### Triggering events

- Переход заказа в `Подтвержден`.
- Переход заказа в `Отклонен`.
- Переход заказа в `Готов к выдаче`.

### Outputs

- Telegram-уведомление customer о новом статусе заказа.

### Constraints

- Для статуса `Отклонен` уведомление должно содержать причину отказа.

## Contract `Send barista reminder about pending orders`

### Triggering condition

- В системе есть заказы, ожидающие действий barista.

### Outputs

- Telegram-напоминание через backoffice-бота.

### Constraints

- Напоминание должно быть периодическим.

### Открытые вопросы

- Периодичность отправки не зафиксирована.
- Во входных материалах не определено, как выбирается адресат напоминания при наличии нескольких barista.
