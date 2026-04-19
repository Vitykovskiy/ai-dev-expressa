import { Injectable } from "@nestjs/common";
import { MenuCatalogSnapshot } from "../domain/menu-catalog.types";
import { MenuCatalogRepository } from "./menu-catalog.repository";

const emptySnapshot: MenuCatalogSnapshot = {
  categories: [],
  items: [],
  optionGroups: [],
};

@Injectable()
export class InMemoryMenuCatalogRepository implements MenuCatalogRepository {
  private snapshot: MenuCatalogSnapshot = emptySnapshot;

  async getSnapshot(): Promise<MenuCatalogSnapshot> {
    return cloneSnapshot(this.snapshot);
  }

  async saveSnapshot(
    snapshot: MenuCatalogSnapshot,
  ): Promise<MenuCatalogSnapshot> {
    this.snapshot = cloneSnapshot(snapshot);
    return this.getSnapshot();
  }

  async clear(): Promise<void> {
    this.snapshot = emptySnapshot;
  }
}

function cloneSnapshot(snapshot: MenuCatalogSnapshot): MenuCatalogSnapshot {
  return {
    categories: snapshot.categories.map((category) => ({
      ...category,
      optionGroupRefs: [...category.optionGroupRefs],
    })),
    items: snapshot.items.map((item) => ({
      ...item,
      drinkSizePrices: item.drinkSizePrices.map((price) => ({ ...price })),
    })),
    optionGroups: snapshot.optionGroups.map((group) => ({
      ...group,
      options: group.options.map((option) => ({ ...option })),
    })),
  };
}
