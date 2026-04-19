# Backoffice UI Set

Базовые компоненты backoffice живут в `frontend/src/components/ui/` и являются единственной точкой сборки повторяющихся паттернов из `.references/Expressa_admin`.

## Правила

- Все публичные базовые компоненты имеют префикс `App*`.
- Feature-компоненты из `components/menu-catalog/` и route-level views используют `App*` вместо локального копирования стилей shell, dialog, action button, empty state и section containers.
- Если новый визуальный паттерн повторяется минимум в двух местах или относится к shell/backoffice-wide UI, он сначала добавляется сюда, затем применяется в feature-коде.
- Компоненты здесь адаптируют `Vuetify`, но их публичный контракт не должен протекать лишними деталями `Vuetify`.

## Компоненты

- `AppButton`: базовая кнопка backoffice. `variant`: `primary | secondary | outlined | destructive | ghost | tonal`.
- `AppIconButton`: icon-only кнопка для header actions, edit actions и toolbar.
- `AppTopBar`: мобильный top bar с `title` и слотами `left`/`right`.
- `AppSideNav`: планшетная навигация shell. Интерфейс: `tabs`, `roleLabel`, `activePath`.
- `AppTabBar`: мобильная навигация shell. Интерфейс: `tabs`, `activePath`.
- `AppEmptyState`: иконка, заголовок, подзаголовок и опциональный слот `actions`.
- `AppSectionCard`: контейнер секции с `title`, `subtitle`, слотом `actions`.
- `AppSectionList`: вариант секции со flush-body для списков и row-based layout.
- `AppFormField`: label/hint/error shell для `v-text-field`, `v-select` и других input controls.
- `AppStatusBadge`: канонические badge variants из референса.
- `AppToggleRow`: reusable toggle row с `modelValue`, `label`, `description`.
- `AppDialogShell`: общий layout диалогов с `title`, `description`, `headerActions`, `actions`.
- `AppInlineAction`: compact tonal action button для inline add/create flows.

## Обязательное применение сейчас

- Shell: `RootLayout`, `AppSideNav`, `AppTabBar`, `AppTopBar`.
- Menu flow: `MenuCatalogView`, `MenuCatalogCategoryList`, `MenuCatalogOptionGroupsPanel`, `MenuCategoryDialog`, `MenuItemDialog`, `MenuOptionGroupDialog`.
- Stub views текущих вкладок: использовать `AppTopBar` и `AppSectionCard` как базовый каркас вместо локальных panel styles.

## Подготовлено для следующих вкладок

- `AppStatusBadge` для `orders` и `users`.
- `AppToggleRow` для `availability` и `settings`.
- `AppEmptyState` для `orders`, `availability`, `users`.
- `AppSectionList` для row lists в `orders`, `availability`, `users`, `settings`.
