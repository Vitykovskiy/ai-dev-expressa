# QA Slot Settings Application Map

## Граница

Проверки `FEATURE-003`: administrator управляет рабочими часами и вместимостью слотов, а сохранённые настройки влияют на дальнейшую генерацию доступных customer-слотов текущего дня.

## Обязательные уровни проверок

| Уровень                  | Что проверять                                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Unit                     | Доменные инварианты рабочих часов, вместимости слота, дефолтных значений и 10-минутной генерации слотов.                                                                             |
| Integration              | Backend contract `Manage working hours and slot capacity`, guard `administrator`, negative checks для `invalid-working-hours` и `invalid-slot-capacity`, влияние на slot generation. |
| Frontend component/route | Экран `/settings`, form state, success/error feedback и mapping validation ошибок через contract/mock adapter.                                                                       |
| UI parity                | Desktop/mobile сравнение вкладки `Настройки` с `docs/system/ui-contracts/expressa-backoffice-ui-contract.md` и `.references/Expressa_admin/src/app/screens/SettingsScreen.tsx`.      |
| E2E                      | Browser suite через backoffice внутри локального containerized runtime: administrator сохраняет настройки и затем подтверждает влияние на получение доступных слотов.                |
| Smoke                    | Сборка и запуск затронутых backend/frontend контуров без изменения delivery/runtime path.                                                                                            |

## Acceptance scenarios

- `FTS-003-001`: administrator успешно сохраняет рабочие часы и вместимость слота.
- `FTS-003-002`: administrator сохраняет только один изменённый параметр без потери второго действующего значения.
- `FTS-003-003`: система отклоняет некорректный диапазон рабочих часов и сохраняет форму в редактируемом состоянии.
- `FTS-003-004`: система отклоняет недопустимую вместимость слота и сохраняет последнее успешно сохранённое значение для генерации слотов.
- `FTS-003-005`: пользователь без capability `settings` не получает доступ к вкладке `Настройки` и прямому route/API.
- `FTS-003-006`: сохранённые настройки влияют на последующее формирование доступных слотов текущего дня.
- `FTS-003-007`: QA фиксирует documented inconsistency по верхней границе `slotCapacity` между UI reference и каноническими system artifacts.
- Финальный e2e acceptance для lane e2e выполняется тем же локальным containerized route, что уже зафиксирован в `docs/architecture/deployment-map.md`, если для feature не вводится отдельный runner path.
- Backend integration coverage используется как входное contract evidence и debug, но не заменяет feature-level browser e2e.
- QA создаёт `BUG-*` задачи для воспроизводимых product failures с меткой `frontend` или `backend`, если контур причины ясен.
- QA создаёт `BUG-*` задачи с меткой `devops` только если failure относится к runner, Docker runtime, env/config или launch path.

## Handoff route for FEATURE-003

- QA читает `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, затем `docs/system/feature-specs/feature-003-administrator-slot-settings-management.test-scenarios.md`, `docs/system/contracts/slot-settings-management.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, после этого `frontend-backoffice.md`, `backend-slot-settings.md`, `backend-access.md` и эту карту.
- Manual QA и e2e QA используют stable scenario IDs `FTS-003-*` как единый источник acceptance.
- Browser e2e и integration checks используют system contracts и architecture maps как источники API shape, guard semantics и expected assertions.

## Обновлять эту карту

Карту нужно обновить, если меняются сценарии manual/e2e acceptance, coverage mapping, UI parity route, fixtures, contract mocks, smoke-check или зона ответственности QA по slot settings.
