export const menuItemTypeValues = ["regular", "drink"] as const;
export type MenuItemType = (typeof menuItemTypeValues)[number];

export const drinkSizeValues = ["S", "M", "L"] as const;
export type DrinkSize = (typeof drinkSizeValues)[number];

export const optionGroupSelectionModeValues = ["single", "multiple"] as const;
export type OptionGroupSelectionMode = (typeof optionGroupSelectionModeValues)[number];

export interface DrinkSizePriceDto {
  size: DrinkSize;
  price: number;
}

export interface MenuCategoryDto {
  menuCategoryId: string;
  name: string;
  optionGroupIds: string[];
}

export interface MenuItemDto {
  menuItemId: string;
  menuCategoryId: string;
  name: string;
  itemType: MenuItemType;
  basePrice: number | null;
  sizePrices: DrinkSizePriceDto[];
  availability: boolean;
}

export interface OptionDto {
  optionId: string;
  name: string;
  priceDelta: number;
  availability: boolean;
}

export interface OptionGroupDto {
  optionGroupId: string;
  name: string;
  selectionMode: OptionGroupSelectionMode;
  options: OptionDto[];
}

export interface MenuCatalogDto {
  categories: MenuCategoryDto[];
  items: MenuItemDto[];
  optionGroups: OptionGroupDto[];
}

export interface MenuCatalogResponseDto {
  catalog: MenuCatalogDto;
}

export interface UpdateMenuCatalogRequestDto {
  catalog: MenuCatalogDto;
}

