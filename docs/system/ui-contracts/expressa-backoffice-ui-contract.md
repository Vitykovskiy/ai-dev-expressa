# Expressa Backoffice UI Contract

## Назначение

Этот документ является входным UI-указателем для внутреннего административного контура Expressa. Он не дублирует макет и не вводит отдельный визуальный контракт.

## Единственный источник истины

Единственный источник истины для визуальной реализации интерфейса администратора, экранов `barista` и общего backoffice-поведения находится в `.references/Expressa_admin`.

Обязательные референсные материалы:

- `.references/Expressa_admin/src/app`
- `.references/Expressa_admin/src/imports/expressa-backoffice-ui-contract.json`
- `.references/Expressa_admin/src/styles`
- `.references/Expressa_admin/guidelines`

## Правила реализации

- Реализация должна строго соответствовать `.references/Expressa_admin` по структуре экранов, layout, визуальным состояниям, компонентным паттернам, текстам, отступам, цветам и responsive-поведению.
- Выбранный стек, каркас разработки, UI-библиотека или набор компонентов не могут менять макет, визуальную иерархию, сценарии отображения и визуальное поведение, заданные в `.references/Expressa_admin`.
- Нельзя додумывать отсутствующие экраны, состояния, элементы, декоративные решения или альтернативные паттерны, если они не зафиксированы в `.references/Expressa_admin` или в системных артефактах как обязательное ограничение.
- Системные документы могут ограничивать доступность действия, роль, guard, проверку или состояние, но не заменяют визуальный канон `.references/Expressa_admin`.
- Если системный артефакт запрещает действие, присутствующее в референсе, реализация должна сохранить визуальное соответствие там, где это возможно, но не включать запрещенное системное поведение без отдельного уточнения.

## Связанные системные артефакты

- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `docs/system/domain-model/identity-and-access.md`
- `docs/system/domain-model/menu-catalog.md`
- `docs/system/domain-model/ordering-and-pickup.md`
- `docs/system/contracts/backoffice-order-processing.md`
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/contracts/slot-settings-management.md`
- `docs/system/contracts/user-role-and-blocking-management.md`
