# Карточка задачи

## Карточка задачи

- Идентификатор: `FE-009`
- Родительская задача: `FEATURE-001`
- Заголовок: `Исправление browser-only bootstrap в test-окружении VPS при относительном API base URL`
- Описание: `Нужно устранить дефект клиентской части во внутреннем административном контуре, из-за которого опубликованное test-окружение VPS не может выполнить browser-only bootstrap без Telegram. При текущей сборке клиент использует build-time значение VITE_API_BASE_URL=/api и одновременно сам добавляет префикс /api к маршрутам доступа, из-за чего браузер обращается к /api/api/backoffice/access/bootstrap и получает 404. Нужно привести формирование URL в apps/backoffice-web к одному источнику истины, сохранить рабочий локальный маршрут и маршрут на VPS, не ломая существующие HTTP-контракты FEATURE-001 и FEATURE-002.`
- Единица поставки: `FEATURE-001`
- Роль: `Фронтенд`
- Изменяемый контур: `frontend`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/contracts/user-role-and-blocking-management.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/frontend-architecture.md`, `docs/architecture/deployment-map.md`, `docs/architecture/qa-standards.md`
- Контурная карта: `docs/architecture/application-map/backoffice-web.md`, `docs/architecture/application-map/quality-and-delivery.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `tasks/QA-001-feature-001-administrator-telegram-entry-e2e.md`, `tasks/QA-002-feature-002-menu-catalog-management-e2e.md`, `tasks/QA-003-vps-test-environment-e2e-execution-and-defects.md`

## Примечания

- Зависимости: `FE-002`, `FE-003`, `QA-003`
- Минимальный read set: `docs/architecture/frontend-architecture.md`, `docs/architecture/deployment-map.md`, `docs/architecture/qa-standards.md`, `docs/architecture/application-map/backoffice-web.md`, `docs/architecture/application-map/quality-and-delivery.md`, `tasks/QA-003-vps-test-environment-e2e-execution-and-defects.md`
- Ожидаемый результат для ревью: `Клиентская часть формирует корректный URL bootstrap и восстановления доступа как локально, так и в опубликованном test-окружении VPS; browser-only вход без Telegram снова открывает внутренний административный контур, а e2e FEATURE-001 и FEATURE-002 проходят против внешнего test-окружения.`
- Проверки: `npm run test --workspace @expressa/backoffice-web`; `npm run test:e2e`; `E2E_BASE_URL=<BACKOFFICE_PUBLIC_URL> E2E_ACCESS_MODE=test npm run test:e2e`; ручная проверка того, что браузер обращается к /api/backoffice/access/bootstrap без двойного префикса /api/api`
- Обновление карты приложения: `Не требуется, если исправление не меняет фактический маршрут запуска или структуру контуров; при изменении описания HTTP-маршрута обновить docs/architecture/application-map/backoffice-web.md и docs/architecture/deployment-map.md`
- Критерии готовности: `Задача завершена, когда published test-окружение VPS выполняет browser-only bootstrap без Telegram, клиентская часть не собирает путь /api/api/backoffice/access/bootstrap, а внешние e2e FEATURE-001 и FEATURE-002 подтверждают исправление.`
