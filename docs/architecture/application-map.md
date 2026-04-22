# Application Map

## Назначение

Индекс контурных карт Expressa v1. Для реализации feature-задач исполнитель выбирает карту по полю `Контурная карта` и типу задачи.

## Карты

| Карта                                      | Когда читать                                                                                | Ответственность                                                                     |
| ------------------------------------------ | ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `application-map/frontend-backoffice.md`   | `FE-*` задачи внутреннего административного контура                                         | Backoffice routes, Telegram entry, role-based navigation, forbidden screen.         |
| `application-map/backend-access.md`        | `BE-*` задачи идентификации, bootstrap administrator, Telegram/test auth, role guard        | Server-side access boundary.                                                        |
| `application-map/backend-menu-catalog.md`  | `BE-*` задачи управления каталогом меню                                                     | Server-side menu catalog boundary, endpoints, DTO and domain validations.           |
| `application-map/backend-slot-settings.md` | `BE-*` задачи управления рабочими часами, вместимостью слотов и генерацией доступных слотов | Server-side slot settings boundary, settings persistence and slot generation rules. |
| `application-map/delivery-and-runtime.md`  | `DO-*` задачи env/config, запуска, deployment и smoke-check                                 | Runtime configuration and deployment safety.                                        |
| `application-map/qa-access.md`             | `QA-*` задачи проверки входа и guards                                                       | E2e, integration and acceptance checks.                                             |
| `application-map/qa-menu-catalog.md`       | `QA-*` задачи проверки управления каталогом меню                                            | E2e, integration and acceptance checks for menu catalog.                            |
| `application-map/qa-slot-settings.md`      | `QA-*` задачи проверки управления настройками слотов                                        | Manual, integration and e2e checks for slot settings and slot generation.           |

## Маршрут выбора

- Если меняются backoffice маршруты, guard UI, вкладки или клиентская интеграция Telegram Web App, использовать `frontend-backoffice.md`.
- Если меняются `ADMIN_TELEGRAM_ID`, Telegram init data validation, test-mode auth или role guard на сервере, использовать `backend-access.md`.
- Если меняются серверные endpoints, DTO, хранение или доменные проверки каталога меню, использовать `backend-menu-catalog.md`.
- Если меняются серверные endpoints, DTO, хранение настроек, правила генерации слотов или применение вместимости к слоту выдачи, использовать `backend-slot-settings.md`.
- Если меняются env vars, режимы окружений, smoke-check или pipeline/deployment path, использовать `delivery-and-runtime.md`.
- Если добавляются или меняются проверки feature-доступа, использовать `qa-access.md`.
- Если добавляются или меняются проверки управления каталогом меню, использовать `qa-menu-catalog.md`.
- Если добавляются или меняются manual/e2e проверки управления рабочими часами, вместимостью слотов и влияния сохранённых настроек на генерацию слотов, использовать `qa-slot-settings.md`.
- Если меняются code style, code architecture style, локальные hooks, CI quality gates или acceptance рефакторинга без изменения поведения, сначала читать профильный стандарт `frontend-architecture.md`, `backend-architecture.md`, `devops-standards.md` или `qa-standards.md`, затем соответствующую контурную карту из таблицы выше.
