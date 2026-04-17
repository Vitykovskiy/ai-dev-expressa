import type {
  BackofficeAccessContextResponse,
  BackofficeAccessDenyReason,
  BackofficeTab,
  MenuCatalogDrinkSizePrice,
  MenuCatalogErrorResponse,
  MenuCatalogItemType,
  MenuCatalogSnapshot,
} from '@expressa/shared-types';

export interface BackofficeAppEnvironment {
  appTitle: string;
  apiBaseUrl: string;
  disableTelegramAuth: boolean;
  testTelegramId: string | null;
}

export interface BackofficeNavigationItem {
  tab: BackofficeTab;
  path: string;
  label: string;
  summary: string;
  accent: string;
}

export type BackofficeAccessStatus = 'idle' | 'restoring' | 'bootstrapping' | 'ready' | 'error';

export type BackofficeAccessErrorReason =
  | BackofficeAccessDenyReason
  | 'route-access-denied'
  | 'network-error'
  | 'unexpected-response';

export interface BackofficeAccessError {
  statusCode: number;
  reason: BackofficeAccessErrorReason;
  message: string;
}

export interface BackofficeAccessState {
  status: BackofficeAccessStatus;
  accessToken: string | null;
  context: BackofficeAccessContextResponse | null;
  error: BackofficeAccessError | null;
}

export type MenuCatalogStatus = 'idle' | 'loading' | 'ready' | 'saving' | 'error';

export type MenuCatalogErrorReason =
  | MenuCatalogErrorResponse['reason']
  | 'network-error'
  | 'unexpected-response';

export interface MenuCatalogError {
  statusCode: number;
  reason: MenuCatalogErrorReason;
  message: string;
}

export interface MenuCatalogSelectionState {
  categoryId: string | null;
  productId: string | null;
  optionGroupId: string | null;
}

export interface MenuCatalogState {
  status: MenuCatalogStatus;
  catalog: MenuCatalogSnapshot | null;
  error: MenuCatalogError | null;
  isDirty: boolean;
  selection: MenuCatalogSelectionState;
}

export interface MenuCatalogProductDraft {
  name: string;
  itemType: MenuCatalogItemType;
  basePrice: number | null;
  sizePrices: MenuCatalogDrinkSizePrice[];
}
