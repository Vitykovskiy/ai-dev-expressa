import type {
  DrinkSize,
  MenuCatalogCategory as MenuCatalogCategorySnapshot,
  MenuCatalogDrinkSizePrice as MenuCatalogDrinkSizePriceSnapshot,
  MenuCatalogItem as MenuCatalogItemSnapshot,
  MenuCatalogItemType,
  MenuCatalogOption as MenuCatalogOptionSnapshot,
  MenuCatalogOptionGroup as MenuCatalogOptionGroupSnapshot,
  MenuCatalogSnapshot,
  OptionGroupSelectionMode,
} from '@expressa/shared-types';

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

export interface MenuCatalog {
  categories: MenuCatalogCategory[];
  items: MenuCatalogItem[];
  optionGroups: MenuCatalogOptionGroup[];
}

export function toMenuCatalogSnapshot(catalog: MenuCatalog): MenuCatalogSnapshot {
  return {
    categories: catalog.categories.map(toMenuCatalogCategorySnapshot),
    items: catalog.items.map(toMenuCatalogItemSnapshot),
    optionGroups: catalog.optionGroups.map(toMenuCatalogOptionGroupSnapshot),
  };
}

function toMenuCatalogCategorySnapshot(category: MenuCatalogCategory): MenuCatalogCategorySnapshot {
  return {
    menuCategoryId: category.menuCategoryId,
    name: category.name,
    optionGroupRefs: [...category.optionGroupRefs],
  };
}

function toMenuCatalogItemSnapshot(item: MenuCatalogItem): MenuCatalogItemSnapshot {
  return {
    menuItemId: item.menuItemId,
    menuCategoryId: item.menuCategoryId,
    name: item.name,
    itemType: item.itemType,
    basePrice: item.basePrice,
    sizePrices: item.sizePrices.map(toMenuCatalogDrinkSizePriceSnapshot),
  };
}

function toMenuCatalogDrinkSizePriceSnapshot(
  price: MenuCatalogDrinkSizePrice,
): MenuCatalogDrinkSizePriceSnapshot {
  return {
    size: price.size,
    price: price.price,
  };
}

function toMenuCatalogOptionGroupSnapshot(
  group: MenuCatalogOptionGroup,
): MenuCatalogOptionGroupSnapshot {
  return {
    optionGroupId: group.optionGroupId,
    name: group.name,
    selectionMode: group.selectionMode,
    options: group.options.map(toMenuCatalogOptionSnapshot),
  };
}

function toMenuCatalogOptionSnapshot(option: MenuCatalogOption): MenuCatalogOptionSnapshot {
  return {
    optionId: option.optionId,
    name: option.name,
    priceDelta: option.priceDelta,
  };
}
