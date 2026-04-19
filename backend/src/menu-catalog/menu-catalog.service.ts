import { Inject, Injectable } from "@nestjs/common";
import {
  MenuCatalogSnapshot,
  MenuCategory,
  MenuItem,
  OptionGroup
} from "./domain/menu-catalog.types";
import {
  createCategory,
  createItem,
  createOptionGroup,
  findCategory,
  findItem,
  findOptionGroup,
  removeCategory,
  removeItem,
  removeOptionGroup,
  updateCategory,
  updateItem,
  updateOptionGroup
} from "./domain/menu-catalog.mutations";
import { MenuCatalogValidator } from "./domain/menu-catalog.validator";
import {
  CreateCategoryInput,
  CreateItemInput,
  CreateOptionGroupInput,
  UpdateCategoryInput,
  UpdateItemInput,
  UpdateOptionGroupInput
} from "./menu-catalog.commands";
import {
  MENU_CATALOG_REPOSITORY,
  MenuCatalogRepository
} from "./repository/menu-catalog.repository";

@Injectable()
export class MenuCatalogService {
  constructor(
    @Inject(MENU_CATALOG_REPOSITORY)
    private readonly repository: MenuCatalogRepository,
    @Inject(MenuCatalogValidator)
    private readonly validator: MenuCatalogValidator
  ) {}

  async getCatalog(): Promise<MenuCatalogSnapshot> {
    return this.repository.getSnapshot();
  }

  async createCategory(input: CreateCategoryInput): Promise<MenuCategory> {
    const snapshot = await this.repository.getSnapshot();
    const category = createCategory(input);
    await this.save({ ...snapshot, categories: [...snapshot.categories, category] });
    return category;
  }

  async updateCategory(menuCategoryId: string, input: UpdateCategoryInput): Promise<MenuCategory> {
    const snapshot = await this.repository.getSnapshot();
    const updated = updateCategory(findCategory(snapshot, menuCategoryId), input);
    await this.save({
      ...snapshot,
      categories: snapshot.categories.map((category) =>
        category.menuCategoryId === menuCategoryId ? updated : category
      )
    });
    return updated;
  }

  async deleteCategory(menuCategoryId: string): Promise<MenuCatalogSnapshot> {
    return this.save(removeCategory(await this.repository.getSnapshot(), menuCategoryId));
  }

  async createItem(input: CreateItemInput): Promise<MenuItem> {
    const snapshot = await this.repository.getSnapshot();
    findCategory(snapshot, input.menuCategoryId);
    const item = createItem(input);
    await this.save({ ...snapshot, items: [...snapshot.items, item] });
    return item;
  }

  async updateItem(menuItemId: string, input: UpdateItemInput): Promise<MenuItem> {
    const snapshot = await this.repository.getSnapshot();
    const updated = updateItem(findItem(snapshot, menuItemId), input);
    findCategory(snapshot, updated.menuCategoryId);
    await this.save({
      ...snapshot,
      items: snapshot.items.map((item) => (item.menuItemId === menuItemId ? updated : item))
    });
    return updated;
  }

  async deleteItem(menuItemId: string): Promise<MenuCatalogSnapshot> {
    return this.save(removeItem(await this.repository.getSnapshot(), menuItemId));
  }

  async createOptionGroup(input: CreateOptionGroupInput): Promise<OptionGroup> {
    const snapshot = await this.repository.getSnapshot();
    const group = createOptionGroup(input);
    await this.save({ ...snapshot, optionGroups: [...snapshot.optionGroups, group] });
    return group;
  }

  async updateOptionGroup(
    optionGroupId: string,
    input: UpdateOptionGroupInput
  ): Promise<OptionGroup> {
    const snapshot = await this.repository.getSnapshot();
    const updated = updateOptionGroup(findOptionGroup(snapshot, optionGroupId), input);
    await this.save({
      ...snapshot,
      optionGroups: snapshot.optionGroups.map((group) =>
        group.optionGroupId === optionGroupId ? updated : group
      )
    });
    return updated;
  }

  async deleteOptionGroup(optionGroupId: string): Promise<MenuCatalogSnapshot> {
    return this.save(removeOptionGroup(await this.repository.getSnapshot(), optionGroupId));
  }

  private async save(snapshot: MenuCatalogSnapshot): Promise<MenuCatalogSnapshot> {
    this.validator.validateCategoryReferences(snapshot);
    return this.repository.saveSnapshot(snapshot);
  }
}
