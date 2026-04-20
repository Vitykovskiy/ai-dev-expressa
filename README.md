# Expressa

Репозиторий хранит рабочие инструкции, ролевые промпты, шаблоны задач и терминологические правила для подготовки проектных артефактов Expressa.

В текущем состоянии это методический каркас проекта с минимальными backend- и frontend-контурами доступа для `FEATURE-001`. Каталоги `docs/` и `tasks/` создаются и наполняются в рамках рабочих задач, когда появляются бизнес-, системные, архитектурные или реализационные артефакты.

## Старт работы

Перед любой работой в репозитории сначала прочитайте `README.md`. Это обязательное правило продублировано в `AGENTS.md`.

Базовый маршрут:

1. Прочитать `README.md`.
2. Найти или создать карточку задачи по шаблону из `templates/`.
3. Прочитать профильный промпт роли из `prompts/`.
4. Использовать документы из поля `Минимальный read set` в карточке задачи.
5. Обновить навигацию, если структура репозитория или правила работы изменились.

## Текущая структура

В дереве ниже показаны только значимые точки навигации. Служебные конфиги форматирования, линтинга, Git, редактора и lock-файлы намеренно не перечисляются.

```text
.
|-- .github/
|   `-- workflows/
|-- AGENTS.md
|-- README.md
|-- package.json
|-- terms-map.md
|-- backend/
|   |-- .env.example
|   |-- src/
|   |   `-- identity-access/
|   `-- test/
|-- frontend/
|   |-- .env.example
|   |-- index.html
|   `-- src/
|       |-- components/
|       |-- modules/
|       |-- router/
|       `-- views/
|-- docs/
|   |-- architecture/
|   |   |-- README.md
|   |   |-- stack.md
|   |   |-- frontend-architecture.md
|   |   |-- backend-architecture.md
|   |   |-- devops-standards.md
|   |   |-- deployment-map.md
|   |   |-- qa-standards.md
|   |   |-- application-map.md
|   |   `-- application-map/
|   |       |-- frontend-backoffice.md
|   |       |-- backend-access.md
|   |       |-- backend-menu-catalog.md
|   |       |-- delivery-and-runtime.md
|   |       |-- qa-access.md
|   |       `-- qa-menu-catalog.md
|   |-- business/
|   `-- system/
|-- tasks/
|-- prompts/
|   |-- architect/
|   |   `-- prompt.md
|   |-- backend/
|   |   `-- prompt.md
|   |-- business-analyst/
|   |   `-- prompt.md
|   |-- context-collector/
|   |   `-- prompt.md
|   |-- devops/
|   |   `-- prompt.md
|   |-- frontend/
|   |   `-- prompt.md
|   |-- qa/
|   |   `-- prompt.md
|   `-- system-analyst/
|       |-- prompt.md
|       `-- task-tree-rules.md
|-- scripts/
|   `-- deploy-test-vps.sh
`-- templates/
    |-- context-package-template.md
    |-- task-template-instruction.md
    `-- task-template.md
```

## Что где находится

- `AGENTS.md` — обязательная инструкция для агентов: перед анализом, изменением файлов или постановкой задач нужно сначала прочитать `README.md`.
- `README.md` — корневая навигация по репозиторию и общий процессный слой.
- `package.json` — tooling-слой монорепозитория: `npm workspaces`, `husky`, `lint-staged`, `prettier`, `eslint`, `stylelint`, `quality`, `build`, а также корневые команды запуска отдельных контуров.
- `terms-map.md` — карта терминов и рекомендуемых русских аналогов для проектной документации.
- `backend/` — минимальный NestJS-контур идентификации и доступа для `FEATURE-001`: bootstrap главного `administrator`, Telegram/test-mode авторизация, role guard и тесты.
- `frontend/` — клиентский backoffice-контур на `Vue 3`/`Vuetify` для `FEATURE-001`: Telegram entry bootstrap, серверный authenticated actor/capabilities, role-based navigation, forbidden screen и тесты.
- `docs/` — проектные артефакты: бизнес-документы, системные документы и архитектурная навигация.
- `tasks/` — итоговые карточки задач `SPRINT-*`, `FEATURE-*`, `AR-*`, `FE-*`, `BE-*`, `DO-*`, `QA-*`, `BUG-*`, `BA-*`, `SA-*`.
- `prompts/` — ролевые промпты для участников рабочего процесса.
- `templates/` — шаблоны карточек задач и контекстных пакетов.
- `scripts/` — версионируемые утилиты поставки и эксплуатационные shell-скрипты, используемые GitHub Actions и VPS.
- `.github/workflows/` — GitHub Actions для обязательных PR-проверок и автодеплоя `main` в `test`-окружение на VPS.

## Ролевые промпты

