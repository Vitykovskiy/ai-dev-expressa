# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-002`
- Родительская задача: `нет`
- Заголовок: `Единый маршрут развёртывания и non-e2e допуск к развёртыванию`
- Описание: `Нужно зафиксировать единый generic-маршрут развёртывания на уже переименованных артефактах .github/workflows/deploy.yml, infra/scripts/deploy.sh и infra/docker/compose.yml, перевести проверку контейнерного маршрута на команду npm run deploy:config, оставить ci.yml только для pull_request и только с неручными проверками без e2e, настроить deploy.yml на автоматическое развёртывание test-окружения VPS по push в main с DISABLE_TG_AUTH=true для ручной проверки через браузер без Telegram-авторизации и сохранить выпуск production только через workflow_dispatch, обновить README.md, профильные архитектурные документы и prompt роли DevOps, явно зафиксировать, что e2e не входят в зону ответственности DevOps, а также проверить и обновить обязательные статусы GitHub после переименования workflow и job. Карточка является одноразовым исключением из правила об обязательной родительской FEATURE-* задаче и не меняет глобальные правила дерева задач.`
- Единица поставки: `n/a`
- Роль: `Девопс`
- Изменяемый контур: `devops`
- Приоритет: `Высокий`
- Статус: `Выполнена`

## Ссылки на документы

- Системные артефакты: `не требуются`
- Архитектурные артефакты: `docs/architecture/devops-standards.md`, `docs/architecture/qa-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/quality-and-delivery.md`
- Контурная карта: `docs/architecture/application-map/quality-and-delivery.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `README.md`, `prompts/devops/prompt.md`, `prompts/qa/prompt.md`

## Примечания

- Зависимости: `нет`
- Минимальный read set: `docs/architecture/devops-standards.md`, `docs/architecture/qa-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/quality-and-delivery.md`, `README.md`, `prompts/devops/prompt.md`, `prompts/qa/prompt.md`
- Ожидаемый результат для ревью: `В репозитории описан и реализован единый generic-маршрут развёртывания: ci.yml работает только на pull_request и запускает только модульные тесты, сборку, npm run deploy:config и локальные дымовые проверки без e2e; deploy.yml автоматически разворачивает test-окружение VPS по push в main с DISABLE_TG_AUTH=true и оставляет production только для ручного workflow_dispatch; infra/scripts/deploy.sh и infra/docker/compose.yml используются как единые артефакты маршрута; feature-специфичная дымовая проверка запускается из generic-маршрута; README.md, профильные документы и prompt роли DevOps согласованы с новой схемой ответственности; обязательные статусы GitHub обновлены под новые имена workflow и job.`
- Проверки: `Pipeline-validation для ci.yml и deploy.yml; запуск модульных тестов apps/server и apps/backoffice-web; сборка серверной и клиентской частей; валидация контейнерного маршрута через npm run deploy:config; локальные дымовые проверки рабочего и test-режима; проверка автоматического развёртывания test-окружения из push в main через deploy.yml и ручного выпуска production через workflow_dispatch без e2e; подтверждение обновления обязательных статусов GitHub после переименования workflow и job.`
- Обновление карты приложения: `Обязательно: docs/architecture/application-map/quality-and-delivery.md, docs/architecture/deployment-map.md, README.md при необходимости`
- Критерии готовности: `Задача завершена, когда DevOps может воспроизводимо провести изменение через generic-маршрут развёртывания без e2e, использовать ci.yml только для pull_request, автоматически получать актуальное test-окружение на VPS через deploy.yml после push в main, вручную выпускать production через workflow_dispatch, передать e2e в зону ответственности QA и не иметь расхождений между workflow, обязательными статусами GitHub и документацией.`
- Исключение из дерева задач: `Карточка создана как одноразовое исключение без родительской FEATURE-* задачи для адаптации конвейера и развёртывания; исключение действует только для DO-002 и не меняет глобальные правила дерева задач.`
