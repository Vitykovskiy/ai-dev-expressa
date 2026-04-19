import { MenuCatalogSnapshot } from "../domain/menu-catalog.types";

export const MENU_CATALOG_REPOSITORY = Symbol("MENU_CATALOG_REPOSITORY");

export interface MenuCatalogRepository {
  getSnapshot(): Promise<MenuCatalogSnapshot>;
  saveSnapshot(snapshot: MenuCatalogSnapshot): Promise<MenuCatalogSnapshot>;
  clear(): Promise<void>;
}
