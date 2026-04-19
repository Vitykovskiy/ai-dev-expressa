# Frontend Architecture

## Базовый стандарт

- Клиентская часть Expressa v1 реализуется на `Vue 3`.
- Для backoffice UI используется `Vuetify`.
- React-референсы из `.references/Expressa_admin` применяются как визуальный и поведенческий ориентир, но не как стек реализации.
- Клиентский код не является источником истины по ролям, Telegram identity или test-mode доступу.

## Для FEATURE-001

Подробная карта реализации входа administrator и role-based navigation находится в `docs/architecture/application-map/frontend-backoffice.md`.
