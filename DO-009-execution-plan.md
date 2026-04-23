# DO-009 Execution Plan

## Goal

Восстановить и зафиксировать delivery/runtime contract, при котором опубликованный `test-e2e` frontend origin даёт QA browser e2e JSON-доступ к `GET /customer/slots` через frontend proxy route.

## Read Set

- `tasks/DO-009-publish-backend-base-url-for-slot-settings-e2e.md`
- `tasks/QA-007-e2e-administrator-slot-settings-management.md`
- `docs/architecture/deployment-map.md`
- `docs/architecture/application-map/delivery-and-runtime.md`
- `docs/architecture/application-map/qa-slot-settings.md`
- `docs/architecture/application-map/backend-slot-settings.md`
- `frontend/nginx.conf`
- `scripts/deploy-test-vps.sh`
- `.github/workflows/deploy-test.yml`

## Planned Changes

1. Усилить post-deploy smoke-check так, чтобы он проверял опубликованный frontend origin не только по `/`, но и по proxy routes `/backoffice/*` и `/customer/*`.
2. Обновить delivery/runtime documentation для published QA route и canonical значения `E2E_BACKEND_BASE_URL` на `test-e2e`.
3. Выполнить локальную проверку shell-скрипта и точечную верификацию изменённых артефактов.

## Done Criteria

- `scripts/deploy-test-vps.sh` валидирует JSON-ответы published proxy routes.
- `docs/architecture/deployment-map.md` и `docs/architecture/application-map/delivery-and-runtime.md` отражают новый smoke/deploy contract.
- README и task artifacts не противоречат canonical QA route.
