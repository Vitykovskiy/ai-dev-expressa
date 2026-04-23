export interface MenuCatalogSnapshot {
  readonly categories: readonly {
    readonly menuCategoryId: string;
    readonly name: string;
    readonly optionGroupRefs: readonly string[];
  }[];
  readonly items: readonly {
    readonly name: string;
    readonly itemType: "regular" | "drink";
    readonly basePrice?: number;
    readonly drinkSizePrices?: readonly {
      readonly size: "S" | "M" | "L";
      readonly price: number;
    }[];
  }[];
  readonly optionGroups: readonly {
    readonly optionGroupId: string;
    readonly name: string;
    readonly selectionMode: "single" | "multiple";
  }[];
}
