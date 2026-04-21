# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-007`
- Родительская задача: `нет`
- Заголовок: `Перенести quality tooling внутрь backend и frontend контуров`
- Описание: `Нужно убрать ESLint, Prettier и Stylelint tooling-зависимости из root package.json и закрепить их в package.json соответствующих контуров. Backend и frontend должны устанавливаться автономно через свои package-lock.json. Root package.json должен остаться только репозиторным orchestration-слоем для Husky, lint-staged и aggregate-команд. Проверки должны запускаться внутри backend/frontend контуров, а CI и pre-commit должны делегировать выполнение в эти контуры.`
- Единица поставки: `n/a`
- Роль: `Девопс`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `не требуются`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/devops-standards.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `package.json`, `package-lock.json`, `backend/package.json`, `backend/package-lock.json`, `frontend/package.json`, `frontend/package-lock.json`, `.lintstagedrc.mjs`, `.github/workflows/pr-checks.yml`, `README.md`

## Примечания

- Зависимости: `нет`
- Минимальный read set: `README.md`, `docs/architecture/stack.md`, `docs/architecture/devops-standards.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`
- Ожидаемый результат для ревью: `Root package.json содержит только Husky, lint-staged и orchestration scripts; backend/frontend package.json содержат собственные lint/format/stylelint tooling-зависимости; backend/frontend package-lock.json позволяют выполнить npm ci внутри каждого контура; CI устанавливает и проверяет контуры отдельно; lint-staged делегирует форматирование и линтинг в локальные binaries backend/frontend.`
- Проверки: `npm ci в root; npm ci --prefix backend; npm ci --prefix frontend; npm run lint:backend; npm run format:check:backend; npm run typecheck:backend; npm run test:backend; npm run build:backend; npm run lint:frontend; npm run stylelint:frontend; npm run format:check:frontend; npm run typecheck:frontend; npm run test:frontend; npm run build:frontend; npm run build; npm run lint-staged на staged backend/frontend/root text files.`
- Обновление карты приложения: `Обязательно обновить docs/architecture/application-map/delivery-and-runtime.md и docs/architecture/devops-standards.md. Обновить README.md, если меняется маршрут установки, root tooling или команды локальной работы.`
- Критерии готовности: `Задача завершена, когда backend и frontend устанавливаются и проверяются автономно, root не владеет ESLint/Prettier/Stylelint зависимостями, pre-commit и CI воспроизводимо используют контурные проверки, а документация отражает новую модель.`
