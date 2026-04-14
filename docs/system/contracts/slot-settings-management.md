# Contract: Slot Settings Management

## Граница

Один набор контрактов: управление рабочими часами, вместимостью слотов и получение слотов для customer-сценария.

## Источники

- `docs/business/business-rules/pickup-slots-and-capacity.md`
- `docs/business/business-rules/backoffice-operations.md`
- `docs/business/scenarios/administrator-manage-slot-settings.md`
- `docs/business/scenarios/customer-place-pickup-order.md`

## Contract `Manage working hours and slot capacity`

### Consumer

- `administrator`

### Inputs

- Новые рабочие часы.
- Новая вместимость слота.

### Validations and constraints

- Операция доступна только роли `administrator`.
- Если настройки не менялись, действуют значения по умолчанию `09:00–20:00` и `5`.

### Outputs

- Сохранённые рабочие часы.
- Сохранённая вместимость слота.

### Business errors

- `administrator-role-required`
- `invalid-working-hours`
- `invalid-slot-capacity`

## Contract `Generate available slots`

### Consumer

- `customer`

### Inputs

- Текущая дата.
- Действующие рабочие часы.
- Действующая вместимость слотов.
- Количество активных заказов по слотам.

### Outputs

- Список доступных слотов текущего дня.

### Constraints

- Слот является интервалом в 10 минут.
- Возвращаются только слоты текущего дня.
- Заказы в статусах `Создан`, `Подтвержден`, `Готов к выдаче` занимают вместимость.
- Заказы в статусах `Отклонен`, `Закрыт` вместимость не занимают.

