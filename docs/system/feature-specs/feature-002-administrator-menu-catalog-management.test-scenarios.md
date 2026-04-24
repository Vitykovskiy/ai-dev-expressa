# Feature Test Scenarios: FEATURE-002 Administrator Menu Catalog Management

## Карточка документа

- Feature: `FEATURE-002`
- Feature spec: `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`
- Статус сценариев: `ready-for-architecture`
- Источники: `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`
- Последняя проверка согласованности: `2026-04-23`

## Coverage Matrix

| Scenario ID   | Название                                                | Тип             | Manual QA  | E2E QA     | Приоритет  | Источник                                                                               |
| ------------- | ------------------------------------------------------- | --------------- | ---------- | ---------- | ---------- | -------------------------------------------------------------------------------------- |
| `FTS-002-001` | Создание обычной группы меню                            | `main`          | `required` | `required` | `critical` | `feature spec`, `administrator-manage-menu.md`, `MenuScreen.tsx`                       |
| `FTS-002-002` | Создание обычного товара с базовой ценой                | `main`          | `required` | `required` | `critical` | `feature spec`, `menu-and-availability-management.md`, `AddProductDialog.tsx`          |
| `FTS-002-003` | Создание напитка с ценами S/M/L                         | `main`          | `required` | `required` | `critical` | `feature spec`, `menu-catalog.md`, `menu-and-availability-management.md`               |
| `FTS-002-004` | Создание группы опций через флаг `Группа опций`         | `main`          | `required` | `required` | `critical` | `feature spec`, `backoffice-ui-binding.md`, `AddCategoryDialog.tsx`                    |
| `FTS-002-005` | Создание платной и бесплатной опции внутри группы опций | `main`          | `required` | `required` | `critical` | `feature spec`, `menu-and-availability-management.md`, `MenuScreen.tsx`                |
| `FTS-002-006` | Назначение группы опций на обычную группу               | `main`          | `required` | `required` | `critical` | `feature spec`, `AddCategoryDialog.tsx`, `EditCategoryDialog.tsx`                      |
| `FTS-002-007` | Guard доступа к вкладке меню                            | `guard`         | `required` | `required` | `high`     | `feature spec`, `backoffice-auth-and-capability-access.md`, `backoffice-ui-binding.md` |
| `FTS-002-008` | Ошибка неполной ценовой модели напитка                  | `negative`      | `required` | `required` | `critical` | `feature spec`, `menu-and-availability-management.md`                                  |
| `FTS-002-009` | Удаление категории с товарами отклоняется               | `negative`      | `required` | `optional` | `high`     | `feature spec`, `MenuGuide.tsx`, `menu-and-availability-management.md`                 |
| `FTS-002-010` | Проверка отсутствия отдельной панели групп опций        | `visual-parity` | `required` | `n/a`      | `medium`   | `feature spec`, `backoffice-ui-binding.md`, `.references/Expressa_admin`               |
| `FTS-002-011` | Проверка gap по `selectionMode` групп опций             | `visual-parity` | `required` | `n/a`      | `medium`   | `feature spec`, `menu-and-availability-management.md`, `AddCategoryDialog.tsx`         |

## Сценарии

### `FTS-002-001` — Создание обычной группы меню

