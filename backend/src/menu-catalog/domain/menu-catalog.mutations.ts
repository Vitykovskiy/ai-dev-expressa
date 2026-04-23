import { NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  MenuCatalogSnapshot,
  MenuCategory,
  MenuItem,
  MenuOption,
  OptionGroup,
} from "./menu-catalog.types";
import {
  MenuCategoryHasItemsError,
  OptionGroupInUseError,
} from "./menu-catalog.errors";
import {
  CreateCategoryInput,
  CreateItemInput,
  CreateOptionGroupInput,
  OptionInput,
  UpdateCategoryInput,
  UpdateItemInput,
  UpdateOptionGroupInput,
} from "../menu-catalog.commands";

export function createCategory(input: CreateCategoryInput): MenuCategory {
  return {
    menuCategoryId: randomUUID(),
    name: input.name,
    optionGroupRefs: input.optionGroupRefs ?? [],
  };
}

export function updateCategory(
  category: MenuCategory,
  input: UpdateCategoryInput,
): MenuCategory {
  return {
    ...category,
    name: input.name ?? category.name,
    optionGroupRefs: input.optionGroupRefs ?? category.optionGroupRefs,
  };
}

export function removeCategory(
  snapshot: MenuCatalogSnapshot,
  menuCategoryId: string,
): MenuCatalogSnapshot {
  assertCategoryExists(snapshot, menuCategoryId);

  if (snapshot.items.some((item) => item.menuCategoryId === menuCategoryId)) {
    throw new MenuCategoryHasItemsError();
  }

  return {
    ...snapshot,
    categories: snapshot.categories.filter(
      (category) => category.menuCategoryId !== menuCategoryId,
    ),
  };
}

export function createItem(input: CreateItemInput): MenuItem {
  return {
    menuItemId: randomUUID(),
    menuCategoryId: input.menuCategoryId,
    name: input.name,
    itemType: input.itemType,
    basePrice: input.basePrice ?? 0,
    availability: input.availability ?? true,
    drinkSizePrices: input.drinkSizePrices ?? [],
  };
}

export function updateItem(item: MenuItem, input: UpdateItemInput): MenuItem {
  return {
    ...item,
    menuCategoryId: input.menuCategoryId ?? item.menuCategoryId,
    name: input.name ?? item.name,
    itemType: input.itemType ?? item.itemType,
    basePrice: input.basePrice ?? item.basePrice,
    availability: input.availability ?? item.availability,
    drinkSizePrices: input.drinkSizePrices ?? item.drinkSizePrices,
  };
}

export function removeItem(
  snapshot: MenuCatalogSnapshot,
  menuItemId: string,
): MenuCatalogSnapshot {
  findItem(snapshot, menuItemId);
  return {
    ...snapshot,
    items: snapshot.items.filter((item) => item.menuItemId !== menuItemId),
  };
}

export function createOptionGroup(input: CreateOptionGroupInput): OptionGroup {
  const optionGroupId = randomUUID();
  return {
    optionGroupId,
    name: input.name,
    selectionMode: input.selectionMode,
    options: toOptions(optionGroupId, input.options ?? []),
  };
}

export function updateOptionGroup(
  group: OptionGroup,
  input: UpdateOptionGroupInput,
): OptionGroup {
  return {
    ...group,
    name: input.name ?? group.name,
    selectionMode: input.selectionMode ?? group.selectionMode,
    options: input.options
      ? toOptions(group.optionGroupId, input.options)
      : group.options,
  };
}

export function removeOptionGroup(
  snapshot: MenuCatalogSnapshot,
  optionGroupId: string,
): MenuCatalogSnapshot {
  findOptionGroup(snapshot, optionGroupId);

  if (
    snapshot.categories.some((category) =>
      category.optionGroupRefs.includes(optionGroupId),
    )
  ) {
    throw new OptionGroupInUseError();
  }

  return {
    ...snapshot,
    optionGroups: snapshot.optionGroups.filter(
      (group) => group.optionGroupId !== optionGroupId,
    ),
  };
}

export function findCategory(
  snapshot: MenuCatalogSnapshot,
  menuCategoryId: string,
): MenuCategory {
  return assertCategoryExists(snapshot, menuCategoryId);
}

export function findItem(
  snapshot: MenuCatalogSnapshot,
  menuItemId: string,
): MenuItem {
  const item = snapshot.items.find((entry) => entry.menuItemId === menuItemId);
  if (!item) {
    throw new NotFoundException("menu-item-not-found");
  }

  return item;
}

export function findOptionGroup(
  snapshot: MenuCatalogSnapshot,
  optionGroupId: string,
): OptionGroup {
  const group = snapshot.optionGroups.find(
    (entry) => entry.optionGroupId === optionGroupId,
  );
  if (!group) {
    throw new NotFoundException("option-group-not-found");
  }

  return group;
}

function assertCategoryExists(
  snapshot: MenuCatalogSnapshot,
  menuCategoryId: string,
): MenuCategory {
  const category = snapshot.categories.find(
    (entry) => entry.menuCategoryId === menuCategoryId,
  );
  if (!category) {
    throw new NotFoundException("menu-category-not-found");
  }

  return category;
}

function toOptions(
  optionGroupId: string,
  inputs: readonly OptionInput[],
): MenuOption[] {
  return inputs.map((input) => ({
    optionId: input.optionId ?? randomUUID(),
    optionGroupId,
    name: input.name,
    priceDelta: input.priceDelta ?? 0,
    availability: input.availability ?? true,
  }));
}
