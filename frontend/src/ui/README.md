# Backoffice UI Set

Базовые компоненты backoffice живут в `frontend/src/ui/` и являются единственной точкой сборки повторяющихся паттернов из `.references/Expressa_admin`.

## Правила

- Все публичные базовые компоненты лежат в `PascalCase`-файлах `Ui*.vue`, а в шаблонах используются как `ui-*`.
- Feature-компоненты из `components/menu-catalog/` и route-level views используют `ui-*` вместо локального копирования стилей shell, dialog, action button, empty state и section containers.
- Если новый визуальный паттерн повторяется минимум в двух местах или относится к shell/backoffice-wide UI, он сначала добавляется сюда, затем применяется в feature-коде.
- Компоненты здесь адаптируют `Vuetify`, но их публичный контракт не должен протекать лишними деталями `Vuetify`.

## Компоненты

- `ui-button`: базовая кнопка backoffice. `variant`: `primary | secondary | outlined | destructive | ghost | tonal`.
- `ui-icon-button`: icon-only кнопка для header actions, edit actions и toolbar.
- `ui-top-bar`: мобильный top bar с `title` и слотами `left`/`right`.
- `ui-side-nav`: планшетная навигация shell. Интерфейс: `tabs`, `roleLabel`, `activePath`.
- `ui-tab-bar`: мобильная навигация shell. Интерфейс: `tabs`, `activePath`.
- `ui-empty-state`: иконка, заголовок, подзаголовок и опциональный слот `actions`.
- `ui-section-card`: контейнер секции с `title`, `subtitle`, слотом `actions`.
- `ui-section-list`: вариант секции со flush-body для списков и row-based layout.
- `ui-form-field`: label/hint/error shell для input controls.
- `ui-text-field`: текстовый/числовой input на Vuetify с каноническими radius, border и focus styles.
- `ui-select`: select control на Vuetify с каноническими radius, border и focus styles.
- `ui-status-badge`: канонические badge variants из референса.
- `ui-toggle-row`: reusable toggle row с `modelValue`, `label`, `description`.
- `ui-dialog-shell`: общий layout диалогов с `title`, `description`, `headerActions`, `actions`.
- `ui-inline-action`: compact tonal action button для inline add/create flows.

## Обязательное применение сейчас

- Shell: `RootLayout`, `ui-side-nav`, `ui-tab-bar`, `ui-top-bar`.
- Menu flow: `MenuCatalogView`, `MenuCatalogCategoryList`, `MenuCategoryDialog`, `MenuItemDialog`.
- Stub views текущих вкладок: использовать `ui-top-bar` и `ui-section-card` как базовый каркас вместо локальных panel styles.

## Подготовлено для следующих вкладок

- `ui-status-badge` для `orders` и `users`.
- `ui-toggle-row` для `availability` и `settings`.
- `ui-empty-state` для `orders`, `availability`, `users`.
- `ui-section-list` для row lists в `orders`, `availability`, `users`, `settings`.
