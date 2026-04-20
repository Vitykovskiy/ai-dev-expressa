import { describe, expect, it } from "vitest";
import {
  categoryCountLabel,
  findCategoryOwnedOptionGroup,
  itemPriceLabel,
  selectionModeLabel,
} from "@/modules/menu-catalog/presentation";
import type {
  MenuCategory,
  MenuItem,
  OptionGroup,
} from "@/modules/menu-catalog/types";

describe("menu catalog presentation", () => {
  it("formats drink price from the minimum size price", () => {
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

    expect(itemPriceLabel(item)).toBe("от 180 ₽");
  });

  it("formats selection mode label", () => {
    expect(selectionModeLabel("single")).toBe("Один вариант");
    expect(selectionModeLabel("multiple")).toBe("Несколько вариантов");
  });

  it("formats category count label like the reference header", () => {
    expect(categoryCountLabel(1)).toBe("1 категория");
    expect(categoryCountLabel(2)).toBe("2 категории");
    expect(categoryCountLabel(5)).toBe("5 категорий");
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
});
