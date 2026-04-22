# Backend Slot Settings Application Map

## Граница

Серверный контур управления рабочими часами, вместимостью слотов и генерацией доступных customer-слотов текущего дня.

## Модули

| Модуль                                        | Ответственность                                                                                             |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `SlotSettingsModule` или локальный эквивалент | HTTP/API boundary и orchestration операций чтения и сохранения настроек слотов.                             |
| `SlotSettingsService`                         | Чтение текущих или дефолтных настроек, сохранение допустимого snapshot и orchestration генерации слотов.    |
| `SlotSettingsValidator`                       | Проверка `workingHours` и `slotCapacity`, mapping ошибок `invalid-working-hours` и `invalid-slot-capacity`. |
| `SlotSettingsRepository`                      | Хранение текущего snapshot рабочих часов и вместимости слотов.                                              |
| `AvailableSlotsService`                       | Генерация доступных слотов текущего дня по действующим настройкам и активным заказам.                       |

## Реализация

| Путь                                                                         | Назначение                                                                                                                 |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `backend/src/slot-settings/slot-settings.module.ts`                          | NestJS-модуль контура настроек слотов.                                                                                     |
| `backend/src/slot-settings/slot-settings.controller.ts`                      | HTTP boundary для чтения и сохранения настроек слотов; использует capability `settings` через общий `BackofficeAuthGuard`. |
| `backend/src/slot-settings/slot-settings.service.ts`                         | Application orchestration чтения/сохранения настроек и подготовки данных для генерации слотов.                             |
| `backend/src/slot-settings/domain/slot-settings.types.ts`                    | Канонический shape рабочих часов, вместимости слота и snapshot действующих настроек.                                       |
| `backend/src/slot-settings/domain/slot-settings.validator.ts`                | Доменные проверки времени открытия/закрытия и допустимости вместимости.                                                    |
| `backend/src/slot-settings/domain/slot-settings.errors.ts`                   | Канонические ошибки `invalid-working-hours` и `invalid-slot-capacity`.                                                     |
| `backend/src/slot-settings/repository/in-memory-slot-settings.repository.ts` | Текущий in-memory adapter хранения настроек слотов; не содержит auth checks или UI-specific logic.                         |
| `backend/src/ordering/available-slots.service.ts` или локальный эквивалент   | Генерация customer-слотов текущего дня по 10-минутным интервалам с учетом активных заказов и действующих slot settings.    |

## Endpoints and capability boundary

| Method | Path                                       | Назначение                                                                                            |
| ------ | ------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| `GET`  | `/backoffice/settings/slot-settings`       | Возвращает текущие или дефолтные рабочие часы и вместимость слота для administrator.                  |
| `PUT`  | `/backoffice/settings/slot-settings`       | Сохраняет рабочие часы и вместимость слота; endpoint защищён capability `settings`.                   |
| `GET`  | `/customer/slots` или локальный эквивалент | Возвращает доступные слоты текущего дня, сформированные по действующим настройкам и активным заказам. |

## Server contracts for FEATURE-003

- Канонический contract для чтения/сохранения настроек и генерации слотов находится в `docs/system/contracts/slot-settings-management.md`.
- Backend является источником истины для действующих рабочих часов и вместимости слотов; frontend не должен подтверждать сохранение без успешного server response.
- Если пользовательские настройки ещё не сохранялись, backend возвращает дефолтные значения `09:00–20:00` и `5`.
- Backend отклоняет конфигурацию, где `closeTime <= openTime`, с ошибкой `invalid-working-hours`.
- Backend отклоняет вместимость, не принятую доменной операцией, с ошибкой `invalid-slot-capacity`.
- Backend применяет последнее успешно сохранённое сочетание настроек к дальнейшему формированию доступных слотов текущего дня.
- Генерация слотов остаётся ограниченной текущим днём и шагом `10` минут.
- Заказы в статусах `Создан`, `Подтвержден`, `Готов к выдаче` занимают вместимость; `Отклонен` и `Закрыт` не занимают вместимость.
- Верхняя граница `slotCapacity` не должна канонизироваться как `50` только на основании UI reference; если реализация требует дополнительного numeric bound сверх уже подтверждённых правил, это считается upstream gap.

## Handoff route for FEATURE-003

- Для server-side реализации сначала читать `docs/system/feature-specs/feature-003-administrator-slot-settings-management.md`, затем `docs/system/contracts/slot-settings-management.md`, `docs/system/domain-model/ordering-and-pickup.md`, `docs/system/use-cases/administrator-manage-slot-settings.md`, затем эту карту и `docs/architecture/application-map/backend-access.md`.
- Если меняются endpoint boundary, DTO shape, хранилище настроек, source of truth для генерации слотов или error mapping, обновляется эта карта и соответствующий system contract в одном handoff.

## Обновлять эту карту

Карту нужно обновить, если меняются server-side endpoints, DTO, схема хранения настроек слотов, способ генерации доступных слотов, capability attachment `settings` или error mapping управления настройками.
