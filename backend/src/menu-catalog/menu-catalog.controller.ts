import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  BackofficeAuthGuard,
  RequireBackofficeCapability,
} from "../identity-access/auth/backoffice-auth.guard";
import {
  MenuCatalogSnapshot,
  MenuCategory,
  MenuItem,
  OptionGroup,
} from "./domain/menu-catalog.types";
import {
  CreateCategoryInput,
  CreateItemInput,
  CreateOptionGroupInput,
  UpdateCategoryInput,
  UpdateItemInput,
  UpdateOptionGroupInput,
} from "./menu-catalog.commands";
import { MenuCatalogService } from "./menu-catalog.service";

@Controller("backoffice/menu")
@UseGuards(BackofficeAuthGuard)
@RequireBackofficeCapability("menu")
export class MenuCatalogController {
  constructor(
    @Inject(MenuCatalogService)
    private readonly menuCatalog: MenuCatalogService,
  ) {}

  @Get("catalog")
  async getCatalog(): Promise<MenuCatalogSnapshot> {
    return this.menuCatalog.getCatalog();
  }

  @Post("categories")
  async createCategory(
    @Body() body: CreateCategoryInput,
  ): Promise<MenuCategory> {
    return this.menuCatalog.createCategory(body);
  }

  @Patch("categories/:menuCategoryId")
  async updateCategory(
    @Param("menuCategoryId") menuCategoryId: string,
    @Body() body: UpdateCategoryInput,
  ): Promise<MenuCategory> {
    return this.menuCatalog.updateCategory(menuCategoryId, body);
  }

  @Delete("categories/:menuCategoryId")
  async deleteCategory(
    @Param("menuCategoryId") menuCategoryId: string,
  ): Promise<MenuCatalogSnapshot> {
    return this.menuCatalog.deleteCategory(menuCategoryId);
  }

  @Post("items")
  async createItem(@Body() body: CreateItemInput): Promise<MenuItem> {
    return this.menuCatalog.createItem(body);
  }

  @Patch("items/:menuItemId")
  async updateItem(
    @Param("menuItemId") menuItemId: string,
    @Body() body: UpdateItemInput,
  ): Promise<MenuItem> {
    return this.menuCatalog.updateItem(menuItemId, body);
  }

  @Delete("items/:menuItemId")
  async deleteItem(
    @Param("menuItemId") menuItemId: string,
  ): Promise<MenuCatalogSnapshot> {
    return this.menuCatalog.deleteItem(menuItemId);
  }

  @Post("option-groups")
  async createOptionGroup(
    @Body() body: CreateOptionGroupInput,
  ): Promise<OptionGroup> {
    return this.menuCatalog.createOptionGroup(body);
  }

  @Patch("option-groups/:optionGroupId")
  async updateOptionGroup(
    @Param("optionGroupId") optionGroupId: string,
    @Body() body: UpdateOptionGroupInput,
  ): Promise<OptionGroup> {
    return this.menuCatalog.updateOptionGroup(optionGroupId, body);
  }

  @Delete("option-groups/:optionGroupId")
  async deleteOptionGroup(
    @Param("optionGroupId") optionGroupId: string,
  ): Promise<MenuCatalogSnapshot> {
    return this.menuCatalog.deleteOptionGroup(optionGroupId);
  }
}
