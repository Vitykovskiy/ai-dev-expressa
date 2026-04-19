# Architecture Navigation

## Назначение

Этот каталог фиксирует архитектурный слой для подготовки реализации Expressa v1. Он нужен исполнителям `FE-*`, `BE-*`, `DO-*` и `QA-*`, чтобы не переопределять стек, точки входа, env/config, маршруты и границы ответственности локально в задачах.

## Навигация

- `stack.md` — базовые технологические ограничения и принятые рамки реализации.
- `frontend-architecture.md` — базовый стандарт клиентской части, Vue SFC, frontend-декомпозиции и frontend quality gates.
- `frontend-ui-kit.md` — правила канонического `App*` UI-набора для backoffice и граница между `ui` и feature-компонентами.
- `backend-architecture.md` — базовый стандарт серверной части, NestJS boundaries и backend quality gates.
- `devops-standards.md` — базовый стандарт runtime, delivery, локальных hooks и PR gates.
- `deployment-map.md` — окружения и deployment-ограничения.
- `qa-standards.md` — базовый стандарт проверок, regression evidence и acceptance рефакторинга.
- `application-map.md` — индекс контурных карт и маршрут выбора нужной карты.
- `application-map/frontend-backoffice.md` — клиентский backoffice-контур.
- `application-map/backend-access.md` — серверный контур идентификации, ролей и Telegram-доступа.
- `application-map/backend-menu-catalog.md` — серверный контур управления каталогом меню.
- `application-map/delivery-and-runtime.md` — env/config, запуск, развёртывание и smoke-check для затронутого контура.
- `application-map/qa-access.md` — тестовый контур для проверки входа administrator.
- `application-map/qa-menu-catalog.md` — тестовый контур для проверки управления каталогом меню.

## Правило использования

Исполнитель читает только те архитектурные карты, которые указаны в его карточке задачи. Если при реализации появляется новый маршрут, env/config или межконтурная связь, исполнитель обновляет соответствующую контурную карту и не меняет системное поведение без обновления `docs/system/`.
