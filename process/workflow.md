# Workflow

Документ описывает переносимый процесс работы агентов и определяет порядок чтения process-артефактов.

## Старт работы

Перед любой работой в репозитории агент сначала читает локальный репозиторный entrypoint, указанный project-specific override, после чтения этого workflow.

Базовый маршрут:

1. Прочитать локальный project entrypoint.
2. Найти или создать карточку задачи по шаблону из `process/templates/`.
3. Прочитать профильный промпт роли из `process/prompts/`.
4. Для `FEATURE-*` открыть `process/templates/feature-specs/feature-spec-package-instruction.md` и package slice templates.
5. Использовать документы из поля `Маршрут чтения` в новой карточке задачи или legacy поля `Минимальный read set` в существующей карточке.
6. Обновить навигационные документы, если структура process-layer или проектная навигация изменились.

### Правило явного read set

- Агент использует текущую карточку задачи, документы из ее полей `Ссылки на документы` и `Маршрут чтения`, а также явно назначенные ролевые инструкции как основной и достаточный маршрут чтения.
- Для legacy карточек поле `Минимальный read set` имеет тот же смысл, что `Маршрут чтения`.
- `Маршрут чтения` является исчерпывающим маршрутом чтения по умолчанию для выполнения задачи.
- Предыдущие `FEATURE-*`, `AR-*`, `FE-*`, `BE-*`, `DO-*`, `QA-*`, архивные карточки из `tasks/archive/` и прошлые декомпозиции не используются как источник формата, решений, правил или эталона, если текущая карточка не ссылается на них явно.
- Если нужный факт отсутствует в назначенном маршруте чтения, профильная роль фиксирует gap, blocker или запрашивает уточнение вместо поиска аналога в старых задачах.
- Process templates и актуальные канонические артефакты используются как источник формы и структуры новых документов вместо исторических task-card.

### Feature workflow

Для `FEATURE-*` системный аналитик формирует decomposed feature package в `docs/system/feature-specs/<feature-id>-<slug>/`.

Feature package является основным источником системного handoff-контекста для агентов. Supporting system docs остаются canonical sources для анализа, но исполнительные агенты получают только нужные package slices и точечные supporting sources.

Новые `FEATURE-*` используют стандартную структуру:

```text
docs/system/feature-specs/<feature-id>-<slug>/
|-- index.md
|-- behavior.md
|-- interfaces.md
|-- ui-behavior.md
|-- test-scenarios.md
```

Существующие flat feature specs остаются legacy package до ближайшего системно-аналитического обновления фичи.

Системный аналитик формирует package в следующем порядке:

1. Источники и границы задачи.
2. Пользовательский сценарий.
3. Сущности и связи между ними.
4. Последовательность действий пользователя, привязанная к UI-элементам.
5. Ограничения инпутов, validations, errors и крайние случаи.
6. Design readiness и оценка полноты прототипа.
7. `index.md`, `behavior.md`, `interfaces.md`, `ui-behavior.md`.
8. `test-scenarios.md` как QA slice package.
9. Role read routes в `index.md`.

Передача архитектору выполняется после того, как feature package полный и прототип готов к работе. Если прототип неполный, системный аналитик фиксирует blocker в task-card и удерживает `FEATURE-*` в ожидании завершения подготовки.

Для UI-ориентированных `FEATURE-*` role read routes включают релевантные versioned-артефакты из `.references/`, если они указаны в карточке задачи, UI contract или package `ui-behavior.md`.

## Ролевые промпты

- `process/prompts/business-analyst/prompt.md` — бизнес-аналитик.
- `process/prompts/system-analyst/prompt.md` — системный аналитик.
- `process/prompts/system-analyst/task-tree-rules.md` — правила дерева задач вокруг `SPRINT-*`, `FEATURE-*` и дочерних задач.
- `process/prompts/architect/prompt.md` — архитектор.
- `process/prompts/frontend/prompt.md` — фронтенд.
- `process/prompts/backend/prompt.md` — бэкенд.
- `process/prompts/devops/prompt.md` — девопс.
- `process/prompts/qa/prompt.md` — тестирование.
- `process/prompts/context-collector/prompt.md` — сборщик контекста.

## Шаблоны

