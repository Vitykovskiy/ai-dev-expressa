import { Injectable } from "@nestjs/common";
import type { MenuCatalogDto } from "@expressa/shared-types";

import type { MenuCatalogRepository } from "../persistence.types";

const emptyCatalog = (): MenuCatalogDto => ({
  categories: [],
  items: [],
  optionGroups: []
});

@Injectable()
export class InMemoryMenuCatalogRepository implements MenuCatalogRepository {
  private catalog: MenuCatalogDto = emptyCatalog();

  async get(): Promise<MenuCatalogDto> {
    return structuredClone(this.catalog);
  }

  async save(catalog: MenuCatalogDto): Promise<MenuCatalogDto> {
    this.catalog = structuredClone(catalog);
    return structuredClone(this.catalog);
  }
}

