# Frontend Architecture

## Базовый стандарт

- Клиентская часть Expressa v1 реализуется на `Vue 3`.
- Для backoffice UI используется `Vuetify`.
- React-референсы из `.references/Expressa_admin` применяются как визуальный и поведенческий ориентир, но не как стек реализации.
- Клиентский код не является источником истины по ролям, Telegram identity или test-mode доступу.
- Для routing, composition, forms, reactivity и UI composition используется нативный путь project-selected client stack, если он покрывает задачу без нарушения project constraints.
- Перед выбором нового frontend package исполнитель читает релевантные разделы official docs из `docs/architecture/stack.md` и проверяет, не перекрывает ли этот сценарий встроенный механизм текущего client stack или уже принятого UI toolkit.

## Для FEATURE-001

Подробная карта реализации входа administrator и role-based navigation находится в `docs/architecture/application-map/frontend-backoffice.md`.

## Для FEATURE-002

Экран управления меню реализуется внутри существующего backoffice route `/menu` по карте `docs/architecture/application-map/frontend-backoffice.md` и системной привязке `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`. Клиентский контур не является источником истины по правилам каталога и использует backend contract управления меню.

## Для FEATURE-003

Экран управления рабочими часами и вместимостью слотов реализуется внутри существующего backoffice route `/settings` по карте `docs/architecture/application-map/frontend-backoffice.md` и contract `docs/system/contracts/slot-settings-management.md`. Клиентский контур не канонизирует верхнюю границу `slotCapacity=50` только на основании UI reference и использует backend response/error mapping как источник истины для сохранения настроек и отображения validation state.

## Стандарт Vue SFC и декомпозиции

- Все новые и рефакторимые `.vue` файлы используют порядок секций `template` -> `script` -> `style`.
- Для новых и рефакторимых SFC обязательна секция `<style scoped lang="scss">`. Глобальные стили допускаются только в существующих глобальных style entrypoints и не должны появляться как побочный эффект feature-рефакторинга.
- `script setup lang="ts"` является стандартом для новых SFC. Исключение допустимо только при интеграции с существующим компонентом, где иной синтаксис уже является локальным контрактом.
- `views/` содержит route-level orchestration: загрузку данных, связь с router/auth state и сборку feature-сценария. View не должен содержать крупные повторяемые формы, таблицы, domain validation или API details.
- `components/` содержит переиспользуемые UI-компоненты без знания backend endpoint shape. Feature-specific компоненты для меню должны быть выделены из view, если компонент имеет самостоятельную форму, таблицу, диалог или repeatable row.
- `modules/<feature>/api.ts` является client API boundary. Компоненты и views не собирают URL, headers Telegram/test-mode или transport error mapping напрямую.
- `modules/<feature>/types.ts` содержит typed view-model/contract-facing формы, нужные клиентскому контуру. Типы не должны расходиться с `docs/system/contracts/*`.
- `modules/<feature>/store.ts` или композиционные функции владеют локальным состоянием feature. Состояние роли, actor и capabilities не вычисляется из UI и берётся из backoffice auth contract.
- Композиционные функции выделяются, когда view или компонент содержит повторяемую orchestration логику, form state, derived state или side effects. Композиционная функция не должна напрямую менять route guard semantics.
- Целевой размер: route-level view до 300 строк, feature component до 250 строк, композиционная функция или API module до 200 строк. Превышение требует декомпозиции или короткого обоснования в ревью.

## Frontend quality gates

- Обязательные проверки для клиентского контура: `npm run lint`, `npm run stylelint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run build`.
- Stylelint должен проверять новые и рефакторимые `style scoped lang="scss"` блоки; отключение правила в файле допустимо только с локальным обоснованием рядом с исключением.
- Рефакторинг SFC не должен менять route names, route paths, видимость role-based navigation, forbidden screen behavior, auth/session bootstrap, API request/response shape или error mapping.
- Для `FEATURE-006` frontend acceptance обязательно сравнивает поведение `/menu` до и после рефакторинга по сценариям `FEATURE-002`, включая отказ пользователю без capability `menu`.
