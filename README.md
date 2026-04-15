# Expressa

Корневой README описывает структуру репозитория и помогает быстро найти нужные артефакты проекта.

## Структура проекта

```text
.
|-- apps/
|   |-- api/
|   `-- backoffice-web/
|-- docs/
|   |-- architecture/
|   |-- business/
|   |   |-- business-rules/
|   |   |-- glossary/
|   |   |-- scenarios/
|   |   `-- vision/
|   `-- system/
|       |-- contracts/
|       |-- domain-model/
|       |-- state-models/
|       |-- system-context/
|       |-- ui-behavior-mapping/
|       |-- ui-contracts/
|       `-- use-cases/
|-- prompts/
|   |-- architect/
|   |-- backend/
|   |-- business-analyst/
|   |-- devops/
|   |-- frontend/
|   |-- qa/
|   `-- system-analyst/
|-- packages/
|   `-- shared-types/
|-- infra/
|   `-- feature-001/
|       |-- env/
|       |-- scripts/
|       `-- README.md
|-- .github/
|   `-- workflows/
|-- tasks/
|-- templates/
|-- package-lock.json
|-- package.json
|-- tsconfig.base.json
`-- исходные материалы
```

## Что где находится

- `docs/` — проектная документация.
- `apps/` — прикладные контуры monorepo. На текущем этапе фактически созданы `apps/api` и `apps/backoffice-web` для foundation-среза `FEATURE-001`.
- `docs/architecture/` — архитектурные решения, карта приложения, кодстайл и deployment guidance.
- `docs/architecture/README.md` — навигационная карта по архитектурным артефактам.
- `docs/architecture/stack.md` — канонический источник по стеку и технологическим ограничениям.
- `docs/architecture/code-style.md` — единый coding standard и правила unit tests.
- `docs/architecture/du-01-administration.md` — архитектурная рамка первой административной поставки `DU-01`, backlog фич `Sprint-001` и правила feature-декомпозиции.
- `docs/architecture/application-map.md` — обязательная карта приложения: модули, entrypoints, зависимости, запуск, тестирование и deployment-маршруты.
- `docs/architecture/deployment-map.md` — карта окружений, CI/CD, env vars, smoke-check и rollback.
- `docs/business/` — бизнес-артефакты, описывающие продукт, правила и сценарии.
- `docs/business/vision/` — материалы о границах продукта, целях и scope.
- `docs/business/scenarios/` — бизнес-сценарии и пользовательские потоки.
- `docs/business/business-rules/` — бизнес-правила, ограничения и допущения.
- `docs/business/glossary/` — термины предметной области.
- `docs/system/` — системные артефакты, описывающие границы системы, поведение и контракты.
- `docs/system/system-context/` — границы системы, внешние роли и системные срезы для анализа.
- `docs/system/domain-model/` — системные сущности, атрибуты, связи и инварианты.
- `docs/system/use-cases/` — системное поведение по отдельным use case.
- `docs/system/contracts/` — контракты взаимодействий, входы, выходы и ошибки.
- `docs/system/state-models/` — жизненные циклы сущностей и допустимые переходы.
- `docs/system/ui-contracts/` — входные UI-контракты для системного анализа.
- `docs/system/ui-behavior-mapping/` — привязка UI-поведения к системным артефактам.
- `packages/` — shared-пакеты monorepo. На текущем этапе фактически создан `packages/shared-types` для typed foundation DTO.
- `infra/` — runtime- и smoke-артефакты инфраструктурного среза. Для `FEATURE-001` здесь лежат env templates, скрипты запуска и smoke-проверка.
- `.github/workflows/` — CI-пайплайны проекта. Для foundation-среза `FEATURE-001` здесь зафиксирована проверка `typecheck + test + build + smoke`.
- `prompts/` — промпты для рабочих ролей и агентов проекта; каждая подпапка соответствует отдельной роли и содержит ее рабочие инструкции.
- `prompts/architect/` — промпты архитектора: фиксация архитектурного контура, актуализация `docs/architecture/`, декомпозиция `Sprint-*` в `FEATURE-*` и активной `FEATURE-*` в `AR/FE/BE/DO`.
- `prompts/backend/` — промпты backend-разработчика: реализация серверной части feature-срезов в `apps/api` и связанных shared/backend-контрактов.
- `prompts/business-analyst/` — промпты бизнес-аналитика: работа с `docs/business/`, границами продукта, правилами и сценариями.
- `prompts/devops/` — промпты DevOps-инженера: runtime, env/config, CI/CD, smoke-маршруты и deployment-потоки.
- `prompts/frontend/` — промпты frontend-разработчика: реализация клиентской части feature-срезов в `apps/backoffice-web`.
- `prompts/qa/` — каталог роли QA; используется для материалов приемки и проверки sprint/feature-инкрементов, даже если отдельный `prompt.md` еще не добавлен.
- `prompts/system-analyst/` — промпты системного аналитика: подготовка системных артефактов и `Sprint-*`; файл `task-tree-rules.md` фиксирует правила дерева задач `Sprint -> Feature`.
- `templates/` — шаблоны артефактов и инструкции по их заполнению.
- `tasks/` — каталог для итоговых задач проекта. Все оформленные и актуальные задачи нужно складывать сюда.
- `package.json`, `package-lock.json`, `tsconfig.base.json` — root workspace-конфигурация `npm workspaces` для запуска, smoke-проверки, сборки и typecheck foundation-среза `api + backoffice-web + shared-types`.
- Корневые исходные материалы — входные документы, от которых строится проектная документация.

