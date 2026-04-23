# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-009`
- Родительская задача: `FEATURE-003`
- Заголовок: `Опубликовать backend base URL для slot settings e2e`
- Описание: `Система должна давать QA-owned browser e2e suite для FEATURE-003 корректный доступ к backend API через published e2e frontend origin, чтобы сценарий FTS-003-006 проверял /customer/slots без skip. Published test-e2e стенд открывает frontend origin и проксирует /backoffice/* и /customer/* для Playwright-запросов.`
- Единица поставки: `FEATURE-003`
- Роль: `Девопс`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`
- Архитектурные артефакты: `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/qa-slot-settings.md`, `docs/architecture/application-map/backend-slot-settings.md`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/qa-slot-settings.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `tasks/QA-007-e2e-administrator-slot-settings-management.md`, `frontend/nginx.conf`

## Примечания

- Зависимости: `QA-007`
- Минимальный read set: `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/application-map/qa-slot-settings.md`, `docs/architecture/application-map/backend-slot-settings.md`, `tasks/QA-007-e2e-administrator-slot-settings-management.md`
- Env contract: `Корневой .env должен предоставлять параметры подключения к серверу: IP, ROOT_USER, ROOT_PASSWORD.`
- Ожидаемый результат для ревью: `Published e2e frontend origin предоставляет documented route для GET /customer/slots через /customer/* proxy; deploy smoke-check валидирует published proxy JSON routes; сценарий FTS-003-006 перестаёт skip-аться в Playwright evidence после следующего rollout.`
- Проверки: `bash -n scripts/deploy-test-vps.sh; npm run test:e2e -- slot-settings показывает FTS-003-006 как passed после rollout; QA-007 coverage evidence обновляется после успешного прогона.`
- Обновление карты приложения: `Обязательно обновить docs/architecture/deployment-map.md и docs/architecture/application-map/delivery-and-runtime.md, если меняется published e2e frontend origin, env vars, proxy path или опубликованный backend/API endpoint.`
- Критерии готовности: `Задача завершена, когда QA может запустить slot-settings e2e против published e2e stand без ручного угадывания backend URL, FTS-003-006 выполняется без skip, а route и env contract задокументированы.`

## Safety Constraints

- Значения `ROOT_PASSWORD` хранятся в локальном окружении исполнителя или в секретном хранилище.

## Результат выполнения

- Published `test-e2e` frontend origin публикует documented proxy route для `GET /customer/slots`.
- Post-fix verification: `npm run test:e2e -- slot-settings` завершился с результатом `5 passed`, включая `FTS-003-006`.
- Route verification: `curl -i https://expressa-e2e-test.vitykovskiy.ru/customer/slots` возвращает `HTTP/1.1 200 OK` и `Content-Type: application/json; charset=utf-8`.
- QA-007 разблокирована и закрыта после успешного acceptance-прогона.
