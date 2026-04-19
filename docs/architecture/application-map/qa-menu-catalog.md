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

## Handoff route for FEATURE-002

- QA читает `docs/system/contracts/menu-and-availability-management.md` как канонический источник contract `Manage menu catalog`, затем `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, после этого `frontend-backoffice.md`, `backend-menu-catalog.md`, `backend-access.md` и эту карту.
- E2E и integration checks не должны восстанавливать API shape, DTO или guard semantics из production-кода соседнего контура.

## Обновлять эту карту

Карту нужно обновить, если меняются e2e сценарии каталога, fixtures, contract mocks, acceptance path, smoke-check или зона ответственности QA по menu catalog.