## Работа с задачами

- Новые задачи оформляются по шаблону из `templates/`.
- Итоговые задачи хранятся в каталоге `tasks/`.
- Аналитические роли используют промпты из каталога `prompts/`.
- Родительская карточка `Sprint-*` в backlog соответствует ровно одной delivery unit и служит координационной границей инкремента.
- Карточка `FEATURE-*` описывает минимальную independently reviewable фичу внутри одного `Sprint-*` и ссылается на него через поле `Родительская задача`.
- Дочерние карточки `AR/FE/BE/DO-*` по умолчанию создаются только для той `FEATURE-*`, которая реально стартует в разработку; их родителем является соответствующая `FEATURE-*`.
- Финальная карточка `QA-*` по умолчанию относится к `Sprint-*` и фиксирует приемку собранного инкремента из завершенных фич.
- Системный аналитик готовит только `Sprint-*`, архитектор фиксирует стек и кодстайл, обновляет архитектурные артефакты, нарезает спринт на backlog фич и только затем декомпозирует активную фичу на `AR/FE/BE/DO`.
- Если фичу нельзя развернуть, проверить отдельным smoke/scenario и показать как самостоятельный vertical slice, она декомпозирована недостаточно.

## Обязательные архитектурные артефакты

- Перед стартом разработки должны быть определены и зафиксированы `docs/architecture/stack.md` и `docs/architecture/code-style.md`.
- `docs/architecture/application-map.md` обязателен для проекта и должен оставаться актуальным.
- При изменении структуры кода, entrypoints, интерфейсов между модулями, env/config, способов запуска, тестирования или деплоя нужно обновить:
  - `docs/architecture/application-map.md`
  - `docs/architecture/README.md`
  - `README.md`, если корневая навигация по репозиторию устарела

## Выбор задачи

- В работу берется задача из комбинации статуса `Готова к работе` и приоритета.
- Сначала отбираются только задачи со статусом `Готова к работе`.
- Из списка задач со статусом `Готова к работе` выбирается задача с наивысшим приоритетом.
- Детализация правил выбора задачи будет дополнена позже.

## Навигация

- Для архитектурного контекста переходите в `docs/architecture/`.
- Для бизнес-контекста переходите в `docs/business/`.
- Для системного контекста переходите в `docs/system/`.
- Для запуска роли используйте каталог `prompts/`.
- Для постановки новых задач используйте каталог `templates/`.
