# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-008`
- Родительская задача: `FEATURE-008`
- Заголовок: `Привести backoffice UI к Vuetify-first подходу`
- Единица поставки: `FEATURE-008`
- Роль: `Фронтенд`
- Контурная карта: `docs/architecture/application-map/frontend-backoffice.md`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Цель

`Провести аудит и поведенчески нейтральный рефакторинг клиентской части backoffice, чтобы UI строился от Vue 3, Vuetify и канонического frontend/src/ui layer, а самописные аналоги штатных компонентов были либо заменены, либо обоснованы.`

## Границы задачи

### Behavioral Requirements

- Система должна перед изменением UI определить тип элемента: layout shell, navigation, table, dialog, button, icon button, text field, select, switch, snackbar, empty state, status badge, section container или feature-specific composition.
- Система должна проверять подходящий компонент `Vuetify` перед созданием или сохранением кастомного UI-решения.
- Система должна проверять существующий `frontend/src/ui` primitive перед добавлением нового `ui-*` primitive.
- Система должна добавлять новый `ui-*` primitive только для повторяемого backoffice-wide паттерна или shell-wide паттерна.
- Система должна использовать feature-specific компонент только для composition, состояния фичи и сценарной сборки поверх `Vuetify` и `ui-*`.
- Система должна фиксировать в `Результат выполнения` проверенную штатную возможность `Vuetify` и причину отклонения, если кастомная реализация сохраняется.
- Система должна учитывать `BUG-004` как уже заведенный scope для таблицы групп меню поверх `v-data-table`.

### Назначенные инструменты и официальная документация

- `Vue 3`: `https://vuejs.org/guide/`
- `Vuetify components`: `https://vuetifyjs.com/en/components/all/`
- `Vuetify data tables`: `https://vuetifyjs.com/en/components/data-tables/basics/`
- `Vitest`: `https://vitest.dev/guide/`

### Scope Constraints

- Задача охватывает клиентский backoffice UI alignment без изменения пользовательских сценариев.
- Табличный список групп меню из `BUG-004` находится вне области `FE-008`.
- Изменение backend API, DTO, auth/session bootstrap, capability semantics, route paths, backend error mapping и e2e suite находится вне области задачи.
- Изменение `.references/` находится вне области задачи.

### Safety Constraints

- Система должна сохранять текущее поведение route `/`, `/availability`, `/menu`, `/users`, `/settings`, `/forbidden` и `/entry-denied`.
- Система должна сохранять server-driven actor, roles и capabilities.
- Система должна сохранять текущие request/response shapes клиентских API modules.
- Система должна оформлять воспроизводимый UI defect как отдельную `BUG-*` задачу под `FEATURE-008` или соответствующую исходную feature.

## Зона ответственности

### Разрешенная зона правок

- `frontend/src/ui/**`
- `frontend/src/views/**`
- `frontend/src/components/**`
- `frontend/src/**/*.spec.ts`
- `docs/architecture/application-map/frontend-backoffice.md`, если меняется карта UI primitives
- `docs/architecture/frontend-ui-kit.md`, если меняется публичный контракт UI primitive layer
- `tasks/FE-008-vuetify-first-backoffice-ui-alignment.md`
- `tasks/BUG-*.md` только для воспроизводимых frontend-дефектов, найденных в рамках аудита

### Запрещенная зона правок

- `backend/**`
- `e2e/**`
- `docs/system/**`
- `docs/business/**`
- `.references/**`
- Runtime/deployment configuration
- Реализация табличной группировки меню, уже назначенная `BUG-004`

## Маршрут чтения

- `process/workflow.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/frontend-ui-kit.md`
- `docs/architecture/application-map/frontend-backoffice.md`
- `frontend/src/ui/README.md`
- `https://vuejs.org/guide/`
- `https://vuetifyjs.com/en/components/all/`

## Справочные ссылки

- `tasks/BUG-004-menu-catalog-category-list-data-table.md` — уже заведенный frontend-дефект по `v-data-table`, не включать повторно в `FE-008`.
- `https://vuetifyjs.com/en/components/data-tables/basics/` — читать только при проверке пересечения с `BUG-004` или новых table-like паттернов.
- `https://vitest.dev/guide/` — читать при добавлении или изменении frontend tests.

## Результат готовности

`Клиентский backoffice использует Vuetify и frontend/src/ui как базовую UI-основу, feature-компоненты не дублируют reusable primitives, а все сохраненные кастомные UI-решения имеют зафиксированную причину отклонения от штатного Vuetify пути.`

## Проверки

- `npm run lint:frontend`
- `npm run stylelint:frontend`
- `npm run format:check:frontend`
- `npm run typecheck:frontend`
- `npm run test:frontend`
- `npm run build:frontend`
- Ручная проверка затронутых backoffice routes на отсутствие изменения пользовательского поведения.

## Результат выполнения

`не заполнено`
