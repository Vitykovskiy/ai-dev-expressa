# QA Standards

## Базовый стандарт

- Каждая последующая `FEATURE-*` должна иметь две `QA-*` задачи: manual lane для ручной проверки собранной feature и e2e lane для e2e-покрытия этой feature.
- Идентификаторы QA-задач сохраняют общий формат `QA-<NNN>`; lane фиксируется в заголовке задачи как `Ручное тестирование ...` или `E2E ...`.
- Существующие `QA-*` карточки не переписываются массово; новый стандарт применяется к новым feature, а также к существующим feature при новой декомпозиции или переоткрытии.
- Feature-level e2e означает browser suite, который проходит пользовательские сценарии через опубликованный frontend и backend.
- Backend endpoint tests, включая HTTP endpoint suites в `backend/test/*`, относятся к integration evidence даже если legacy filename содержит `.e2e.spec.ts`.
- E2e-проверки строятся на основании пользовательских сценариев из `docs/system/use-cases/*`, `docs/system/ui-behavior-mapping/*`, релевантных contracts и профильных QA-карт в `docs/architecture/application-map/*`.
- Unit/integration evidence собирается из соответствующих FE/BE задач и используется QA как входное подтверждение, но не заменяет ручную проверку и e2e.
- Negative paths доступа обязательны для features, связанных с авторизацией и ролями.
- Для любой `FEATURE-*`, меняющей пользовательский интерфейс, manual QA обязан проверить идентичность live-интерфейса с UI-контрактом из `docs/system/ui-contracts/*` и соответствующим `.references` источником.
- Отклонения в структуре экрана, расположении элементов, текстах, визуальных состояниях, spacing, цветах, responsive-поведении или компонентных паттернах считаются дефектами, если они не требуются явно системными артефактами.
- QA фиксирует воспроизводимые дефекты через `BUG-*` задачи под той же `FEATURE-*`, если контур причины ясен.
- Каждая `BUG-*` задача должна иметь явную метку контура причины: `frontend`, `backend` или `devops`; поле `Роль` должно соответствовать этой метке.
- Если контур причины неясен или дефект требует отдельной поставки, QA фиксирует blocker в своей QA-задаче; отдельную `FEATURE-*` создает архитектор, а не QA.

## Разделение QA-задач

- Manual QA-задача покрывает ручной проход пользовательских сценариев, exploratory checks в границах feature, UI parity для UI-фич и defect triage.
- E2e QA-задача покрывает создание или обновление browser e2e-тестов, прогон полного browser suite через документированный route и evidence результата.
- Для `QA-005` финальное acceptance evidence e2e lane собирается локальным containerized route: runner собирает Docker-контейнер со всем приложением, запускает backend, frontend и browser e2e внутри локального Docker runtime и сохраняет pass/fail evidence.
- Backend endpoint integration используется для contract feedback и не закрывает feature-level e2e.
- Feature-level e2e QA закрывается полным browser suite через route, прямо указанный в карточке задачи и профильной QA-карте.
- QA flow для e2e lane: написать или обновить browser tests, выполнить полный suite через документированную команду runner, приложить runner summary и browser report, оформить воспроизводимые defects через `BUG-*`.
- QA владеет browser e2e-сценариями, fixtures, assertions, pass/fail evidence и defect handoff; DevOps владеет только инфраструктурным runner, preflight, env/config, cleanup и диагностикой запуска, если это назначено отдельной DevOps-подзадачей.
- `FEATURE-*` может быть закрыта только после завершения manual QA, e2e QA и закрытия блокирующих `BUG-*` задач.

## Defect handoff

- Frontend-дефект оформляется как `BUG-*` с меткой `frontend`, описанием расхождения, шагами воспроизведения, expected/actual, ссылкой на QA evidence и затронутыми UI/system артефактами.
- Backend-дефект оформляется как `BUG-*` с меткой `backend`, API/contract mismatch, request/response evidence, expected/actual и ссылкой на contract.
- DevOps/runtime-дефект оформляется как `BUG-*` с меткой `devops` только если проблема относится к окружению, deployment, env/config, smoke-check, pipeline path, local container runner, Docker runtime или test runner launch.

## Для FEATURE-001

Подробная карта проверок входа administrator находится в `docs/architecture/application-map/qa-access.md`.

## Для FEATURE-002

Подробная карта проверок управления каталогом меню находится в `docs/architecture/application-map/qa-menu-catalog.md`.

## Acceptance рефакторинга качества кода

- QA принимает code style/code architecture рефакторинг только как поведенчески нейтральное изменение.
- Regression evidence для `FEATURE-006` должно покрывать уже поставленные сценарии `FEATURE-001` и `FEATURE-002`: Telegram/test-mode auth, server-driven actor/capabilities, forbidden screen, role-based navigation, menu catalog CRUD, validation errors и access denial.
- QA не восстанавливает expected behavior из production-кода. Источники истины: `docs/system/contracts/*`, `docs/system/use-cases/*`, `docs/system/ui-behavior-mapping/*` и профильные карты `docs/architecture/application-map/*`.
- Если после рефакторинга фактическое поведение отличается от system contract, результат считается regression defect, даже если новая реализация выглядит архитектурно чище.
- Если system contract неполон и не позволяет однозначно принять поведение, QA фиксирует blocker, а не утверждает новое правило по production-коду.

## Evidence и gates

- QA evidence для `FEATURE-006` должно включать результаты frontend/backend lint, format:check, typecheck, test, build и frontend stylelint либо ссылку на CI run, где эти gates выполнены.
- Regression evidence должно явно перечислять повторно пройденные проверки из `QA-001`, manual-проверки `QA-002`, e2e-проверки `QA-005`, а также любые новые checks, добавленные ради code quality gates.
- Для рефакторинга без изменения поведения достаточно focused regression по затронутым маршрутам и API, если контурные карты подтверждают, что contracts не изменялись.
- Smoke-check не заменяет e2e/integration checks для auth/capability и menu catalog behavior.
- Acceptance запрещён при открытых defects по auth/session bootstrap, capability denial, DTO shape, error mapping, route access или сценариям управления каталогом меню.