- Цель: подтвердить, что administrator может создать обычную группу меню из пустого или существующего каталога.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Main workflow`, `docs/system/use-cases/administrator-manage-menu.md`, `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`
- Предусловия: пользователь аутентифицирован как `administrator`; вкладка `Меню` доступна.
- Тестовые данные: название группы `Кофе`.
- Шаги:
  1. Открыть вкладку `Меню`.
  2. Нажать `Добавить группу`.
  3. Ввести название группы.
  4. Оставить флаг `Группа опций` выключенным.
  5. Нажать `Добавить категорию`.
- Ожидаемый результат:
  1. `Система должна создать обычную категорию меню.`
  2. `Система должна показать новую группу в разделе основного меню.`
  3. `Система должна подтвердить успешное создание пользовательским уведомлением.`
- Проверяемые инварианты:
  - Категория не является группой дополнительных опций.
  - Операция доступна только через capability `menu`.
- E2E mapping:
  - Test file: `e2e/menu-catalog/admin-menu-catalog.spec.ts`
  - Test title / ID: `administrator manages menu catalog through backoffice`; annotation `FTS-002-001`
  - Required assertions: `проверка появления группы в меню, проверка наличия категории в snapshot каталога`

### `FTS-002-002` — Создание обычного товара с базовой ценой

- Цель: подтвердить создание товара без размеров в выбранной группе.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Main workflow`, `docs/system/contracts/menu-and-availability-management.md`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`
- Предусловия: пользователь аутентифицирован как `administrator`; существует обычная группа меню.
- Тестовые данные: `name=Американо`, `category=Кофе`, `basePrice=180`.
- Шаги:
  1. Нажать `Добавить товар`.
  2. Выбрать обычную группу.
  3. Ввести название товара.
  4. Оставить `Размеры S / M / L` выключенным.
  5. Ввести цену.
  6. Нажать `Добавить товар`.
- Ожидаемый результат:
  1. `Система должна сохранить товар в выбранной группе.`
  2. `Система должна сохранить товар как `itemType=regular`с`basePrice`.`
  3. `Система должна показать товар внутри раскрытой группы.`
- Проверяемые инварианты:
  - Обычный товар не содержит `drinkSizePrices`.
- E2E mapping:
  - Test file: `backend/test/menu-catalog-domain.spec.ts`
  - Test title / ID: `FTS-002-002 rejects size prices on a regular menu item`
  - Required assertions: `проверка доменного отказа для обычного товара с drinkSizePrices; browser e2e для создания обычного товара в обычной группе не добавлен в текущей подзадаче`

### `FTS-002-003` — Создание напитка с ценами S/M/L

- Цель: подтвердить создание напитка с полной ценовой моделью размеров.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Alternative workflows`, `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`
- Предусловия: пользователь аутентифицирован как `administrator`; существует группа меню для напитков.
- Тестовые данные: `name=Латте`, `S=180`, `M=220`, `L=260`.
- Шаги:
  1. Открыть форму создания товара.
  2. Выбрать группу.
  3. Ввести название напитка.
  4. Включить `Размеры S / M / L`.
  5. Заполнить цены всех размеров.
  6. Сохранить товар.
- Ожидаемый результат:
  1. `Система должна сохранить товар как напиток.`
  2. `Система должна сохранить цены для размеров `S`, `M`, `L`.`
  3. `Система должна показывать цены размеров в списке товаров.`
- Проверяемые инварианты:
  - Для напитка выбор размера обязателен в customer-сценарии.
  - Цена напитка зависит от выбранного размера.
- E2E mapping:
  - Test file: `e2e/menu-catalog/admin-menu-catalog.spec.ts`; integration coverage: `backend/test/menu-catalog.integration.spec.ts`
  - Test title / ID: `administrator manages menu catalog through backoffice`; annotation `FTS-002-003`; integration title `FTS-002-003 FTS-002-005 FTS-002-006 lets an administrator manage categories, drink prices, option groups and assignments`
  - Required assertions: `проверка трех цен размеров в UI/API snapshot, проверка itemType=drink`

### `FTS-002-004` — Создание группы опций через флаг `Группа опций`

- Цель: подтвердить canonical UI path создания группы дополнительных опций.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Main workflow`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`
- Предусловия: пользователь аутентифицирован как `administrator`; вкладка `Меню` доступна.
- Тестовые данные: название группы опций `Сиропы`.
- Шаги:
  1. Нажать `Добавить группу`.
  2. Ввести название группы.
  3. Включить флаг `Группа опций`.
  4. Сохранить группу.
