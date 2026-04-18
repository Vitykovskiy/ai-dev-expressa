import { isBackofficeMenuRoute } from './menu-catalog-navigation';

let allowDirtyMenuLeave = false;

export function shouldConfirmMenuCatalogLeave(params: {
  fromName: unknown;
  isDirty: boolean;
  toName: unknown;
}) {
  return params.isDirty && isBackofficeMenuRoute(params.fromName) && !isBackofficeMenuRoute(params.toName);
}

export function isDirtyMenuLeaveBypassEnabled() {
  return allowDirtyMenuLeave;
}

export async function withDirtyMenuLeaveBypass<T>(task: () => Promise<T>) {
  allowDirtyMenuLeave = true;

  try {
    return await task();
  } finally {
    allowDirtyMenuLeave = false;
  }
}
