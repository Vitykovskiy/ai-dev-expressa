import { Injectable } from '@nestjs/common';
import type { MenuCatalog } from '../models/menu-catalog';

@Injectable()
export abstract class MenuCatalogRepositoryPort {
  abstract getSnapshot(): Promise<MenuCatalog>;
  abstract saveSnapshot(catalog: MenuCatalog): Promise<MenuCatalog>;
}