- Ожидаемый результат:
  1. `Система должна создать группу дополнительных опций.`
  2. `Система должна показывать группу в разделе групп опций.`
  3. `Система должна не требовать отдельную route-level панель для создания этой группы.`
- Проверяемые инварианты:
  - Группа опций не отображается как самостоятельная обычная категория customer-меню.
- E2E mapping:
  - Test file: `e2e/menu-catalog/admin-menu-catalog.spec.ts`
  - Test title / ID: `administrator manages menu catalog through backoffice`; annotation `FTS-002-004`
  - Required assertions: `проверка флага группы опций при создании, проверка появления группы опций в меню, проверка наличия группы опций в snapshot каталога`

### `FTS-002-005` — Создание платной и бесплатной опции внутри группы опций

- Цель: подтвердить создание опций как товаров внутри группы опций.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Main workflow`, `docs/system/contracts/menu-and-availability-management.md`, `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`
- Предусловия: существует группа опций.
- Тестовые данные: `Ванильный сироп=50`, `Без сахара=0`.
- Шаги:
  1. Нажать `Добавить товар`.
  2. Выбрать группу опций.
  3. Создать платную опцию с положительной ценой.
  4. Создать бесплатную опцию с ценой `0`.
  5. Раскрыть группу опций.
- Ожидаемый результат:
  1. `Система должна сохранить платную опцию с положительным `priceDelta`.`
  2. `Система должна сохранить бесплатную опцию с `priceDelta=0`.`
  3. `Система должна показывать бесплатную опцию как бесплатную, а платную опцию с ценой.`
- Проверяемые инварианты:
  - `priceDelta` дополнительной опции неотрицателен.
- E2E mapping:
  - Test file: `e2e/menu-catalog/admin-menu-catalog.spec.ts`; integration coverage: `backend/test/menu-catalog.integration.spec.ts`
  - Test title / ID: `administrator manages menu catalog through backoffice`; annotation `FTS-002-005`; integration title `FTS-002-003 FTS-002-005 FTS-002-006 lets an administrator manage categories, drink prices, option groups and assignments`
  - Required assertions: `проверка basePrice=0 для бесплатной опции, проверка basePrice>0 для платной опции, проверка отображения опций в группе`

### `FTS-002-006` — Назначение группы опций на обычную группу

- Цель: подтвердить наследование группы опций обычной категорией меню.
- Тип: `main`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Main workflow`, `docs/system/contracts/menu-and-availability-management.md`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`
- Предусловия: существует обычная группа и группа опций.
- Тестовые данные: обычная группа `Кофе`, группа опций `Сиропы`.
- Шаги:
  1. Открыть редактирование обычной группы.
  2. Выбрать группу опций в поле `Выбрать группу опций`.
  3. Сохранить изменения.
- Ожидаемый результат:
  1. `Система должна назначить группу опций на обычную группу.`
  2. `Система должна наследовать назначенную группу опций товарами этой категории.`
  3. `Система должна сохранить назначение в snapshot каталога.`
- Проверяемые инварианты:
  - Группа опций не назначается сама на себя.
- E2E mapping:
  - Test file: `e2e/menu-catalog/admin-menu-catalog.spec.ts`; integration coverage: `backend/test/menu-catalog.integration.spec.ts`
  - Test title / ID: `administrator manages menu catalog through backoffice`; annotation `FTS-002-006`; integration title `FTS-002-003 FTS-002-005 FTS-002-006 lets an administrator manage categories, drink prices, option groups and assignments`
  - Required assertions: `проверка выбранной группы опций в категории, проверка сохранения optionGroupRefs`

### `FTS-002-007` — Guard доступа к вкладке меню

- Цель: подтвердить защиту операций каталога capability `menu`.
- Тип: `guard`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Guarded state`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Предусловия: пользователь аутентифицирован без capability `menu`.
- Тестовые данные: роль без административного доступа к меню.
- Шаги:
  1. Открыть backoffice.
  2. Проверить навигацию.
  3. Попытаться открыть route вкладки `Меню` напрямую.
