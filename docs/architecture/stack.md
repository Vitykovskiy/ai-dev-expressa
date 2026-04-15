# Технологический стек Expressa v1

## Решение

- Формат репозитория: `npm workspaces` monorepo.
- Основной язык: `TypeScript` во всех прикладных контурах.
- Frontend:
  - `Vue 3`
  - `Vite`
  - `Vuetify`
  - `Vue Router`
  - `Vitest`
- Для текущего `FEATURE-001` отдельный state-management framework не обязателен; foundation-срез может опираться на local reactive state, composables и adapter-layer.
- Backend:
  - `NestJS`
  - `PostgreSQL`
  - `Prisma`
  - `Jest`
- Интеграционные контуры:
  - отдельный `customer bot`
  - отдельный `backoffice bot`
  - общий backend API и доменная логика
- DevOps:
  - `Docker`
  - `Docker Compose` для локальной сборки контуров
  - `GitHub Actions` для CI/CD

## Срез первой поставки `DU-01`

- В `DU-01` обязательны только `apps/api`, `apps/backoffice-web`, `apps/backoffice-bot`, `packages/shared-types`, `infra/` и `.github/workflows`.
- `PostgreSQL` подключается уже в `DU-01`, потому что административный контур хранит пользователей, роли, блокировку, каталог и настройки слотов.
- `apps/customer-web` и `apps/customer-bot` в `DU-01` не создаются.
- `packages/ui` не является обязательным артефактом `DU-01`; общий UI-пакет добавляется только при подтверждённой переиспользуемости между несколькими web-контурами.

## Базовая структура монорепозитория

```text
apps/
  api/
  customer-web/
  backoffice-web/
  customer-bot/
  backoffice-bot/
packages/
  shared-types/
  ui/
infra/
  docker/
  scripts/
.github/
  workflows/
```

## Обязательные ограничения

- Стек должен оставаться совместимым с технологическими constraints из `docs/system/system-context/expressa-v1-telegram-ordering.md`.
- Новые технологические решения фиксируются здесь до начала реализации, а не по факту в коде.
- Нельзя вводить новый framework, persistence layer, deployment tool или runtime contour без обновления этого файла, `application-map.md` и связанных child-задач.
- Для `DU-01` нельзя добавлять customer- или barista-runtime как "техническую подготовку"; такие контуры вводятся только в соответствующих delivery units.
