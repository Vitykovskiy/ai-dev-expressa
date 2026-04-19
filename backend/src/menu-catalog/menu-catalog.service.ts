import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  DrinkSizePrice,
  MenuCatalogSnapshot,
  MenuCategory,
  MenuItem,
  MenuItemType,
  MenuOption,
  OptionGroup,
  OptionSelectionMode
} from "./domain/menu-catalog.types";
import { MenuCatalogValidator } from "./domain/menu-catalog.validator";
import {
  MENU_CATALOG_REPOSITORY,
  MenuCatalogRepository
} from "./repository/menu-catalog.repository";

export interface CreateCategoryInput {
  readonly name: string;
  readonly optionGroupRefs?: readonly string[];
}

export interface UpdateCategoryInput {
  readonly name?: string;
  readonly optionGroupRefs?: readonly string[];
}

export interface CreateItemInput {
  readonly menuCategoryId: string;
  readonly name: string;
  readonly itemType: MenuItemType;
  readonly basePrice?: number;
  readonly availability?: boolean;
  readonly drinkSizePrices?: readonly DrinkSizePrice[];
}

export interface UpdateItemInput {
  readonly menuCategoryId?: string;
  readonly name?: string;
  readonly itemType?: MenuItemType;
  readonly basePrice?: number;
  readonly availability?: boolean;
  readonly drinkSizePrices?: readonly DrinkSizePrice[];
}

export interface OptionInput {
  readonly optionId?: string;
  readonly name: string;
  readonly priceDelta?: number;
  readonly availability?: boolean;
}

export interface CreateOptionGroupInput {
  readonly name: string;
  readonly selectionMode: OptionSelectionMode;
  readonly options?: readonly OptionInput[];
}