- `process/templates/tasks/task-template.md` — форма карточки задачи.
- `process/templates/tasks/task-template-instruction.md` — инструкция по заполнению карточки, допустимые роли, статусы, приоритеты и правила ссылок.
- `process/templates/feature-specs/feature-spec-package-instruction.md` — инструкция по формированию decomposed feature package.
- `process/templates/feature-specs/feature-spec-template.md` — форма `index.md` feature package для `FEATURE-*`.
- `process/templates/feature-specs/feature-spec-behavior-template.md` — форма `behavior.md` feature package.
- `process/templates/feature-specs/feature-spec-interfaces-template.md` — форма `interfaces.md` feature package.
- `process/templates/feature-specs/feature-spec-ui-behavior-template.md` — форма `ui-behavior.md` feature package.
- `process/templates/context-packages/context-package-template.md` — форма контекстного пакета подзадачи для передачи исполнителю.
- `process/templates/feature-specs/feature-test-scenarios-template.md` — форма `test-scenarios.md` feature package.

## Работа с задачами

- Новые задачи оформляются по `process/templates/tasks/task-template.md` с учетом `process/templates/tasks/task-template-instruction.md`.
- `SPRINT-*` — координационная карточка спринта. Она не является единицей поставки.
- `FEATURE-*` — координационная карточка одной завершенной, тестируемой и демонстрируемой фичи. Именно `FEATURE-*` является единицей поставки.
- Системный аналитик создает или обновляет `SPRINT-*` и `FEATURE-*` карточки.
- Системный аналитик берет в работу `FEATURE-*`, если feature package отсутствует, устарел, не покрывает design readiness, validations, errors, крайние случаи, interfaces, role read routes или QA coverage mapping.
- Для UI-ориентированной `FEATURE-*` системный аналитик анализирует design readiness, оценивает необходимость изменений в `.references/` и при необходимости формирует требования к этим изменениям до передачи фичи архитектору.
- Каждая новая `FEATURE-*` перед передачей архитектору должна ссылаться на готовый package root: `docs/system/feature-specs/<feature-id>-<slug>/`.
- Каждая новая `FEATURE-*` перед передачей архитектору должна ссылаться на package `index.md` и role-relevant slices.
- Package `test-scenarios.md` должен содержать stable scenario IDs, ручной маршрут проверки, e2e coverage mapping и обязательные assertions для сценариев с e2e-покрытием.
- Legacy flat feature specs и sibling `.test-scenarios.md` допустимы только для существующих фич до ближайшего системно-аналитического обновления.
- Если approved UI contract, prototype или канонический визуальный референс меняется в рамках фичи, соответствующие изменения в `.references/` фиксируются через Git в рамках той же `FEATURE-*` или связанной аналитической задачи.
- Архитектор принимает одну аналитически готовую `FEATURE-*` и декомпозирует ее в дочерние `AR/FE/BE/DO/QA-*` задачи.
- Для каждой последующей фичи обязательны две QA-задачи: manual QA и e2e QA.
- Manual QA и e2e QA используют один документ сценариев тестирования фичи как общий источник проверки; lane разделяется в QA-задачах и coverage matrix.
- E2E QA подтверждает соответствие автоматизированных тестов documented scenarios через stable scenario IDs, test file mapping, test title mapping и required assertions.
- Воспроизводимые дефекты оформляются как `BUG-*` задачи под той же `FEATURE-*` с явной меткой контура причины: `frontend`, `backend` или `devops`.

### Scope Constraints для `FEATURE-*`

- `FEATURE-*` не является исполняемой задачей реализации.
- Агент не изменяет production-код, тесты, runtime-конфигурацию или `.references/` напрямую по карточке `FEATURE-*`.
- Поле `Роль` в карточке `FEATURE-*` должно иметь значение текущего владельца этапа жизненного цикла: `Системный аналитик`, `Архитектор` или `Тестирование`.
- Поле `Роль: Системный аналитик` в карточке `FEATURE-*` назначает подготовку feature-level системной документации, а не реализацию в клиентском, серверном, DevOps или QA-контуре.
- Поле `Роль: Архитектор` в карточке `FEATURE-*` назначает архитектурную декомпозицию, а не реализацию в клиентском, серверном, DevOps или QA-контуре.
- Статус `Готова к работе` у `FEATURE-*` означает готовность к этапу, указанному в поле `Роль`.
- Первое исполнительное действие по `FEATURE-*` со статусом `Готова к работе` выполняется в роли системного аналитика, если feature package отсутствует либо требует обновления.
- Первое исполнительное действие по `FEATURE-*` со статусом `Готова к работе` выполняется в роли архитектора только после ссылки на готовый feature package или допустимый legacy flat package.
- Архитектор создает дочерние `AR/FE/BE/DO/QA-*` карточки до начала реализации в клиентском, серверном, DevOps или QA-контуре.
- Реализация допускается только по дочерней `AR-*`, `FE-*`, `BE-*`, `DO-*`, `QA-*` или `BUG-*` карточке с явно заданными границами правок.

