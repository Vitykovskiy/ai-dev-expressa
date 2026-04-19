import {
  DrinkSizePrice,
  MenuItemType,
  OptionSelectionMode
} from "./domain/menu-catalog.types";

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
