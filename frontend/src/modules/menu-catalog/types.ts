export const DRINK_SIZES = ["S", "M", "L"] as const;

export type DrinkSize = (typeof DRINK_SIZES)[number];
export type MenuItemType = "regular" | "drink";
export type SelectionMode = "single" | "multiple";

export interface DrinkSizePrice {
  readonly size: DrinkSize;
  readonly price: number;
}

export interface MenuCategory {
  readonly menuCategoryId: string;
  readonly name: string;
  readonly optionGroupRefs: readonly string[];
}

export interface MenuItem {
  readonly menuItemId: string;
  readonly menuCategoryId: string;
  readonly name: string;
  readonly itemType: MenuItemType;
  readonly basePrice?: number;
  readonly availability: boolean;
  readonly drinkSizePrices?: readonly DrinkSizePrice[];
}

export interface MenuOption {
  readonly optionId: string;
  readonly optionGroupId: string;
  readonly name: string;
  readonly priceDelta: number;
  readonly availability: boolean;
}

export interface OptionGroup {
  readonly optionGroupId: string;
  readonly name: string;
  readonly selectionMode: SelectionMode;
  readonly options: readonly MenuOption[];
}

export interface MenuCatalogSnapshot {
  readonly categories: readonly MenuCategory[];
  readonly items: readonly MenuItem[];
  readonly optionGroups: readonly OptionGroup[];
}

export interface MenuCategoryPayload {
  readonly name: string;
  readonly optionGroupRefs: readonly string[];
}

export interface MenuItemPayload {
  readonly menuCategoryId: string;
  readonly name: string;
  readonly itemType: MenuItemType;
  readonly basePrice?: number;
  readonly drinkSizePrices?: readonly DrinkSizePrice[];
}

export interface OptionPayload {
  readonly optionId?: string;
  readonly name: string;
  readonly priceDelta: number;
  readonly availability: boolean;
}

export interface OptionGroupPayload {
  readonly name: string;
  readonly selectionMode: SelectionMode;
  readonly options: readonly OptionPayload[];
}

export interface CategoryDialogSubmitPayload {
  readonly category: MenuCategoryPayload;
  readonly isOptionGroup: boolean;
}

export interface EditableOption {
  readonly optionId?: string;
  name: string;
  priceDelta: string;
  availability: boolean;
}

export interface MenuCategoryFormState {
  name: string;
  optionGroupRefs: string[];
}

export interface MenuItemFormState {
  menuCategoryId: string;
  name: string;
  itemType: MenuItemType;
  basePrice: string;
  sizePrices: Record<DrinkSize, string>;
}

export interface OptionGroupFormState {
  name: string;
  selectionMode: SelectionMode;
  assignedCategoryIds: string[];
  options: EditableOption[];
}

export type MenuCatalogErrorCode =
  | "administrator-role-required"
  | "invalid-drink-size-model"
  | "invalid-option-group-rule"
  | "backoffice-capability-forbidden"
  | "backoffice-auth-failed"
  | "menu-catalog-request-failed";

export interface MenuCatalogState {
  status: "idle" | "loading" | "ready" | "saving" | "error";
  snapshot: MenuCatalogSnapshot;
  errorCode: MenuCatalogErrorCode | null;
}