- `prompts/business-analyst/prompt.md` — бизнес-аналитик; создает и поддерживает только бизнес-артефакты в `docs/business/`, не подменяя их системным или техническим дизайном.
- `prompts/system-analyst/prompt.md` — системный аналитик; преобразует бизнес-артефакты и утвержденные UI-контракты в системные артефакты в `docs/system/`.
- `prompts/system-analyst/task-tree-rules.md` — правила дерева задач вокруг `SPRINT-*`, `FEATURE-*` и дочерних задач.
- `prompts/architect/prompt.md` — архитектор; поддерживает `docs/architecture/`, фиксирует контуры реализации и декомпозирует работу без написания производственного кода.
- `prompts/frontend/prompt.md` — фронтенд; выполняет только назначенную `FE-*` задачу в клиентском контуре и не переопределяет архитектуру локально.
- `prompts/backend/prompt.md` — бэкенд; выполняет только назначенную `BE-*` задачу в серверном контуре и соблюдает архитектурные границы.
- `prompts/devops/prompt.md` — девопс; отвечает за VPS-окружения, GitHub Actions, развёртывание, переменные окружения, секреты, дымовые проверки и восстановление.
- `prompts/qa/prompt.md` — тестирование; работает в manual или e2e lane, проверяет пользовательские сценарии, поддерживает e2e-покрытие, проверяет UI parity для UI-фич и фиксирует воспроизводимые дефекты.
- `prompts/context-collector/prompt.md` — сборщик контекста; готовит самостоятельный контекстный пакет подзадачи и не выполняет исходную задачу.

## Шаблоны

- `templates/task-template.md` — форма карточки задачи.
- `templates/task-template-instruction.md` — инструкция по заполнению карточки, допустимые роли, статусы, приоритеты и правила ссылок.
- `templates/context-package-template.md` — форма контекстного пакета подзадачи для передачи исполнителю.

## Рабочие каталоги

Эти каталоги могут отсутствовать в свежем или очищенном состоянии репозитория. Их создают профильные роли только при наличии соответствующей задачи.

- `docs/business/` — бизнес-артефакты: vision, glossary, business-rules, scenarios.
- `docs/system/` — системные артефакты: system-context, domain-model, use-cases, contracts, state-models, ui-behavior-mapping.
- `docs/architecture/` — архитектурные артефакты: карта архитектурной навигации, стек, карты приложения, стандарты клиентской части, серверной части, тестирования и DevOps, карта развёртывания.
- `tasks/` — итоговые карточки задач `SPRINT-*`, `FEATURE-*`, `AR-*`, `FE-*`, `BE-*`, `DO-*`, `QA-*`, `BUG-*`, `BA-*`, `SA-*`.
- `.references/` — локальные визуальные или входные референсы; каталог исключен из Git через `.gitignore`.

## Tooling

- Перед локальной работой выполните `npm install` в корне репозитория. Это устанавливает root tooling, зависимости `backend/frontend` через `npm workspaces` и подготавливает `husky` hook через `prepare`.
- Корневой pre-commit hook запускает `lint-staged`: `prettier` для staged text-файлов, `eslint` для staged backend/frontend TypeScript/Vue и `stylelint` для staged frontend style-файлов и Vue style blocks.
- Backend из корня запускается через `npm run dev:backend`.
- Frontend из корня запускается через `npm run dev:frontend`.
- Для локальной проверки backoffice нужны `backend/.env.local` для backend и `frontend/.env.local` для frontend.

## Backend

- Контур находится в `backend/`.
- Установка зависимостей: `npm install` в корне репозитория.
- Lint: `npm run lint`.
- Format: `npm run format`.
- Format check: `npm run format:check`.
- Сборка: `npm run build`.
- Typecheck: `npm run typecheck`.
- Тесты: `npm test`.
- Dev из корня: `npm run dev:backend`.
- Dev из каталога контура: `npm run start:dev`.
- Локальный `backend/.env.local`: `NODE_ENV=test`, `PORT=3000`, `ADMIN_TELEGRAM_ID=123456789`, `DISABLE_TG_AUTH=true`, `BACKOFFICE_CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173`.
- Запуск: `ADMIN_TELEGRAM_ID=<id> SERVICE_TELEGRAM_BOT_TOKEN=<token> NODE_ENV=production npm start` после сборки.
- Test-mode запуск без Telegram допустим только с `NODE_ENV=test DISABLE_TG_AUTH=true ADMIN_TELEGRAM_ID=<id>`.

## Frontend