- Ожидаемый результат:
  1. `Система должна скрыть вкладку `Меню` в доступной навигации.`
  2. `Система должна показать protected state при прямом доступе к capability `menu` без разрешения.`
  3. `Система должна не показывать рабочие действия управления каталогом.`
- Проверяемые инварианты:
  - Backend guard остается источником истины для capability access.
- E2E mapping:
  - Test file: `e2e/menu-catalog/admin-menu-catalog.spec.ts`; integration coverage: `backend/test/menu-catalog.integration.spec.ts`
  - Test title / ID: `FTS-002-007 direct menu API access is denied when menu access is unavailable`; integration title `FTS-002-007 rejects menu catalog access without administrator menu capability`
  - Required assertions: `проверка API refusal status, проверка documented capability error; browser navigation/tab guard не добавлен в текущей подзадаче`

### `FTS-002-008` — Ошибка неполной ценовой модели напитка

- Цель: подтвердить отклонение напитка без полного набора цен размеров.
- Тип: `negative`
- Покрытие: `Manual QA: required; E2E QA: required`
- Источники: `feature spec / Exception workflows`, `docs/system/contracts/menu-and-availability-management.md`
- Предусловия: пользователь аутентифицирован как `administrator`; форма товара открыта.
- Тестовые данные: заполнить только `S=180`, оставить `M` и `L` пустыми.
- Шаги:
  1. Включить `Размеры S / M / L`.
  2. Заполнить не все цены размеров.
  3. Попытаться сохранить товар.
- Ожидаемый результат:
  1. `Система должна отклонить сохранение с ошибкой `invalid-drink-size-model`.`
  2. `Система должна показать user-visible validation state для цен размеров.`
  3. `Система должна оставить форму доступной для исправления.`
- Проверяемые инварианты:
  - Напиток не сохраняется без полного набора `S`, `M`, `L`.
- E2E mapping:
  - Test file: `e2e/menu-catalog/admin-menu-catalog.spec.ts`; integration coverage: `backend/test/menu-catalog.integration.spec.ts`, `backend/test/menu-catalog-domain.spec.ts`
  - Test title / ID: `FTS-002-008 incomplete drink size model is rejected`
  - Required assertions: `проверка user-visible validation text, проверка backend error invalid-drink-size-model в integration/domain coverage`

### `FTS-002-009` — Удаление категории с товарами отклоняется

- Цель: подтвердить защиту от удаления непустой категории.
- Тип: `negative`
- Покрытие: `Manual QA: required; E2E QA: optional`
- Источники: `feature spec / Input Constraints`, `.references/Expressa_admin/src/app/components/MenuGuide.tsx`, `docs/system/contracts/menu-and-availability-management.md`
- Предусловия: существует категория с одним или более товарами.
- Тестовые данные: категория `Кофе` с товаром `Латте`.
- Шаги:
  1. Открыть редактирование категории.
  2. Нажать удаление категории.
- Ожидаемый результат:
  1. `Система должна отклонить удаление категории с товарами.`
  2. `Система должна сохранить категорию и ее товары в каталоге.`
  3. `Система должна показать user-visible результат отказа.`
- Проверяемые инварианты:
  - Категория с товарами остается владельцем своих товаров.
- E2E mapping:
  - Test file: `not automated; E2E QA optional`
  - Test title / ID: `FTS-002-009 category with products cannot be deleted`
  - Required assertions: `manual QA required; optional browser e2e not implemented in current automated suite`

### `FTS-002-010` — Проверка отсутствия отдельной панели групп опций

