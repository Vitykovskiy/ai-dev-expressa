# Карточка задачи

## Карточка задачи

- Идентификатор: `QA-002`
- Родительская задача: `FEATURE-002`
- Заголовок: `Ручное тестирование управления каталогом меню administrator`
- Описание: `Нужно вручную проверить собранную FEATURE-002: administrator во вкладке Меню управляет категориями, товарами, ценами, размерной моделью напитков S/M/L, группами дополнительных опций, опциями и назначением групп на категории; пользователь без capability menu не может выполнить сценарий. Manual QA также сверяет live-интерфейс с backoffice UI contract и .references/Expressa_admin, фиксирует exploratory findings и оформляет воспроизводимые defects через BUG-задачи с меткой контура причины.`
- Единица поставки: `FEATURE-002`
- Роль: `Тестирование`
- Приоритет: `Критический`
- Статус: `Готова к работе`

## Ссылки на документы

- Системные артефакты: `docs/system/domain-model/menu-catalog.md`, `docs/system/contracts/menu-and-availability-management.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`
- Архитектурные артефакты: `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`
- Контурная карта: `docs/architecture/application-map/qa-menu-catalog.md`
- Бизнес-артефакты: `не требуются`
- Дополнительные материалы: `.references/Expressa_admin/src/app/screens/MenuScreen.tsx`, `.references/Expressa_admin/src/app/components/AddCategoryDialog.tsx`, `.references/Expressa_admin/src/app/components/AddProductDialog.tsx`, `.references/Expressa_admin/src/app/components/EditProductDialog.tsx`

## Примечания

- Зависимости: `BE-002`, `FE-002`
- Минимальный read set: `docs/system/contracts/menu-and-availability-management.md`, `docs/system/domain-model/menu-catalog.md`, `docs/system/use-cases/administrator-manage-menu.md`, `docs/system/ui-contracts/expressa-backoffice-ui-contract.md`, `docs/system/ui-behavior-mapping/backoffice-ui-binding.md`, `docs/system/contracts/backoffice-auth-and-capability-access.md`, `docs/architecture/application-map/qa-menu-catalog.md`, `docs/architecture/application-map/frontend-backoffice.md`, `docs/architecture/application-map/backend-menu-catalog.md`, `docs/architecture/application-map/backend-access.md`
- Ожидаемый результат для ревью: `Есть manual QA evidence по пользовательским сценариям управления каталогом меню, negative evidence для доступа без capability menu, desktop/mobile UI parity evidence против backoffice UI contract и .references/Expressa_admin, а также список заведенных BUG-задач с метками контура причины или явное подтверждение, что воспроизводимые product defects не обнаружены.`
- Проверки: `Ручные сценарии: открыть вкладку Меню после backoffice session; создать категорию; создать товар в категории; задать цены S/M/L для напитка; создать группу дополнительных опций; создать платные и бесплатные опции; назначить группу на категорию; проверить отказ пользователю без capability menu. UI parity: desktop/mobile сравнение экрана Меню и диалогов категорий/товаров с .references/Expressa_admin. Exploratory checks: empty/error/disabled states, validation messages, responsive behavior. Defect handoff: список созданных BUG-задач с метками frontend/backend/devops или подтверждение отсутствия воспроизводимых defects.`
- Обновление карты приложения: `Обновить docs/architecture/application-map/qa-menu-catalog.md, если меняются manual acceptance path, UI parity route, required manual evidence или зона ответственности QA по menu catalog.`
- Критерии готовности: `Manual QA-задача завершена, когда ручные пользовательские сценарии и UI parity FEATURE-002 подтверждены, все воспроизводимые defects оформлены через BUG-задачи с метками контура причины или явно отсутствуют, а закрытие FEATURE-002 остается заблокированным только при незавершенной E2E QA-005 или открытых blocking BUG-задачах.`
