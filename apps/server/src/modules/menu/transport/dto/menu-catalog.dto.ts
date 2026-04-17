import { Type, Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import type {
  BackofficeUpdateMenuCatalogRequest,
  DrinkSize,
  MenuCatalogCategory,
  MenuCatalogDrinkSizePrice,
  MenuCatalogItem,
  MenuCatalogItemType,
  MenuCatalogOption,
  MenuCatalogOptionGroup,
  OptionGroupSelectionMode,
} from '@expressa/shared-types';

const trimString = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const parseNullableNumber = ({ value }: { value: unknown }) => {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  return Number(value);
};

export class MenuCatalogDrinkSizePriceDto implements MenuCatalogDrinkSizePrice {
  @IsIn(['S', 'M', 'L'])
  size!: DrinkSize;

  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  price!: number;
}

export class MenuCatalogOptionDto implements MenuCatalogOption {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  optionId!: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  name!: string;

  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  priceDelta!: number;
}

export class MenuCatalogOptionGroupDto implements MenuCatalogOptionGroup {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  optionGroupId!: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn(['single', 'multiple'])
  selectionMode!: OptionGroupSelectionMode;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuCatalogOptionDto)
  options!: MenuCatalogOptionDto[];
}

export class MenuCatalogCategoryDto implements MenuCatalogCategory {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  menuCategoryId!: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsArray()
  @ArrayUnique()
  @IsString({ each: true })
  optionGroupRefs!: string[];
}

export class MenuCatalogItemDto implements MenuCatalogItem {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  menuItemId!: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  menuCategoryId!: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsIn(['product', 'drink'])
  itemType!: MenuCatalogItemType;

  @Transform(parseNullableNumber)
  @ValidateIf((value: MenuCatalogItemDto) => value.basePrice !== null && value.basePrice !== undefined)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  basePrice!: number | null;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuCatalogDrinkSizePriceDto)
  sizePrices!: MenuCatalogDrinkSizePriceDto[];
}

export class MenuCatalogDto implements BackofficeUpdateMenuCatalogRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuCatalogCategoryDto)
  categories!: MenuCatalogCategoryDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuCatalogItemDto)
  items!: MenuCatalogItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MenuCatalogOptionGroupDto)
  optionGroups!: MenuCatalogOptionGroupDto[];
}