- Контур находится в `frontend/`.
- Установка зависимостей: `npm install` в корне репозитория.
- Dev server из корня: `npm run dev:frontend`.
- Dev server из каталога контура: `npm run dev`.
- Lint: `npm run lint`.
- Stylelint: `npm run stylelint`.
- Format: `npm run format`.
- Format check: `npm run format:check`.
- Сборка: `npm run build`.
- Typecheck: `npm run typecheck`.
- Тесты: `npm test`.
- Локальная интеграция с backend по умолчанию использует Vite proxy на `http://localhost:3000` для `/backoffice`.
- Локальный `frontend/.env.local`: `VITE_BACKOFFICE_API_BASE_URL=http://127.0.0.1:3000`, `VITE_BACKOFFICE_TEST_TELEGRAM_ID=123456789`.
- Дополнительные переменные: `VITE_BACKOFFICE_API_BASE_URL=<url>` для явного base URL backend API, `VITE_BACKOFFICE_TEST_TELEGRAM_ID=<id>` только для серверно разрешённого test-mode.

## Работа с задачами

- Новые задачи оформляются по `templates/task-template.md` с учетом `templates/task-template-instruction.md`.
- `SPRINT-*` — координационная карточка спринта. Она не является единицей поставки.
- `FEATURE-*` — карточка одной завершенной, тестируемой и демонстрируемой фичи. Именно `FEATURE-*` является единицей поставки.
- Системный аналитик по умолчанию создает или обновляет только родительскую `SPRINT-*` карточку.
- Архитектор сначала декомпозирует один `SPRINT-*` в набор `FEATURE-*`, затем одну выбранную `FEATURE-*` в дочерние `AR/FE/BE/DO/QA-*` задачи.
- Для каждой последующей фичи обязательны две QA-задачи: manual QA для ручного тестирования, пользовательских сценариев, UI parity и дефектов; e2e QA для создания, поддержки и прогона e2e-проверок этой фичи.
- Воспроизводимые дефекты оформляются как `BUG-*` задачи под той же `FEATURE-*` с явной меткой контура причины: `frontend`, `backend` или `devops`.
- `DO-*` создается только если фича меняет VPS-окружение, `test` или `production` развёртывание, GitHub Actions, переменные окружения, секреты, дымовые проверки или порядок восстановления.

## Подготовка контекста

Перед реализацией карточки из `tasks/` используется контекстный маршрут:

1. Основной агент читает исходную карточку, ссылки из нее и обязательный `Минимальный read set`.
2. Основной агент формирует общий план `<TASK-ID>-execution-plan.md` в корне проекта, если задача требует декомпозиции.
3. Для независимых подзадач создаются контекстные пакеты `<TASK-ID>-context-<NN>-<slug>.md` по `templates/context-package-template.md`.
4. Если среда поддерживает субагентов, подготовку контекста можно делегировать сборщикам контекста.
5. Исполнитель подзадачи работает только в границах read set, разрешенной зоны правок и проверок, указанных в контекстном пакете.

Контекстный пакет должен содержать цель, поведенческий промпт исполнителя, обязательный read set, ключевые факты, разрешенные и запрещенные зоны правок, зависимости, ожидаемый результат, проверки, критерии готовности, риски и открытые вопросы.

## Общие правила

- При подготовке и обновлении русскоязычной проектной документации используйте `terms-map.md`, если для термина задана рекомендуемая замена.
- Ролевые промпты не должны дублировать общий навигационный и процессный слой из `README.md`.
- Если создаются или переименовываются рабочие каталоги, документы, шаблоны или ролевые инструкции, обновляйте `README.md` в той же задаче.
- При создании коммитов используйте Conventional Commits.
- Если обязательный для задачи документ отсутствует, профильная роль должна зафиксировать блокер или создать минимально необходимый артефакт только в разрешенной зоне ответственности.

## Файловая политика

- Текстовые файлы репозитория хранятся в `UTF-8` без BOM и с окончанием строк `LF`.
- `.gitattributes` и `.editorconfig` являются источниками правил для Git, редакторов и агентов.
- В Windows PowerShell 5.1 русскоязычные UTF-8 файлы читайте через `Get-Content -Raw -Encoding UTF8 <file>` или используйте PowerShell 7+, иначе терминал может показать mojibake.

## Выбор задачи

- В работу берутся только задачи со статусом `Готова к работе`.
- Среди задач со статусом `Готова к работе` первой выбирается задача с наивысшим приоритетом.
- Шкала приоритетов задается в `templates/task-template-instruction.md`: `Критический`, `Высокий`, `Средний`, `Низкий`.

## Быстрая навигация

- Роль исполнителя: `prompts/<role>/prompt.md`.
- Правила дерева задач: `prompts/system-analyst/task-tree-rules.md`.
- Шаблон задачи: `templates/task-template.md`.
- Инструкция к шаблону задачи: `templates/task-template-instruction.md`.
- Шаблон контекстного пакета: `templates/context-package-template.md`.
- Карта терминов: `terms-map.md`.