- Цель: подтвердить UI parity с canonical menu-flow для групп опций.
- Тип: `visual-parity`
- Покрытие: `Manual QA: required; E2E QA: n/a`
- Источники: `feature spec / Prototype Completeness Audit`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`
- Предусловия: доступен versioned UI reference.
- Тестовые данные: `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`
- Шаги:
  1. Сверить экран `MenuScreen`.
  2. Сверить диалоги добавления и редактирования группы.
- Ожидаемый результат:
  1. `Система должна использовать `Добавить группу`и флаг`Группа опций` как canonical path.`
  2. `Система должна не требовать отдельную route-level панель групп опций.`
  3. `Система должна не требовать отдельную кнопку `Добавить группу опций`.`
- Проверяемые инварианты:
  - Системное поведение групп опций достигается через существующий menu-flow.
- E2E mapping:
  - Test file: `n/a`
  - Test title / ID: `FTS-002-010`
  - Required assertions: `manual UI parity check required; E2E QA n/a`

### `FTS-002-011` — Проверка gap по `selectionMode` групп опций

- Цель: зафиксировать blocker по способу задания взаимоисключающей или множественной группы опций.
- Тип: `visual-parity`
- Покрытие: `Manual QA: required; E2E QA: n/a`
- Источники: `feature spec / Blockers`, `docs/system/contracts/menu-and-availability-management.md`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`
- Предусловия: доступен feature spec и versioned UI reference.
- Тестовые данные: диалоги создания и редактирования группы.
- Шаги:
  1. Проверить contract `Manage menu catalog`.
  2. Проверить UI controls группы опций.
  3. Зафиксировать наличие или отсутствие control для `selectionMode`.
- Ожидаемый результат:
  1. `Система должна иметь зафиксированный blocker, если UI reference не задает `selectionMode=single/multiple`.`
  2. `Система должна передать blocker архитектору до реализации контрактной проверки выбора опций.`
- Проверяемые инварианты:
  - Взаимоисключающая группа сохраняет ограничение выбора одной опции.
  - Группа множественного выбора сохраняет возможность выбора нескольких опций.
- E2E mapping:
  - Test file: `e2e/menu-catalog/admin-menu-catalog.spec.ts`; integration coverage: `backend/test/menu-catalog.integration.spec.ts`, `backend/test/menu-catalog-domain.spec.ts`
  - Test title / ID: `invalid option group rule is rejected by menu catalog contract`; annotation `FTS-002-011`; integration titles `FTS-002-011 returns invalid-option-group-rule for an unknown selection mode`, `FTS-002-011 rejects an unknown option group selection mode`
  - Required assertions: `проверка e2e/backend/domain error invalid-option-group-rule; manual UI parity фиксирует отсутствие control selectionMode в reference UI`

## Правила покрытия

- Каждый сценарий получает стабильный `Scenario ID`.
- Manual QA и e2e QA ссылаются на `Scenario ID` в результатах проверки.
- E2E-тесты используют `Scenario ID` в названии теста, annotation, tag или coverage-комментарии.
- Coverage mapping фиксирует тестовый файл, название теста и обязательные assertions для каждого e2e-covered сценария.
- Сценарий с `E2E QA: required` считается покрытым после появления browser e2e-теста с assertions из этого документа.
- Сценарий с `Manual QA: required` считается покрытым после ручного прохода по шагам и фиксации результата в QA-задаче.

## Scope Constraints

- Один документ покрывает одну `FEATURE-*`.
- Сценарии описывают проверяемое поведение управления каталогом меню administrator.
- Результат manual QA хранится в QA-задаче, а этот документ хранит канонический маршрут проверки.
- Визуальные parity-сценарии проверяют соответствие canonical `.references/Expressa_admin`, а не вводят новое UI-поведение.

## Safety Constraints

- Ожидаемые результаты сценариев сохраняют смысл feature spec, contract и use case этой фичи.
- Ослабление e2e assertions требует предварительного обновления сценария через системную аналитику.
- Закрытие e2e QA требует соответствия automated coverage mapping сценариям с `E2E QA: required`.
- Проверки доступа остаются привязаны к backend capability guard, а не только к скрытию вкладки.