## Подготовка контекста

Перед реализацией task-card используется контекстный маршрут:

1. Основной агент читает исходную карточку, ссылки из нее и обязательный `Маршрут чтения` или legacy `Минимальный read set`.
2. Основной агент формирует общий план `<TASK-ID>-execution-plan.md` в корне проекта; для `FEATURE-*` этот план обязателен.
3. Для независимых подзадач создаются контекстные пакеты `<TASK-ID>-context-<NN>-<slug>.md` по `process/templates/context-packages/context-package-template.md`.
4. Если среда поддерживает субагентов, подготовку контекста можно делегировать сборщикам контекста.
5. Исполнитель подзадачи работает только в границах read set, разрешенной зоны правок и проверок, указанных в контекстном пакете.

Контекстный пакет должен содержать цель, поведенческий промпт исполнителя, обязательный read set, ключевые факты, разрешенные и запрещенные зоны правок, зависимости, ожидаемый результат, проверки, критерии готовности, риски и открытые вопросы.

Если подзадача зависит от UI parity, design gaps или prototype updates, контекстный пакет должен ссылаться на конкретные versioned-файлы в `.references/`, которые участвуют в анализе или верификации.
Если контекстный пакет не покрывает обязательный contract, validation, guard, error mapping или другое необходимое правило, агент фиксирует недостающий источник как blocker или открытый вопрос и не заменяет его чтением старых задач.

## Общие правила

- Если создаются или переименовываются рабочие каталоги, документы, шаблоны или ролевые инструкции, обновляйте навигационные документы в той же задаче.
- При создании коммитов используйте Conventional Commits.
- Если обязательный для задачи документ отсутствует, профильная роль фиксирует блокер или создает минимально необходимый артефакт только в разрешенной зоне ответственности.

## Файловая политика

- Текстовые файлы репозитория хранятся в `UTF-8` (BOM-free) и с окончанием строк `LF`.
- `.gitattributes` и `.editorconfig` являются источниками правил для Git, редакторов и агентов.
- В Windows PowerShell 5.1 русскоязычные UTF-8 файлы читайте через `Get-Content -Raw -Encoding UTF8 <file>` или используйте PowerShell 7+, иначе терминал может показать mojibake.

## Выбор задачи

- В работу берутся только задачи со статусом `Готова к работе`.
- Среди задач со статусом `Готова к работе` первой выбирается задача с наивысшим приоритетом.
- Шкала приоритетов задается в `process/templates/tasks/task-template-instruction.md`: `Критический`, `Высокий`, `Средний`, `Низкий`.

## Быстрая навигация

- Роль исполнителя: `process/prompts/<role>/prompt.md`.
- Правила дерева задач: `process/prompts/system-analyst/task-tree-rules.md`.
- Шаблон задачи: `process/templates/tasks/task-template.md`.
- Инструкция к шаблону задачи: `process/templates/tasks/task-template-instruction.md`.
- Шаблон контекстного пакета: `process/templates/context-packages/context-package-template.md`.
- Инструкция feature package: `process/templates/feature-specs/feature-spec-package-instruction.md`.
- Шаблон package index: `process/templates/feature-specs/feature-spec-template.md`.
- Шаблон package behavior: `process/templates/feature-specs/feature-spec-behavior-template.md`.
- Шаблон package interfaces: `process/templates/feature-specs/feature-spec-interfaces-template.md`.
- Шаблон package UI behavior: `process/templates/feature-specs/feature-spec-ui-behavior-template.md`.
- Шаблон package test scenarios: `process/templates/feature-specs/feature-test-scenarios-template.md`.
