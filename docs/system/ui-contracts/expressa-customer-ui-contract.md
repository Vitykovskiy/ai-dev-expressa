# Expressa Customer UI Contract

## Назначение

Этот документ является входным UI-указателем для клиентского веб-интерфейса Expressa. Он не дублирует макет и не вводит отдельный визуальный контракт.

## Единственный источник истины

Единственный источник истины для визуальной реализации клиентского интерфейса покупателя находится в `.references/Expressa_customer`.

Обязательные референсные материалы:

- `.references/Expressa_customer/src/app`
- `.references/Expressa_customer/src/imports/figma-make-customer-screens.json`
- `.references/Expressa_customer/src/styles`
- `.references/Expressa_customer/guidelines`

## Правила реализации

- Реализация должна строго соответствовать `.references/Expressa_customer` по структуре экранов, layout, визуальным состояниям, компонентным паттернам, текстам, отступам, цветам и responsive-поведению.
- Выбранный стек, каркас разработки, UI-библиотека или набор компонентов не могут менять макет, визуальную иерархию, сценарии отображения и визуальное поведение, заданные в `.references/Expressa_customer`.
- Нельзя додумывать отсутствующие экраны, состояния, элементы, декоративные решения или альтернативные паттерны, если они не зафиксированы в `.references/Expressa_customer` или в системных артефактах как обязательное ограничение.
- Системные документы могут ограничивать доступность действия, роль, guard, проверку или состояние, но не заменяют визуальный канон `.references/Expressa_customer`.
- Если системный артефакт запрещает действие, присутствующее в референсе, реализация должна сохранить визуальное соответствие там, где это возможно, но не включать запрещенное системное поведение без отдельного уточнения.

## Связанные системные артефакты

- `docs/system/ui-behavior-mapping/customer-ordering-ui-binding.md`
- `docs/system/domain-model/menu-catalog.md`
- `docs/system/domain-model/ordering-and-pickup.md`
- `docs/system/contracts/customer-ordering.md`
- `docs/system/contracts/telegram-notifications.md`
- `docs/system/state-models/order-lifecycle.md`
