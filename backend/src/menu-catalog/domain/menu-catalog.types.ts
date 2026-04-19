export const DRINK_SIZES = ["S", "M", "L"] as const;

export type DrinkSize = (typeof DRINK_SIZES)[number];

export const MENU_ITEM_TYPES = ["regular", "drink"] as const;

export type MenuItemType = (typeof MENU_ITEM_TYPES)[number];

export const OPTION_SELECTION_MODES = ["single", "multiple"] as const;

export type OptionSelectionMode = (typeof OPTION_SELECTION_MODES)[number];

export interface MenuCategory {
  readonly menuCategoryId: string;
  readonly name: string;
  readonly optionGroupRefs: readonly string[];
}

export interface DrinkSizePrice {
  readonly size: DrinkSize;
  readonly price: number;
}

export interface MenuItem {
  readonly menuItemId: string;
  readonly menuCategoryId: string;
  readonly name: string;
  readonly itemType: MenuItemType;
  readonly basePrice: number;
  readonly availability: boolean;
  readonly drinkSizePrices: readonly DrinkSizePrice[];
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
  readonly selectionMode: OptionSelectionMode;
  readonly options: readonly MenuOption[];
}

export interface MenuCatalogSnapshot {
  readonly categories: readonly MenuCategory[];
  readonly items: readonly MenuItem[];
  readonly optionGroups: readonly OptionGroup[];
}
