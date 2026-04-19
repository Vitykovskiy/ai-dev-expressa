# Application Map

## Назначение

Индекс контурных карт Expressa v1. Для реализации feature-задач исполнитель выбирает карту по изменяемому контуру из карточки.

## Карты

| Карта | Когда читать | Ответственность |
|---|---|---|
| `application-map/frontend-backoffice.md` | `FE-*` задачи внутреннего административного контура | Backoffice routes, Telegram entry, role-based navigation, forbidden screen. |
| `application-map/backend-access.md` | `BE-*` задачи идентификации, bootstrap administrator, Telegram/test auth, role guard | Server-side access boundary. |
| `application-map/delivery-and-runtime.md` | `DO-*` задачи env/config, запуска, deployment и smoke-check | Runtime configuration and deployment safety. |
| `application-map/qa-access.md` | `QA-*` задачи проверки входа и guards | E2e, integration and acceptance checks. |

## Маршрут выбора

- Если меняются backoffice маршруты, guard UI, вкладки или клиентская интеграция Telegram Web App, использовать `frontend-backoffice.md`.
- Если меняются `ADMIN_TELEGRAM_ID`, Telegram init data validation, test-mode auth или role guard на сервере, использовать `backend-access.md`.
- Если меняются env vars, режимы окружений, smoke-check или pipeline/deployment path, использовать `delivery-and-runtime.md`.
- Если добавляются или меняются проверки feature-доступа, использовать `qa-access.md`.
