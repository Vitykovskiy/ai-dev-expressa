# QA Menu Catalog Application Map

## Граница

Проверки `FEATURE-002`: administrator управляет каталогом меню, товарами, ценами, размерами напитков `S/M/L`, группами дополнительных опций, опциями и назначением групп на категории.

## Обязательные уровни проверок

| Уровень                  | Что проверять                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Unit                     | Доменные инварианты каталога: размерная модель напитка, режим выбора группы опций, наследование групп от категории, базовая цена товара без размеров.                                                                                                                                                                                                                                                       |
| Integration              | Backend contract `Manage menu catalog`, guard `administrator`, negative checks для неполной размерной модели и неверного правила группы опций; endpoint suites в `backend/test/*` относятся к этому уровню.                                                                                                                                                                                                 |
| Frontend component/route | Экран `Меню`, формы категорий, товаров, размеров и групп опций с contract/mock adapter.                                                                                                                                                                                                                                                                                                                     |
| UI parity                | Desktop/mobile сравнение вкладки `Меню` с `docs/system/ui-contracts/expressa-backoffice-ui-contract.md` и `.references/Expressa_admin`: основной экран, диалоги категорий/товаров, пустые, ошибочные и disabled-состояния, responsive-поведение.                                                                                                                                                            |
| E2E                      | Browser split-suite `admin-menu-catalog-save.spec.ts`, `admin-menu-catalog-validation.spec.ts`, `admin-menu-catalog-api.spec.ts` через опубликованный стенд `test-e2e`: administrator создает категорию, обычный товар, товар-напиток с ценами `S/M/L`, группу дополнительных опций, опции и назначает группу на категорию; финальное evidence собирается локальным запуском Playwright `npm run test:e2e`. |
| Smoke                    | Сборка и запуск затронутых backend/frontend контуров без изменения delivery/runtime.                                                                                                                                                                                                                                                                                                                        |

## Acceptance scenarios

- Administrator открывает вкладку `Меню` после backoffice session.
- Administrator создает категорию меню.
- Administrator создает товар в категории.
- Для напитка administrator задает цены для `S`, `M`, `L`; неполная размерная модель отклоняется.
- Administrator создает группу дополнительных опций через canonical menu-flow `Добавить группу` + флаг `Группа опций` без отдельной route-level панели.
- Administrator создает платные и бесплатные опции внутри группы.
- Administrator назначает группу дополнительных опций на категорию, и товары категории наследуют эту группу.
- QA фиксирует documented UI gap по `selectionMode`, если `.references/Expressa_admin` не задает control для выбора `single/multiple`, и не домысливает отсутствующее UI-поведение в manual acceptance.
- Пользователь без capability `menu` не может выполнить операции управления каталогом по прямому route/API.
- Финальный e2e acceptance подтверждается полным browser suite через опубликованный `test-e2e` стенд `https://expressa-e2e-test.vitykovskiy.ru`.
- Команда финального локального e2e-прогона: `npm run test:e2e`.
- Browser acceptance route использует root-команду `npm run test:e2e`, которая запускает Playwright suite из `e2e/`; canonical base URL по умолчанию остается `https://expressa-e2e-test.vitykovskiy.ru`, а `E2E_BACKEND_BASE_URL` нужен только для сценариев с прямым JSON-доступом к backend API.
- Backend endpoint coverage используется как integration evidence для входного подтверждения и debug, но не является feature-level e2e.
- QA создает `BUG-*` задачи для воспроизводимых product failures с меткой `frontend` или `backend`, если контур причины ясен.
- QA создает `BUG-*` задачи для воспроизводимых runtime, env/config или pipeline failures с меткой `devops`, если контур причины ясен.
- QA фиксирует evidence, что вкладка `Меню` идентична backoffice UI contract и `.references/Expressa_admin` по экранной композиции, текстам, состояниям, визуальным стилям и responsive-поведению.
- Оперативное включение/выключение доступности barista не проверяется как часть `FEATURE-002`, кроме регрессионного отсутствия смешения с управлением структурой меню.

## Regression acceptance для FEATURE-006

- После frontend/backend code architecture рефакторинга повторяются acceptance scenarios этой карты без изменения expected behavior.
- Обязательное evidence: menu catalog CRUD, напиток с полным набором цен `S/M/L`, отказ для неполной размерной модели, создание группы дополнительных опций, платные и бесплатные опции, назначение группы на категорию, отказ пользователю без capability `menu`.
- Рефакторинг не принимается, если изменились `/backoffice/menu/*` endpoint boundary, DTO snapshot shape, `invalid-drink-size-model`, `invalid-option-group-rule`, status code mapping или administrator-only capability requirement.
- QA использует `docs/system/contracts/menu-and-availability-management.md` и `docs/system/domain-model/menu-catalog.md` как источники истины и не восстанавливает expected behavior из production-кода.

## Handoff route for FEATURE-002

- QA читает `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`, затем `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`, затем `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, после этого `frontend-backoffice.md`, `backend-access.md` и эту карту.
- Browser e2e и integration checks используют feature test scenarios, system contracts и architecture maps как источники Scenario IDs, API shape, DTO и guard semantics.
- Manual UI parity использует `FTS-002-010` для canonical option-group route и `FTS-002-011` для documented `selectionMode` gap.
- QA-005 использует split-suite `e2e/menu-catalog/admin-menu-catalog-save.spec.ts`, `e2e/menu-catalog/admin-menu-catalog-validation.spec.ts`, `e2e/menu-catalog/admin-menu-catalog-api.spec.ts` как feature-level e2e evidence на published `test-e2e` route.
- QA-005 получает renamed backend integration coverage из `BE-004` как входное evidence, а не как e2e-сценарий.

## Обновлять эту карту

Карту нужно обновить, если меняются e2e сценарии каталога, fixtures, contract mocks, UI parity route, acceptance path, smoke-check или зона ответственности QA по menu catalog.
