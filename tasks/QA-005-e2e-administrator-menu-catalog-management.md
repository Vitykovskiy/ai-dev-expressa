# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-005`
- Родительская задача: `FEATURE-002`
- Заголовок: `E2E управление каталогом меню administrator`
- Описание: `Нужно создать или обновить e2e-покрытие FEATURE-002 на основании пользовательских сценариев управления каталогом меню: administrator создает категории, товары, размерную модель напитков S/M/L, группы дополнительных опций, опции и назначает группы на категории; пользователь без capability menu не может выполнить сценарий.`
- Единица поставки: `FEATURE-002`
- Роль: `Тестирование`
- Приоритет: `Критический`
- Статус: `В тестировании`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/qa-standards.md`, `docs/architecture/deployment-map.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`
- Контурная карта: `docs/architecture/application-map/qa-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `backend/test/menu-catalog.e2e.spec.ts`

## Примечания

- Зависимости: `BE-002`, `FE-002`, `DO-003`
- Минимальный read set: `docs/architecture/qa-standards.md`, `docs/architecture/deployment-map.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`, `docs/architecture/application-map/delivery-and-runtime.md`, `backend/test/menu-catalog.e2e.spec.ts`
- Ожидаемый результат для ревью: `Есть e2e evidence по FEATURE-002: сценарий administrator manages menu catalog покрывает создание категории, товара-напитка с ценами S/M/L, группы дополнительных опций, опций и назначения группы на категорию; negative checks покрывают неполную размерную модель, неверное правило группы опций и доступ без capability menu.`
- Проверки: `E2E-сценарии: administrator открывает контур управления меню; создает категорию; создает товар-напиток с полным набором цен S/M/L; получает отказ для неполной размерной модели; создает группу дополнительных опций с корректным правилом выбора; получает отказ для неверного правила группы опций; создает платные и бесплатные опции; назначает группу на категорию; пользователь без capability menu получает отказ. Финальный acceptance-прогон выполняется на задеплоенном test VPS route после успешного main -> test deploy и smoke-check по DevOps-owned команде или скрипту из DO-003. Локальная команда npm run test --workspace @expressa/backend -- menu-catalog.e2e.spec.ts допустима только для разработки и debug сценариев, но не закрывает e2e QA без deployed test VPS evidence. Результат: зафиксирован pass/fail прогон на test VPS и ссылки на созданные BUG-задачи с метками frontend/backend/devops при воспроизводимых defects.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-menu-catalog.md, если меняются e2e сценарии каталога, fixtures, contract mocks, test route или acceptance path.`
- Критерии готовности: `E2E QA-задача завершена, когда e2e-покрытие FEATURE-002 актуально, финальная команда запуска на test VPS воспроизводима, последний deployed прогон зафиксирован, а все найденные blocking defects оформлены через BUG-задачи с метками контура причины или явно отсутствуют.`

## QA evidence

- Локальный contract/debug e2e: `passed` — `npm run test --workspace @expressa/backend -- menu-catalog.e2e.spec.ts`; 4 теста passed.
- Локальная проверка QA-owned VPS spec против HTTP backend: `passed` — `npm run test:e2e:menu-catalog:vps --workspace @expressa/backend`; 3 теста passed, 2 skipped без deployed `E2E_NON_MENU_TELEGRAM_ID`.
- Deployed `test` VPS e2e команда: `TEST_E2E_COMMAND="npm run test:e2e:menu-catalog:vps --workspace @expressa/backend" npm run test:vps:e2e`.
- Для полного deployed negative check `backoffice-capability-forbidden` требуется `E2E_NON_MENU_TELEGRAM_ID` — Telegram id заранее заведённого пользователя без capability `menu` на `test` стенде.
- Deploy Test после merge PR #67: `passed` — GitHub Actions run `24692166511`, stand commit `147eeca345c401f40d82e76bd735025c0ff4c627`.
- Deployed `test` VPS e2e: `failed before QA-owned e2e command` — GitHub Actions run `24692194679`.
- Диагностический Test VPS E2E preflight: `failed` — GitHub Actions run `24692219066`; backend health `200`, test-mode API probe `/backoffice/orders` `200`, published backoffice origin `HTTP 000`.
- Blocking defect `BUG-003` с меткой контура причины `devops`: `Выполнена`; после исправления `Test VPS E2E` mode `preflight` прошёл, GitHub Actions run `24693649262`, stand commit `e12d1580f197e35f9d66cf4f0547aa2a92d82955`, backend health `200`, test-mode API probe `/backoffice/orders` `200`, published backoffice origin `200`.
- Deployed `test` VPS e2e после закрытия `BUG-003`: `failed before wrapper logs` — GitHub Actions run `24707861478`, command `npm run test:e2e:menu-catalog:vps --workspace @expressa/backend`; job завершился `Process exited with status 1` до вывода `Test VPS e2e route started`.
- Blocking defect: `BUG-004` с меткой контура причины `devops`; QA-005 остаётся открытой до исправления Test VPS E2E run-mode и повторного deployed e2e run.
