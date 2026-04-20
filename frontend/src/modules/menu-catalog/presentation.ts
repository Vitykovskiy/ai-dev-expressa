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
  if (count % 10 === 1 && count % 100 !== 11) {
    return `${count} категория`;
  }

  if (
    count % 10 >= 2 &&
    count % 10 <= 4 &&
    (count % 100 < 12 || count % 100 > 14)
  ) {
    return `${count} категории`;
  }

  return `${count} категорий`;
}

export function itemCountLabel(count: number): string {
  return `${count} ${count === 1 ? "товар" : "товаров"}`;
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
