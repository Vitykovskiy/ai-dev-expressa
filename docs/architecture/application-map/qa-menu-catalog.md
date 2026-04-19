# QA Menu Catalog Application Map

## Граница

Проверки `FEATURE-002`: administrator управляет каталогом меню, товарами, ценами, размерами напитков `S/M/L`, группами дополнительных опций, опциями и назначением групп на категории.

## Обязательные уровни проверок

| Уровень | Что проверять |
|---|---|
| Unit | Доменные инварианты каталога: размерная модель напитка, режим выбора группы опций, наследование групп от категории, базовая цена товара без размеров. |
| Integration | Backend contract `Manage menu catalog`, guard `administrator`, negative checks для неполной размерной модели и неверного правила группы опций. |
| Frontend component/route | Экран `Меню`, формы категорий, товаров, размеров и групп опций с contract/mock adapter. |
| E2E | Administrator создает категорию, товар-напиток с ценами `S/M/L`, группу дополнительных опций, опции и назначает группу на категорию. |
| Smoke | Сборка и запуск затронутых backend/frontend контуров без изменения delivery/runtime. |

## Acceptance scenarios

- Administrator открывает вкладку `Меню` после backoffice session.
- Administrator создает категорию меню.
- Administrator создает товар в категории.
- Для напитка administrator задает цены для `S`, `M`, `L`; неполная размерная модель отклоняется.
- Administrator создает группу дополнительных опций с взаимоисключающим или множественным выбором.
- Administrator создает платные и бесплатные опции внутри группы.
- Administrator назначает группу дополнительных опций на категорию, и товары категории наследуют эту группу.
- Пользователь без capability `menu` не может выполнить операции управления каталогом по прямому route/API.
- Оперативное включение/выключение доступности barista не проверяется как часть `FEATURE-002`, кроме регрессионного отсутствия смешения с управлением структурой меню.

## Regression acceptance для FEATURE-006

- После frontend/backend code architecture рефакторинга повторяются acceptance scenarios этой карты без изменения expected behavior.
- Обязательное evidence: menu catalog CRUD, напиток с полным набором цен `S/M/L`, отказ для неполной размерной модели, создание группы дополнительных опций, платные и бесплатные опции, назначение группы на категорию, отказ пользователю без capability `menu`.
- Рефакторинг не принимается, если изменились `/backoffice/menu/*` endpoint boundary, DTO snapshot shape, `invalid-drink-size-model`, `invalid-option-group-rule`, status code mapping или administrator-only capability requirement.
- QA использует `docs/system/contracts/menu-and-availability-management.md` и `docs/system/domain-model/menu-catalog.md` как источники истины и не восстанавливает expected behavior из production-кода.

## Handoff route for FEATURE-002

- QA читает `docs/system/contracts/menu-and-availability-management.md` как канонический источник contract `Manage menu catalog`, затем `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, после этого `frontend-backoffice.md`, `backend-menu-catalog.md`, `backend-access.md` и эту карту.
- E2E и integration checks не должны восстанавливать API shape, DTO или guard semantics из production-кода соседнего контура.

## Обновлять эту карту

Карту нужно обновить, если меняются e2e сценарии каталога, fixtures, contract mocks, acceptance path, smoke-check или зона ответственности QA по menu catalog.
