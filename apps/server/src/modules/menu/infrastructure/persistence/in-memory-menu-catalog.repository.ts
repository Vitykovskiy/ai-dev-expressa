import { Injectable } from '@nestjs/common';
import type { MenuCatalog } from '../../domain/models/menu-catalog';
import { MenuCatalogRepositoryPort } from '../../domain/ports/menu-catalog.repository.port';

@Injectable()
export class InMemoryMenuCatalogRepository extends MenuCatalogRepositoryPort {
  private snapshot: MenuCatalog = {
    categories: [],
    items: [],
    optionGroups: [],
  };

  async getSnapshot(): Promise<MenuCatalog> {
    return structuredClone(this.snapshot);
  }

  async saveSnapshot(catalog: MenuCatalog): Promise<MenuCatalog> {
    this.snapshot = structuredClone(catalog);
    return structuredClone(this.snapshot);
  }
}
