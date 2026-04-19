# Frontend UI Kit

## Назначение

`frontend/src/components/ui/` является каноническим слоем базовых backoffice primitives поверх `Vuetify`. Этот слой переводит повторяющиеся паттерны из `.references/Expressa_admin` в типизированные `Vue 3` компоненты и исключает локальное копирование визуального контракта в feature-коде.

## Границы

- `components/ui/` содержит только backoffice-wide primitives: shell navigation, top bar, section containers, empty states, dialog shell, button variants, field shell, toggle row, status badge и близкие паттерны.
- `components/<feature>/` содержит только feature-specific composition и не должен заново определять базовые кнопки, панели, top bar, dialog chrome, tab bar, side nav или empty state.
- `views/` используют `App*` компоненты для route-level layout и orchestration, но не владеют собственным визуальным контрактом shell.

## Правило добавления

- Если паттерн повторяется минимум в двух местах внутри backoffice или относится к shell, он сначала добавляется в `components/ui/`, затем используется в feature-коде.
- Если паттерн нужен только одной feature и не ожидается как reusable primitive, он остаётся в `components/<feature>/`.
- Публичный контракт `App*` компонентов должен быть типизирован и ограничен props/slots/events, нужными backoffice-контруру; детали `Vuetify` не должны бесконтрольно протекать наружу.

## Обязательное применение

- `RootLayout`, `FeatureStubView`, `MenuCatalogView` и `components/menu-catalog/*` используют `App*` primitives как обязательную базу.
- При будущей реализации `orders`, `availability`, `users`, `settings` нужно опираться на существующие `AppTopBar`, `AppSideNav`, `AppTabBar`, `AppEmptyState`, `AppSectionList`, `AppStatusBadge`, `AppToggleRow`, а не копировать локальные стили из референса заново.

## Документация рядом с кодом

Практический каталог компонентов, их props/slots/events и минимальные примеры использования ведётся в `frontend/src/components/ui/README.md`. Этот markdown является рабочим справочником для FE-исполнителя; данный архитектурный документ фиксирует именно границу и обязательность применения.
