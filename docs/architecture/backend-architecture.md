# Backend Architecture

## Базовый стандарт

- Серверная часть Expressa v1 реализуется на `NestJS`.
- Контур идентификации и доступа должен быть отделён от доменных контуров меню, слотов, заказов и уведомлений.
- Backend является источником истины по пользователю, Telegram identity, ролям и доступу к backoffice capabilities.
- Для server-side infrastructure, module wiring, config, validation, guards и persistence integration используется нативный путь `NestJS`, если он покрывает задачу без нарушения project constraints.
- Перед выбором нового backend package исполнитель читает релевантные разделы official docs из `docs/architecture/stack.md` и проверяет, не перекрывает ли этот сценарий встроенный `NestJS`-механизм или уже принятая project-specific библиотека.

## Для FEATURE-001

Подробная карта bootstrap administrator, Telegram/test-mode authorization и role guard находится в `docs/architecture/application-map/backend-access.md`.

## Для FEATURE-002

Подробная карта server-side boundary управления каталогом меню находится в `docs/architecture/application-map/backend-menu-catalog.md`. Контур каталога использует access guard из `backend-access.md`, но не смешивается с identity/access модулем.

## Для FEATURE-003

Подробная карта server-side boundary управления рабочими часами, вместимостью слотов и генерацией доступных слотов находится в `docs/architecture/application-map/backend-slot-settings.md`. Контур настроек слотов использует access guard из `backend-access.md`, но не смешивается с identity/access модулем, обработкой заказов или каталогом меню.

## Стандарт NestJS boundaries

- `module.ts` фиксирует границу NestJS-контура и подключает controller/provider/repository зависимости только своего контура или явно разрешённые внешние guards/adapters.
- `controller.ts` является HTTP boundary: route decorators, request DTO/body/params, capability guard attachment и transport-level response mapping. Controller не содержит доменную валидацию, storage logic или orchestration нескольких доменных операций.
- `service.ts` отвечает за application orchestration: вызывает domain validation, repository и внешние adapters внутри своего контура. Service не должен знать детали HTTP headers, Telegram init data parsing или frontend route behavior.
- `domain/*.types.ts`, `domain/*.validator.ts` и `domain/*.errors.ts` содержат доменные типы, инварианты и канонические ошибки. Доменные правила нельзя восстанавливать из controller tests или UI-кода.
- `repository/*` является слоем хранения данных. In-memory repository допустим как текущий adapter, но он не должен становиться местом доменной валидации или auth checks.
- Persistence integration должна сначала опираться на нативные NestJS-механизмы composition, configuration и lifecycle; дополнительный database client, ORM или SQL toolkit подключается только по явно зафиксированному architecture decision.
- Access boundary (`identity-access`) является источником истины по actor, roles, blocked state, Telegram/test-mode auth и capabilities. Доменные модули меню, слотов, заказов и уведомлений используют guard/capability contract, но не реализуют собственную модель identity.
- Static backoffice endpoints без `:capability` обязаны использовать metadata decorator с канонической capability, например `menu`, и общий `BackofficeAuthGuard`.
- Целевой размер: controller до 250 строк, service до 300 строк, validator до 250 строк, repository adapter до 250 строк. Превышение требует декомпозиции или явного обоснования в ревью.

## Backend quality gates

- Обязательные проверки для серверного контура: `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run build`.
- Рефакторинг backend для `FEATURE-006` не должен менять endpoint boundary, DTO shape, auth headers/body, capability semantics, status codes или error mapping, зафиксированные в `docs/system/contracts/*`.
- Если текущий код нарушает boundary, исправление выполняется поведенчески нейтрально: сначала сохраняются tests/contract evidence, затем responsibility переносится в controller/service/domain/repository слой.
- Любое обнаруженное расхождение между production-кодом и системным contract является blocker для локального рефакторинга. Исполнитель не выбирает новое поведение самостоятельно.
