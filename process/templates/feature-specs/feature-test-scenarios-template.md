# Шаблон test-scenarios.md feature package

## Назначение

Документ фиксирует QA slice decomposed feature package для одной `FEATURE-*`.

Документ используется как:

- единый источник сценариев для manual QA и e2e QA;
- маршрут ручного тестирования фичи;
- источник traceability между Scenario ID, ручной проверкой и e2e-тестами;
- контрольная точка ревью, по которой проверяется, что автоматизированные тесты подтверждают задокументированное ожидаемое поведение фичи.
- часть feature package, оптимизированная для передачи QA-контекста без чтения широкого `docs/system/`.

## Размещение

- Канонический путь: `docs/system/feature-specs/<feature-id>-<slug>/test-scenarios.md`.
- Документ размещается внутри folder package той же фичи.
- Документ создается до передачи `FEATURE-*` архитектору.
- Документ входит в role read routes для `FEATURE-*`, `AR-*`, manual `QA-*` и e2e `QA-*`.

## Владение

- Системный аналитик создает и обновляет сценарии на основании package slices, use cases, contracts, state models, UI behavior mapping и versioned UI/design sources.
- Архитектор передает этот документ в обе QA-задачи при декомпозиции фичи.
- Manual QA использует сценарии как чек-лист ручной приемки.
- E2E QA использует сценарии как источник для автоматизированных browser e2e-тестов и coverage mapping.
- Изменение ожидаемого поведения сценария выполняется через системную аналитику до изменения e2e-assertions.

## Карточка документа

- Feature: `<FEATURE-001>`
- Package root: `<docs/system/feature-specs/feature-001-slug/>`
- Index: `<./index.md>`
- Behavior: `<./behavior.md>`
- Interfaces: `<./interfaces.md>`
- UI behavior: `<./ui-behavior.md | n/a>`
- Статус сценариев: `<draft | ready-for-architecture | updated-after-analysis>`
- Источники: `<use-cases, contracts, ui-behavior-mapping, state-models, .references при наличии>`
- Последняя проверка согласованности: `<YYYY-MM-DD | pending>`

## Coverage Matrix

| Scenario ID | Название             | Тип                                                     | Manual QA                   | E2E QA                      | Приоритет                        | Источник                                             |
| ----------- | -------------------- | ------------------------------------------------------- | --------------------------- | --------------------------- | -------------------------------- | ---------------------------------------------------- |
| `FTS-001`   | `<Краткое название>` | `main / alternative / negative / guard / visual-parity` | `required / optional / n/a` | `required / optional / n/a` | `critical / high / medium / low` | `<package slice / contract / use case / UI mapping>` |

## Сценарии

### `FTS-001` — `<Название сценария>`

- Цель: `<Что подтверждает сценарий>`
- Тип: `<main | alternative | negative | guard | visual-parity>`
- Покрытие: `Manual QA: <required | optional | n/a>; E2E QA: <required | optional | n/a>`
- Источники: `<ссылки на конкретные разделы system artifacts и .references при наличии>`
- Предусловия: `<состояние системы, роль, данные, окружение>`
- Тестовые данные: `<данные, которые вводятся или ожидаются>`
- Шаги:
  1. `<Действие пользователя или системный триггер>`
  2. `<Действие пользователя или системный триггер>`
- Ожидаемый результат:
  1. `Система должна <наблюдаемое поведение или состояние>`
  2. `Система должна <наблюдаемое поведение или состояние>`
- Проверяемые инварианты:
  - `<Инвариант, который сохраняется в допустимых состояниях>`
- E2E mapping:
  - Test file: `<e2e/... | будет определен в e2e QA>`
  - Test title / ID: `<FTS-001 ... | будет определен в e2e QA>`
  - Required assertions: `<что именно должен проверять автоматизированный тест>`

## Правила покрытия

- Каждый сценарий получает стабильный `Scenario ID`.
- Manual QA и e2e QA ссылаются на `Scenario ID` в результатах проверки.
- E2E-тесты используют `Scenario ID` в названии теста, annotation, tag или coverage-комментарии.
- Coverage mapping фиксирует тестовый файл, название теста и обязательные assertions для каждого e2e-covered сценария.
- Сценарий с `E2E QA: required` считается покрытым после появления browser e2e-теста с assertions из этого документа.
- Сценарий с `Manual QA: required` считается покрытым после ручного прохода по шагам и фиксации результата в `QA-*` карточке.
- Ожидаемое поведение сценария должно ссылаться на `behavior.md`, `interfaces.md` или `ui-behavior.md`.
- Сценарий не должен вводить новое поведение, отсутствующее в других package slices.

## QA feedback loop

- Reproducible defects found during manual QA or e2e QA are filed as `BUG-*` tasks under the same `FEATURE-*`.
- `BUG-*` task must reference affected `Scenario ID`, cause contour when known, reproduction steps, expected result and actual result.
- QA rechecks affected scenarios after blocking `BUG-*` tasks are closed.
- `FEATURE-*` can be completed only after required manual QA, required e2e QA and blocking defect rechecks are complete.

## Scope Constraints

- Один документ покрывает одну `FEATURE-*`.
- Сценарии описывают проверяемое поведение фичи из package slices.
- Результат manual QA хранится в `QA-*` карточке, а этот документ хранит канонический маршрут проверки.

## Safety Constraints

- Ожидаемые результаты сценариев сохраняют смысл feature package, contracts и use cases.
- Ослабление e2e assertions требует предварительного обновления сценария через системную аналитику.
- Закрытие e2e QA требует соответствия automated coverage mapping сценариям с `E2E QA: required`.
