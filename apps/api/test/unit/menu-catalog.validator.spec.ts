import { MenuCatalogValidator } from "../../src/modules/menu-catalog/menu-catalog.validator";

describe("MenuCatalogValidator", () => {
  it("accepts valid catalog with drink sizes and regular items", () => {
    const validator = new MenuCatalogValidator();

    expect(() =>
      validator.validate({
        categories: [
          {
            menuCategoryId: "coffee",
            name: "Coffee",
            optionGroupIds: ["milk"]
          }
        ],
        optionGroups: [
          {
            optionGroupId: "milk",
            name: "Milk",
            selectionMode: "single",
            options: [
              {
                optionId: "oat",
                name: "Oat",
                priceDelta: 30,
                availability: true
              }
            ]
          }
        ],
        items: [
          {
            menuItemId: "latte",
            menuCategoryId: "coffee",
            name: "Latte",
            itemType: "drink",
            basePrice: null,
            availability: true,
            sizePrices: [
              { size: "S", price: 180 },
              { size: "M", price: 220 },
              { size: "L", price: 260 }
            ]
          },
          {
            menuItemId: "cookie",
            menuCategoryId: "coffee",
            name: "Cookie",
            itemType: "regular",
            basePrice: 90,
            availability: true,
            sizePrices: []
          }
        ]
      })
    ).not.toThrow();
  });

  it("rejects drink without full size matrix", () => {
    const validator = new MenuCatalogValidator();

    expect(() =>
      validator.validate({
        categories: [
          {
            menuCategoryId: "coffee",
            name: "Coffee",
            optionGroupIds: []
          }
        ],
        optionGroups: [],
        items: [
          {
            menuItemId: "latte",
            menuCategoryId: "coffee",
            name: "Latte",
            itemType: "drink",
            basePrice: null,
            availability: true,
            sizePrices: [
              { size: "S", price: 180 },
              { size: "M", price: 220 }
            ]
          }
        ]
      })
    ).toThrow("Drink item must define non-negative prices for S, M and L");
  });
});

