# Контекст реализации `FE-011`

## Назначение

Этот документ собирает рабочий контекст для задачи `tasks/FE-011-feature-006-base-component-system.md`. Он нужен как точка входа перед реализацией базовой системы компонентов в `apps/backoffice-web/src/components/base`.

## Источники

- `README.md`
- `terms-map.md`
- `tasks/FE-011-feature-006-base-component-system.md`
- `tasks/FE-010-feature-006-design-tokens-and-vuetify-theme.md`
- `tasks/FEATURE-006-backoffice-ui-component-system-and-current-screen-migration.md`
- `docs/architecture/frontend-architecture.md`
- `docs/architecture/application-map/backoffice-web.md`
- `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`
- `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- `.references/Expressa_admin/src/app/components/Button.tsx`
- `.references/Expressa_admin/src/app/components/StatusBadge.tsx`
- `.references/Expressa_admin/src/app/components/EmptyState.tsx`
- `.references/Expressa_admin/src/app/components/FilterTabs.tsx`
- `.references/Expressa_admin/src/app/components/ToggleRow.tsx`
- `.references/Expressa_admin/src/app/components/ConfirmDialog.tsx`
- `.references/Expressa_admin/src/app/components/Skeleton.tsx`
- `apps/backoffice-web/src/styles/design-tokens.ts`
- `apps/backoffice-web/src/vuetify.ts`
- `apps/backoffice-web/src/layouts/BackofficeLayout.vue`
- `apps/backoffice-web/src/composables/backoffice-layout-state.ts`
- текущие компоненты и проверки в `apps/backoffice-web/src/components`, `src/pages`, `src/layouts`, `src/composables`

## Что именно нужно сделать в `FE-011`

Нужно создать базовый слой компонентов в `apps/backoffice-web/src/components/base`:

- `Button`
- `StatusBadge`
- `EmptyState`
- `Skeleton`
- `FilterTabs`
- `SectionList`
- `FormField`
- `ToggleRow`
- `ConfirmDialog`

Цель задачи: подготовить тонкие Vue-компоненты над `Vuetify`, чтобы `FE-012` и `FE-013` могли переносить shell и экраны на единый визуальный слой без смешения с маршрутизацией, transport-слоем и хранилищами состояния.

## Жёсткие архитектурные ограничения

- Базовые компоненты живут только в `apps/backoffice-web/src/components/base`.
- Компоненты получают данные и действия через `props`, `emits` и `slots`.
- Компонентам запрещено знать о `router`, HTTP-клиентах, Telegram-адаптере, route guards и хранилищах состояния.
- Прямые API-вызовы и любая предметная оркестрация в этих компонентах запрещены.
- Источник визуальных значений уже задан в `docs/system/ui-contracts/expressa-backoffice-ui-contract.json`.
- Канонический набор токенов уже вынесен в `apps/backoffice-web/src/styles/design-tokens.ts`, а тема `Vuetify` настроена в `apps/backoffice-web/src/vuetify.ts`.
- React-референс разрешено использовать только как визуальный ориентир для композиции, пропорций, состояний и адаптивности.
- Переносить из референса React, Radix, Tailwind, локальные mock-действия и неподтверждённое системное поведение нельзя.

## Зависимость от `FE-010`

`FE-010` завершена. В приложении уже есть:

- цвета, типографика, отступы, радиусы, тени и анимации в `src/styles/design-tokens.ts`
- CSS-переменные `--expressa-*`
- тема `Vuetify` с цветовыми ключами `primary`, `success`, `warning`, `error`, `text-*`, `border*`
- базовые defaults для `VCard`, `VBtn`, `VChip`, `VTextField`, `VTextarea`, `VSelect`, `VDialog`, `VBottomNavigation`

Практический вывод: в `FE-011` не нужно заново определять hex-цвета, радиусы и типографику внутри компонентов. Базовые компоненты должны опираться на токены и defaults темы.

## Текущее состояние клиентской части

- Пакет `apps/backoffice-web` использует `Vue 3`, `Vuetify`, `Vue Router`, `Vitest`.
- В рабочем дереве уже появился каталог `src/components/base` с локальной реализацией:
  - `Button.vue`
  - `StatusBadge.vue`
  - `EmptyState.vue`
  - `types.ts`
  - проверки `Button.spec.ts`, `StatusBadge.spec.ts`, `EmptyState.spec.ts`
- Остальные базовые компоненты из `FE-011` пока ещё не собраны: `Skeleton`, `FilterTabs`, `SectionList`, `FormField`, `ToggleRow`, `ConfirmDialog`.
- Сейчас существуют только feature-компоненты:
  - `MenuAddonGroupEditorForm.vue`
  - `MenuCatalogSavePanel.vue`
  - `MenuCategoryFormDialog.vue`
  - `MenuCategoryList.vue`
  - `MenuProductEditorForm.vue`
- `BackofficeLayout.vue` пока собирает shell напрямую из `Vuetify`-компонентов и собственных стилей.
- Страницы и формы `FEATURE-002` тоже пока используют прямые `VBtn`, `VTextField`, `VSelect` и локальную разметку.

Практический вывод: `FE-011` не должен переписывать shell или страницы целиком, но должен завершить базовый слой и привести его к форме, пригодной для следующего переноса.

## Что уже известно из UI-контракта

### `Button`

- Варианты: `primary`, `secondary`, `destructive`, `ghost`
- Состояния: `disabled`, `loading`, `pressed`
- База по контракту: радиус `md`, минимум по касанию `44px`, типографика `label`

### `StatusBadge`

- Пилюльная форма
- Базовые статусы из контракта: `Created`, `Confirmed`, `Ready for pickup`, `Rejected`, `Closed`
- В референсе статусы получают русские подписи, отличные от исходных статусных значений

### `EmptyState`

- Центрированная вертикальная компоновка
- Иконка, заголовок, подзаголовок
- Используется как пустое состояние разных экранов

### `Skeleton`

- В UI-контракте перечислены skeleton-состояния для списков
- В референсе есть только частный `OrderCardSkeleton`
- Для `FE-011` полезнее сделать универсальный базовый компонент, который можно переиспользовать в списках, карточках и строках

### `FilterTabs`

- Горизонтальная лента фильтров
- Поддерживает активный элемент
- На мобильном сценарии используется как sticky-блок под верхней панелью
- Внутренний административный контур использует такие фильтры в `orders`, `availability`, `users`

### `SectionList`

- Контракт задаёт заголовок секции, фон surface, рамку, радиус и список вложенных элементов
- Компонент нужен как контейнер секции, а не как владелец данных

### `FormField`

- Нужен общий каркас поля формы: label, hint, error, slot под control
- Визуальные параметры уже заложены в defaults `VTextField`/`VSelect`/`VTextarea`
- Базовый компонент должен уметь оборачивать разные поля без дублирования подписей и ошибок

### `ToggleRow`

- Строка с label, необязательным sublabel и переключателем справа
- Есть disabled-состояние
- В UI-контракте и референсе используется для доступности и для флагов формы

### `ConfirmDialog`

- На мобильном сценарии: нижний sheet
- На планшете: центрированное модальное окно
- Есть title, description, confirm/cancel
- Для части действий нужен обязательный ввод причины
- Запрещено зашивать в компонент конкретные действия вроде отклонения заказа или выхода без сохранения

## Рекомендуемая форма API компонентов

Это не зафиксировано в системных документах как обязательный public API, но такой набор согласован с задачей и текущим кодом.

### `Button`

- `props`: `variant`, `disabled`, `loading`, `type`, `block`
- `slots`: default, optional leading/trailing icon
- `emits`: нативный `click` без предметной логики

### `StatusBadge`

- `props`: `status` или `variant`, optional `label`
- если нужен режим поверх системного статуса заказа, безопаснее поддержать оба варианта:
  - системное значение статуса
  - ручной визуальный вариант

### `EmptyState`

- `props`: `title`, `subtitle`
- `slots`: `icon`, optional `actions`

### `Skeleton`

- `props`: `variant` или набор флагов для типовых шаблонов (`card`, `list-row`, `text-block`)
- без привязки к заказам как к предметному срезу

### `FilterTabs`

- `props`: `items`, `modelValue`, optional `sticky`
- `emits`: `update:modelValue`
- item-модель лучше держать простой: `id`, `label`, optional `disabled`

### `SectionList`

- `props`: `title`, `subtitle`
- `slots`: default, optional `actions`, optional `header`

### `FormField`

- `props`: `label`, `hint`, `error`, `required`
- `slots`: default
- задача компонента: унифицировать подпись, служебный текст и отступы, а не заменить все controls собственной реализацией

### `ToggleRow`

- `props`: `label`, `sublabel`, `modelValue`, `disabled`
- `emits`: `update:modelValue`

### `ConfirmDialog`

- `props`: `modelValue`, `title`, `description`, `confirmLabel`, `confirmVariant`, `requireInput`, `inputPlaceholder`, `loading`
- `emits`: `update:modelValue`, `confirm`, `cancel`
- полезно передавать значение поля причины в `confirm`

## Где эти компоненты будут востребованы дальше

- `FE-012`:
  - `Button` для действий в `TopBar`, `TabBar`, `SideNav`
  - `EmptyState` для placeholder-состояний вкладок
- `FE-013`:
  - `FilterTabs` для экранов `orders`, `availability`, `users`
  - `SectionList` для списков категорий, товаров, групп дополнительных опций
  - `FormField` и `ToggleRow` для редакторов меню
  - `ConfirmDialog` для несохранённых изменений и destructive-действий
- текущие feature-компоненты `MenuCatalogSavePanel.vue`, `MenuProductEditorForm.vue`, `MenuAddonGroupEditorForm.vue` почти наверняка будут кандидатами на раннее внедрение `Button`, `FormField`, `SectionList`, `ToggleRow`

## Что не входит в `FE-011`

- Перенос `TopBar`, `TabBar`, `SideNav` и root shell
- Пересборка страниц `Menu*.vue`
- Любые новые операции каталога меню
- Добавление неподтверждённых действий из UI-контракта
- Поле изображения товара как системная возможность
- Новые зависимости в `package.json`
- Вынос системы компонентов в отдельный общий пакет

## Риски и ловушки

- Самая вероятная ошибка: превратить базовые компоненты в feature-компоненты со знанием о заказах, меню или доступе.
- Вторая типовая ошибка: дублировать токены локальными стилями вместо использования `Vuetify` defaults и `--expressa-*`.
- Для `StatusBadge` нужно не перепутать системное значение статуса и текст показа.
- Для `ConfirmDialog` нельзя зашивать локальное состояние так, чтобы оно мешало управлению извне через `v-model`.
- Для `FormField` важно не сделать компонент слишком «умным»: он должен собирать визуальную оболочку, а не владеть всей валидацией формы.
- Для `FilterTabs` sticky-поведение лучше сделать опциональным, иначе компонент станет слишком жёстко привязан к одному экрану.

## Проверки и шаблон тестирования

По карточке задачи обязательны:

- `npm run test --workspace @expressa/backoffice-web`
- `npm run build --workspace @expressa/backoffice-web`

Минимальный набор модульных проверок для самих компонентов:

- `Button`: варианты, disabled/loading, проброс `click`
- `StatusBadge`: соответствие вариантов цветам и подписям
- `EmptyState`: рендер title/subtitle/slot
- `Skeleton`: рендер типовых вариантов
- `FilterTabs`: рендер элементов и `update:modelValue`
- `SectionList`: заголовок и slot-контент
- `FormField`: label, error, hint, required-mark и slot
- `ToggleRow`: `update:modelValue`, disabled
- `ConfirmDialog`: открытие/закрытие, `confirm`, optional required input

Текущий шаблон `Vitest` в приложении:

- используется `@vue/test-utils`
- при необходимости подключаются `plugins: [router, vuetify]`
- стиль проверок — через `mount(...)`, `nextTick()`, `wrapper.text()`, выбор по `data-testid`

## Практический порядок реализации

1. Создать `src/components/base`.
2. Вынести наиболее атомарные компоненты: `Button`, `StatusBadge`, `EmptyState`.
3. Затем собрать контейнеры и поля: `SectionList`, `FormField`, `ToggleRow`.
4. После этого сделать `FilterTabs` и `ConfirmDialog`.
5. Завершить универсальным `Skeleton`.
6. Добавить компонентные проверки на `Vitest`.
7. Обновить `docs/architecture/application-map/backoffice-web.md`, если фактическая структура `src/components` изменится.

## Признак готовности результата

Контекст собран корректно, если по нему можно начать реализацию `FE-011` без повторного поиска по репозиторию:

- понятен допустимый слой и границы ответственности
- известны все целевые базовые компоненты
- зафиксирован единый источник визуальных значений
- понятны текущие точки интеграции
- перечислены запреты, риски и проверки
