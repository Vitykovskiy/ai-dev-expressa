# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-002`
- Родительская задача: `FEATURE-006`
- Заголовок: `Ввести tooling, hooks и CI quality gates для code style`
- Описание: `Нужно сделать архитектурный стандарт исполнимым через ESLint, Prettier, Stylelint, Husky, lint-staged и GitHub Actions. PR должен блокироваться без успешных lint, format:check, stylelint для frontend, typecheck, test и build для релевантных контуров. Локальный pre-commit hook должен проверять измененные файлы через lint-staged.`
- Единица поставки: `FEATURE-006`
- Роль: `Девопс`
- Приоритет: `Высокий`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `не требуются`
- Архитектурные артефакты: `docs/architecture/stack.md`, `docs/architecture/devops-standards.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.github/workflows/`, `frontend/package.json`, `backend/package.json`

## Примечания

- Зависимости: `AR-004`
- Минимальный read set: `docs/architecture/stack.md`, `docs/architecture/devops-standards.md`, `docs/architecture/frontend-architecture.md`, `docs/architecture/backend-architecture.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/backend-menu-catalog.md`
- Ожидаемый результат для ревью: `В frontend/backend есть npm scripts lint, format, format:check; во frontend дополнительно stylelint; Husky и lint-staged настроены для pre-commit; GitHub Actions выполняет обязательные quality gates и блокирует PR при ошибках.`
- Проверки: `npm run lint, npm run format:check, npm run stylelint, npm run typecheck, npm test и npm run build в frontend где применимо; npm run lint, npm run format:check, npm run typecheck, npm test и npm run build в backend где применимо; локальная проверка lint-staged на измененных файлах; dry-run или лог GitHub Actions workflow.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/delivery-and-runtime.md и docs/architecture/devops-standards.md, если меняются CI jobs, локальные hooks, npm scripts или порядок PR gates.`
- Критерии готовности: `Задача завершена, когда quality gates воспроизводимо запускаются локально и в CI, а merge без прохождения обязательных проверок невозможен.`
