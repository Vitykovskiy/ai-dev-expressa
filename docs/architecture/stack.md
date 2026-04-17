# Технологический стек Expressa v1

## Решение

- Формат репозитория: `npm` workspace monorepo.
- Основной язык: `TypeScript` во всех прикладных контурах.
- Frontend:
  - `Vue 3`
  - `Vite`
  - `Vuetify`
  - `Vue Router`
  - `Vitest`
- Backend:
  - `NestJS`
  - `PostgreSQL`
  - `TypeORM`
  - `Jest`
- Интеграционные контуры:
  - единый `server` на `NestJS`, который включает HTTP API, клиентский Telegram-бот, служебный Telegram-бот и фоновые процессы уведомлений
  - отдельное `customer` веб-приложение
  - отдельное `backoffice` веб-приложение
- DevOps:
  - `Docker`
  - `Docker Compose` для локальной сборки контуров
  - `Nginx` для публикации собранного `apps/backoffice-web` и проксирования `/api` к `apps/server` в контейнерном маршруте `FEATURE-001`
  - `GitHub Actions` для CI/CD

## Базовая структура монорепозитория

```text
apps/
  server/
  customer-web/
  backoffice-web/
packages/
  shared-types/
infra/
  docker/
  scripts/
.github/
  workflows/
```

## Обязательные ограничения

- Стек должен оставаться совместимым с технологическими constraints из `docs/system/system-context/expressa-v1-telegram-ordering.md`.
- Новые технологические решения фиксируются здесь до начала реализации, а не по факту в коде.
- Нельзя вводить новый framework, слой хранения данных, инструмент развёртывания или исполняемый контур без обновления этого файла, индекса `application-map.md`, нужных контурных карт и связанных дочерних задач.


