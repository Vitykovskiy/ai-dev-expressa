# Контекстный пакет подзадачи

## Карточка контекста

- Исходная задача: `tasks/archive/FEATURE-002-administrator-menu-catalog-management.md`
- Подзадача: `01 — Feature package`
- Роль исполнителя: `Системный аналитик`
- Зона ответственности: `feature-level system documentation for FEATURE-002`
- Связанный план: `FEATURE-002-execution-plan.md`

## Цель подзадачи

Создать canonical feature package для `FEATURE-002`: feature spec и sibling-документ сценариев тестирования по текущим шаблонам process-layer.

## Поведенческий промпт исполнителя

```text
You operate as System Analyst.

Complete only the Feature package subtask within the source task FEATURE-002.

Follow the read and edit boundaries from this context package. Do not expand the scope without an explicit reason. Do not change files outside the allowed edit area. If you find a contradiction, stop and record a blocker instead of guessing.

Before making changes, read the mandatory read set. After making changes, run the listed checks or explicitly record why a check is unavailable.
```

## Обязательный read set

- `process/README.md`
- `process/workflow.md`
- `README.md`
- `terms-map.md`
- `process/templates/feature-spec-template.md`
- `process/templates/feature-test-scenarios-template.md`
- `tasks/archive/FEATURE-002-administrator-menu-catalog-management.md`
- `docs/system/domain-model/menu-catalog.md`
- `docs/system/contracts/menu-and-availability-management.md`
- `docs/system/contracts/backoffice-auth-and-capability-access.md`
- `docs/system/use-cases/administrator-manage-menu.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`
- `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`
- `.references/Expressa_admin/src/app/components/EditCategoryDialog.tsx`
- `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`
- `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`
- `.references/Expressa_admin/src/app/components/MenuGuide.tsx`

## Ключевые факты из источников

- `FEATURE-002` покрывает управление каталогом: категории, товары, цены, размеры напитков `S/M/L`, группы дополнительных опций, опции и назначение групп на категории.
- Оперативная доступность barista, клиентский заказ и обработка заказов не входят в feature boundary.
- Backoffice endpoints каталога требуют capability `menu`; отказ по доступу идет через `backoffice-capability-forbidden` и related auth errors.
- Канонический UI для групп опций: `Добавить группу` + toggle `Группа опций`; платные/бесплатные опции добавляются как товары внутри такой группы; назначение на обычную группу выполняется через `Выбрать группу опций`.
- Отдельная route-level панель или кнопка `Добавить группу опций` не входит в канонический UI `FEATURE-002`.
- Текущие незакоммиченные изменения в `.references/Expressa_admin` относятся к дизайну; использовать `.references` только как read-only источник.

## Разрешенная зона правок

- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.md`
- `docs/system/feature-specs/feature-002-administrator-menu-catalog-management.test-scenarios.md`
- `tasks/archive/FEATURE-002-administrator-menu-catalog-management.md`

## Запрещенная зона правок

- `.references/`
- `backend/`
- `frontend/`
- `e2e/`
- `docs/architecture/`
- любые task cards кроме `tasks/archive/FEATURE-002-administrator-menu-catalog-management.md`

## Входы и зависимости

- Подзадача не зависит от других подзадач.
- Подзадачи `02` и `03` зависят от созданных feature spec и test scenarios.

## Ожидаемый результат

`FEATURE-002` имеет feature spec и test scenarios document по шаблонам process-layer; архивная карточка `FEATURE-002` ссылается на них в системных артефактах и минимальном read set.

## Проверки

- Проверить, что оба файла существуют рядом в `docs/system/feature-specs/`.
- Проверить, что все behavioral requirements в новых документах сформулированы как `Система должна ...`.
- Проверить, что constraints вынесены в `Scope Constraints` и `Safety Constraints`.
- Проверить, что test scenarios имеют stable IDs и coverage matrix.
- Проверить `git diff -- docs/system/feature-specs tasks/archive/FEATURE-002-administrator-menu-catalog-management.md`.

## Критерии готовности

- Feature spec содержит source trace, boundary, workflows, entity view, UI element action sequence, input constraints, validations, errors, edge cases, prototype audit и architecture handoff checklist.
- Test scenarios document содержит stable Scenario IDs, manual/e2e coverage, required assertions и ссылки на источники.
- Карточка `FEATURE-002` ссылается на оба новых документа.

## Риски и запреты

- Не переписывать `.references`; это внешний дизайн-источник с текущими пользовательскими изменениями.
- Не менять уже реализованное поведение feature через документацию.
- Не дублировать одно требование в нескольких синонимических формулировках.

## Открытые вопросы

- Нет.