export interface UpdateOptionGroupInput {
  readonly name?: string;
  readonly selectionMode?: OptionSelectionMode;
  readonly options?: readonly OptionInput[];
}

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
    const category: MenuCategory = {
      menuCategoryId: randomUUID(),
      name: input.name,
      optionGroupRefs: input.optionGroupRefs ?? []
    };
    await this.save({ ...snapshot, categories: [...snapshot.categories, category] });
    return category;
  }

  async updateCategory(menuCategoryId: string, input: UpdateCategoryInput): Promise<MenuCategory> {
    const snapshot = await this.repository.getSnapshot();
    const existing = findCategory(snapshot, menuCategoryId);
    const updated: MenuCategory = {
      ...existing,
      name: input.name ?? existing.name,
      optionGroupRefs: input.optionGroupRefs ?? existing.optionGroupRefs
    };
    await this.save({
      ...snapshot,
      categories: snapshot.categories.map((category) =>
        category.menuCategoryId === menuCategoryId ? updated : category
      )
    });
    return updated;
  }

  async deleteCategory(menuCategoryId: string): Promise<MenuCatalogSnapshot> {
    const snapshot = await this.repository.getSnapshot();
    findCategory(snapshot, menuCategoryId);

    if (snapshot.items.some((item) => item.menuCategoryId === menuCategoryId)) {
      throw new BadRequestException("menu-category-has-items");
    }

    return this.save({
      ...snapshot,
      categories: snapshot.categories.filter((category) => category.menuCategoryId !== menuCategoryId)
    });
  }

  async createItem(input: CreateItemInput): Promise<MenuItem> {
    const snapshot = await this.repository.getSnapshot();
    findCategory(snapshot, input.menuCategoryId);
    const item: MenuItem = {
      menuItemId: randomUUID(),
      menuCategoryId: input.menuCategoryId,
      name: input.name,
      itemType: input.itemType,
      basePrice: input.basePrice ?? 0,
      availability: input.availability ?? true,
      drinkSizePrices: input.drinkSizePrices ?? []
    };
    await this.save({ ...snapshot, items: [...snapshot.items, item] });
    return item;
  }

  async updateItem(menuItemId: string, input: UpdateItemInput): Promise<MenuItem> {
    const snapshot = await this.repository.getSnapshot();
    const existing = findItem(snapshot, menuItemId);
    const updated: MenuItem = {
      ...existing,
      menuCategoryId: input.menuCategoryId ?? existing.menuCategoryId,
      name: input.name ?? existing.name,
      itemType: input.itemType ?? existing.itemType,
      basePrice: input.basePrice ?? existing.basePrice,
      availability: input.availability ?? existing.availability,
      drinkSizePrices: input.drinkSizePrices ?? existing.drinkSizePrices
    };
    findCategory(snapshot, updated.menuCategoryId);
    await this.save({
      ...snapshot,
      items: snapshot.items.map((item) => (item.menuItemId === menuItemId ? updated : item))
    });
    return updated;
  }

  async deleteItem(menuItemId: string): Promise<MenuCatalogSnapshot> {
    const snapshot = await this.repository.getSnapshot();
    findItem(snapshot, menuItemId);
    return this.save({
      ...snapshot,
      items: snapshot.items.filter((item) => item.menuItemId !== menuItemId)
    });
  }

  async createOptionGroup(input: CreateOptionGroupInput): Promise<OptionGroup> {
    const snapshot = await this.repository.getSnapshot();
    const optionGroupId = randomUUID();
    const group: OptionGroup = {
      optionGroupId,
      name: input.name,
      selectionMode: input.selectionMode,
      options: toOptions(optionGroupId, input.options ?? [])
    };
    await this.save({ ...snapshot, optionGroups: [...snapshot.optionGroups, group] });
    return group;
  }

  async updateOptionGroup(
    optionGroupId: string,
    input: UpdateOptionGroupInput
  ): Promise<OptionGroup> {
    const snapshot = await this.repository.getSnapshot();
    const existing = findOptionGroup(snapshot, optionGroupId);
    const updated: OptionGroup = {
      ...existing,
      name: input.name ?? existing.name,
      selectionMode: input.selectionMode ?? existing.selectionMode,
      options: input.options ? toOptions(optionGroupId, input.options) : existing.options
    };
    await this.save({
      ...snapshot,
      optionGroups: snapshot.optionGroups.map((group) =>
        group.optionGroupId === optionGroupId ? updated : group
      )
    });
    return updated;
  }

  async deleteOptionGroup(optionGroupId: string): Promise<MenuCatalogSnapshot> {
    const snapshot = await this.repository.getSnapshot();
    findOptionGroup(snapshot, optionGroupId);

    if (snapshot.categories.some((category) => category.optionGroupRefs.includes(optionGroupId))) {
      throw new BadRequestException("option-group-in-use");
    }

    return this.save({
      ...snapshot,
      optionGroups: snapshot.optionGroups.filter((group) => group.optionGroupId !== optionGroupId)
    });
  }

  private async save(snapshot: MenuCatalogSnapshot): Promise<MenuCatalogSnapshot> {
    this.validator.validateCategoryReferences(snapshot);
    return this.repository.saveSnapshot(snapshot);
  }
}

function toOptions(optionGroupId: string, inputs: readonly OptionInput[]): MenuOption[] {
  return inputs.map((input) => ({
    optionId: input.optionId ?? randomUUID(),
    optionGroupId,
    name: input.name,
    priceDelta: input.priceDelta ?? 0,
    availability: input.availability ?? true
  }));
}

function findCategory(snapshot: MenuCatalogSnapshot, menuCategoryId: string): MenuCategory {
  const category = snapshot.categories.find((item) => item.menuCategoryId === menuCategoryId);
  if (!category) {
    throw new NotFoundException("menu-category-not-found");
  }
  return category;
}

function findItem(snapshot: MenuCatalogSnapshot, menuItemId: string): MenuItem {
  const item = snapshot.items.find((entry) => entry.menuItemId === menuItemId);
  if (!item) {
    throw new NotFoundException("menu-item-not-found");
  }
  return item;
}

function findOptionGroup(snapshot: MenuCatalogSnapshot, optionGroupId: string): OptionGroup {
  const group = snapshot.optionGroups.find((entry) => entry.optionGroupId === optionGroupId);
  if (!group) {
    throw new NotFoundException("option-group-not-found");
  }
  return group;
}
