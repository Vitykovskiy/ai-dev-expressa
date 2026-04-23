import {
  type MenuCategory,
  type MenuItem,
  type OptionGroup,
  type SelectionMode,
} from "@/modules/menu-catalog/types";

export function itemPriceLabel(item: MenuItem): string {
  if (item.itemType === "drink") {
    const prices = item.drinkSizePrices ?? [];
    const minPrice = Math.min(...prices.map((price) => price.price));
    return Number.isFinite(minPrice) ? `от ${minPrice} ₽` : "Нет цены";
  }

  return typeof item.basePrice === "number"
    ? `${item.basePrice} ₽`
    : "Нет цены";
}

export function selectionModeLabel(mode: SelectionMode): string {
  return mode === "single" ? "Один вариант" : "Несколько вариантов";
}

export function categoryCountLabel(count: number): string {
  return `${count} ${pluralizeRu(count, "категория", "категории", "категорий")}`;
}

export function itemCountLabel(count: number): string {
  return `${count} ${pluralizeRu(count, "товар", "товара", "товаров")}`;
}

export function optionCountLabel(count: number): string {
  return `${count} ${pluralizeRu(count, "опция", "опции", "опций")}`;
}

export function optionGroupCategoryIds(
  categories: readonly MenuCategory[],
  optionGroups: readonly OptionGroup[],
  ownedOptionGroupMap: Readonly<Record<string, string>>,
): string[] {
  return categories
    .filter(
      (category) =>
        Boolean(ownedOptionGroupMap[category.menuCategoryId]) ||
        Boolean(findCategoryOwnedOptionGroup(category, optionGroups)),
    )
    .map((category) => category.menuCategoryId);
}

export function findCategoryOwnedOptionGroup(
  category: Pick<MenuCategory, "name" | "optionGroupRefs"> | null,
  optionGroups: readonly OptionGroup[],
): OptionGroup | null {
  if (!category || category.optionGroupRefs.length > 0) {
    return null;
  }

  const normalizedName = category.name.trim().toLowerCase();
  if (!normalizedName) {
    return null;
  }

  return (
    optionGroups.find(
      (optionGroup) => optionGroup.name.trim().toLowerCase() === normalizedName,
    ) ?? null
  );
}

function pluralizeRu(
  count: number,
  one: string,
  few: string,
  many: string,
): string {
  const value = Math.abs(count);
  const lastTwoDigits = value % 100;
  const lastDigit = value % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return many;
  }

  if (lastDigit === 1) {
    return one;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return few;
  }

  return many;
}
