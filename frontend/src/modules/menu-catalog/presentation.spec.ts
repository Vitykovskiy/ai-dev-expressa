import { describe, expect, it } from "vitest";
import {
  categoryCountLabel,
  findCategoryOwnedOptionGroup,
  itemPriceLabel,
  itemCountLabel,
  optionCountLabel,
  optionGroupCategoryIds,
  selectionModeLabel,
} from "@/modules/menu-catalog/presentation";
import type {
  MenuCategory,
  MenuItem,
  OptionGroup,
} from "@/modules/menu-catalog/types";

describe("menu catalog presentation", () => {
  it("formats drink price as a size list", () => {
    const item: MenuItem = {
      menuItemId: "item-1",
      menuCategoryId: "cat-1",
      name: "Латте",
      itemType: "drink",
      availability: true,
      drinkSizePrices: [
        { size: "S", price: 180 },
        { size: "M", price: 220 },
        { size: "L", price: 260 },
      ],
    };

    expect(itemPriceLabel(item)).toBe("S: 180 ₽ · M: 220 ₽ · L: 260 ₽");
  });

  it("formats free items with a custom label", () => {
    const item: MenuItem = {
      menuItemId: "item-2",
      menuCategoryId: "cat-1",
      name: "Без сиропа",
      itemType: "regular",
      basePrice: 0,
      availability: true,
    };

    expect(itemPriceLabel(item, { freeLabel: "Бесплатно" })).toBe("Бесплатно");
  });

  it("formats selection mode label", () => {
    expect(selectionModeLabel("single")).toBe("Один вариант");
    expect(selectionModeLabel("multiple")).toBe("Несколько вариантов");
  });

  it("formats category count label like the reference header", () => {
    expect(categoryCountLabel(1)).toBe("1 категория");
    expect(categoryCountLabel(2)).toBe("2 категории");
    expect(categoryCountLabel(5)).toBe("5 категорий");
    expect(categoryCountLabel(21)).toBe("21 категория");
    expect(categoryCountLabel(12)).toBe("12 категорий");
  });

  it("formats item and option counts with Russian plural forms", () => {
    expect(itemCountLabel(1)).toBe("1 товар");
    expect(itemCountLabel(2)).toBe("2 товара");
    expect(itemCountLabel(5)).toBe("5 товаров");
    expect(optionCountLabel(1)).toBe("1 опция");
    expect(optionCountLabel(2)).toBe("2 опции");
    expect(optionCountLabel(5)).toBe("5 опций");
  });

  it("detects an owned option group by category name when no assignment exists", () => {
    const category: MenuCategory = {
      menuCategoryId: "cat-1",
      name: "Молоко",
      optionGroupRefs: [],
    };
    const optionGroups: OptionGroup[] = [
      {
        optionGroupId: "group-1",
        name: "Молоко",
        selectionMode: "multiple",
        options: [],
      },
    ];

    expect(
      findCategoryOwnedOptionGroup(category, optionGroups)?.optionGroupId,
    ).toBe("group-1");
  });

  it("does not mark a category as owned option group when it already references another group", () => {
    const category: MenuCategory = {
      menuCategoryId: "cat-1",
      name: "Кофе",
      optionGroupRefs: ["group-2"],
    };
    const optionGroups: OptionGroup[] = [
      {
        optionGroupId: "group-1",
        name: "Кофе",
        selectionMode: "multiple",
        options: [],
      },
    ];

    expect(findCategoryOwnedOptionGroup(category, optionGroups)).toBeNull();
  });

  it("collects option group category ids from explicit ownership and fallback detection", () => {
    const categories: MenuCategory[] = [
      {
        menuCategoryId: "cat-owned",
        name: "Сиропы",
        optionGroupRefs: [],
      },
      {
        menuCategoryId: "cat-fallback",
        name: "Молоко",
        optionGroupRefs: [],
      },
      {
        menuCategoryId: "cat-regular",
        name: "Кофе",
        optionGroupRefs: ["group-fallback"],
      },
    ];
    const optionGroups: OptionGroup[] = [
      {
        optionGroupId: "group-fallback",
        name: "Молоко",
        selectionMode: "multiple",
        options: [],
      },
    ];

    expect(
      optionGroupCategoryIds(categories, optionGroups, {
        "cat-owned": "group-owned",
      }),
    ).toEqual(["cat-owned", "cat-fallback"]);
  });
});
