export type UserRole = 'customer' | 'barista' | 'administrator';

export type BackofficeTab =
  | 'orders'
  | 'availability'
  | 'menu'
  | 'users'
  | 'settings';

export type BackofficeAccessChannel =
  | 'backoffice-telegram-entry'
  | 'test-mode-without-telegram';

export type BackofficeBootstrapMode = 'telegram' | 'test';

export type BackofficeAccessDenyReason =
  | 'telegram-context-required'
  | 'telegram-context-invalid'
  | 'test-mode-disabled'
  | 'test-telegram-id-required'
  | 'user-not-found'
  | 'backoffice-role-required'
  | 'user-blocked'
  | 'access-token-required'
  | 'access-token-invalid'
  | 'administrator-role-required';

export interface BackofficeAccessBootstrapRequest {
  mode: BackofficeBootstrapMode;
  telegramInitData?: string;
  testTelegramId?: string;
}

export interface BackofficeAccessUser {
  userId: string;
  telegramId: string;
  roles: UserRole[];
  blocked: boolean;
  isPrimaryAdministrator: boolean;
}

export interface BackofficeAccessBootstrapResponse {
  accessToken: string;
  channel: BackofficeAccessChannel;
  isTestMode: boolean;
  availableTabs: BackofficeTab[];
  user: BackofficeAccessUser;
}

export type BackofficeAccessContextResponse = BackofficeAccessBootstrapResponse;

export interface BackofficeAccessDeniedResponse {
  statusCode: number;
  reason: BackofficeAccessDenyReason;
  message: string;
}

export type MenuCatalogItemType = 'product' | 'drink';

export type DrinkSize = 'S' | 'M' | 'L';

export type OptionGroupSelectionMode = 'single' | 'multiple';

export type MenuCatalogErrorReason =
  | 'administrator-role-required'
  | 'invalid-drink-size-model'
  | 'invalid-option-group-rule';

export interface MenuCatalogDrinkSizePrice {
  size: DrinkSize;
  price: number;
}

export interface MenuCatalogOption {
  optionId: string;
  name: string;
  priceDelta: number;
}

export interface MenuCatalogOptionGroup {
  optionGroupId: string;
  name: string;
  selectionMode: OptionGroupSelectionMode;
  options: MenuCatalogOption[];
}

export interface MenuCatalogCategory {
  menuCategoryId: string;
  name: string;
  optionGroupRefs: string[];
}

export interface MenuCatalogItem {
  menuItemId: string;
  menuCategoryId: string;
  name: string;
  itemType: MenuCatalogItemType;
  basePrice: number | null;
  sizePrices: MenuCatalogDrinkSizePrice[];
}

export interface MenuCatalogSnapshot {
  categories: MenuCatalogCategory[];
  items: MenuCatalogItem[];
  optionGroups: MenuCatalogOptionGroup[];
}

export type BackofficeMenuCatalogResponse = MenuCatalogSnapshot;

export type BackofficeUpdateMenuCatalogRequest = MenuCatalogSnapshot;

export interface MenuCatalogErrorResponse {
  statusCode: number;
  reason: MenuCatalogErrorReason;
  message: string;
}
