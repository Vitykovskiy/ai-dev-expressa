# Карточка задачи

## Карточка задачи

- Идентификатор: `DO-003`
- Родительская задача: `FEATURE-002`
- Заголовок: `Подготовить запуск e2e QA на test VPS`
- Описание: `Нужно подготовить воспроизводимый инфраструктурный путь запуска feature-level e2e на уже задеплоенном test VPS. DevOps отвечает за скрипты, переменные окружения, секреты, SSH/runtime route и диагностические проверки доступности стенда, но не создает, не адаптирует и не владеет e2e-сценариями QA-005. E2E не должны становиться обязательным PR или deploy gate.`
- Единица поставки: `FEATURE-002`
- Роль: `Девопс`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `не требуются`
- Архитектурные артефакты: `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/qa-standards.md`
- Контурная карта: `docs/architecture/application-map/delivery-and-runtime.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `scripts/deploy-test-vps.sh`, `.github/workflows/`, `package.json`, `backend/package.json`

## Примечания

- Зависимости: `DO-001`, `BE-002`, `FE-002`
- Минимальный read set: `docs/architecture/devops-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `docs/architecture/qa-standards.md`, `scripts/deploy-test-vps.sh`, `package.json`, `backend/package.json`
- Ожидаемый результат для ревью: `В репозитории есть воспроизводимый DevOps-owned путь запуска e2e на test VPS: скрипт или documented command wrapper, список обязательных env/secrets, preflight проверки доступности backend/frontend и инструкция по получению pass/fail артефакта для QA.`
- Проверки: `Dry-run/preflight скрипта без запуска e2e-сценариев; проверка обязательных env/secrets; проверка доступности test VPS backend health и опубликованного backoffice origin; подтверждение, что PR Checks и Deploy Test не запускают e2e как обязательный gate.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/delivery-and-runtime.md, docs/architecture/deployment-map.md и docs/architecture/devops-standards.md, если добавляются e2e run path, env vars, secrets, script или diagnostic checks.`
- Критерии готовности: `Задача завершена, когда QA может запустить свои e2e-сценарии против задеплоенного test VPS по документированной команде, DevOps preflight отделен от QA-сценариев, а e2e не встроены в обязательные PR/deploy gates.`
