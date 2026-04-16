# Технологический стек Expressa v1

## Решение

- Формат репозитория: `npm` workspace monorepo.
- Основной язык: `TypeScript` во всех прикладных контурах.
- Frontend:
  - `Vue 3`
  - `Vite`
  - `Vuetify`
  - `Pinia`
  - `Vue Router`
  - `Vitest`
- Backend:
  - `NestJS`
  - `PostgreSQL`
  - `Prisma`
  - `Jest`
- Интеграционные контуры:
  - отдельный `клиентский бот`
  - отдельный `служебный бот`
  - общий backend API и доменная логика
- DevOps:
  - `Docker`
  - `Docker Compose` для локальной сборки контуров
  - `GitHub Actions` для CI/CD

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
- Нельзя вводить новый framework, слой хранения данных, инструмент развёртывания или исполняемый контур без обновления этого файла, `application-map.md` и связанных дочерних задач.


