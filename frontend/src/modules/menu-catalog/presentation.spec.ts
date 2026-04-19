import { describe, expect, it } from "vitest";
import { itemPriceLabel, selectionModeLabel } from "./presentation";
import type { MenuItem } from "./types";

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
});
