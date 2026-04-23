# Контекстный пакет подзадачи

## Карточка контекста

- Исходная задача: `tasks/archive/FEATURE-002-administrator-menu-catalog-management.md`
- Подзадача: `03 — Scenario ID coverage alignment`
- Роль исполнителя: `Тестирование`
- Зона ответственности: `automated coverage traceability for FEATURE-002 scenarios`
- Связанный план: `FEATURE-002-execution-plan.md`

## Цель подзадачи

Привязать существующие автоматизированные проверки `FEATURE-002` к stable Scenario IDs из нового test scenarios document.

## Поведенческий промпт исполнителя

```text
You operate as QA engineer.

Complete only the Scenario ID coverage alignment subtask within the source task FEATURE-002.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `process/README.md`
- `process/workflow.md`
- `README.md`
- `FEATURE-002-execution-plan.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `tasks/archive/QA-005-e2e-administrator-menu-catalog-management.md`
- `docs/architecture/application-map/qa-menu-catalog.md`
- `e2e/menu-catalog/admin-menu-catalog.spec.ts`
- `backend/test/menu-catalog.integration.spec.ts`
- `backend/test/menu-catalog-domain.spec.ts`

## Ключевые факты из источников

- Новый test scenarios document должен быть единственным источником stable Scenario IDs.
- E2E QA должна подтверждать coverage mapping через test file, test title или ID и required assertions.
- Существующий e2e suite уже покрывает основной UI-flow, неполную размерную модель, неверное правило группы опций и отказ без menu capability.
- Backend integration/domain tests являются integration/unit evidence и могут быть указаны в mapping, но не закрывают feature-level browser e2e там, где `E2E QA: required`.

## Разрешенная зона правок

- `e2e/menu-catalog/admin-menu-catalog.spec.ts`
- `backend/test/menu-catalog.integration.spec.ts`
- `backend/test/menu-catalog-domain.spec.ts`
- `tasks/archive/QA-005-e2e-administrator-menu-catalog-management.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`

## Запрещенная зона правок

- `.references/`
- `frontend/`
- `backend/src/`
- `scripts/`
- `.github/`
- feature spec document, кроме test scenarios sibling file.

## Входы и зависимости

- Выполнена подзадача `01`.
- Выполнена подзадача `02`.

## Ожидаемый результат

E2E и backend tests содержат Scenario IDs в названиях или annotations, а test scenarios document и `QA-005` карточка указывают реальные file/title mapping без неопределенного `будет определен`.

## Проверки

- `rg -n "FTS-002" e2e/menu-catalog backend/test docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md tasks/archive/QA-005-e2e-administrator-menu-catalog-management.md`
- `npm run test:backend -- --run menu-catalog`
- Если e2e full run не выполняется, зафиксировать причину в результате подзадачи; не менять assertions без запуска соответствующих проверок.

## Критерии готовности

- Каждый e2e-covered сценарий имеет стабильный ID в Playwright test title или annotation.
- Test scenarios document содержит актуальные `Test file`, `Test title / ID` и required assertions.
- `QA-005` результат выполнения фиксирует, что automated coverage mapping приведен к Scenario IDs.
- Изменения не меняют проверяемое product behavior.

## Риски и запреты

- Не ослаблять assertions.
- Не менять business behavior ради traceability.
- Не трогать дизайн-референсы в `.references/Expressa_admin`.

## Открытые вопросы

- Нет.
