import { Module } from "@nestjs/common";
import { IdentityAccessModule } from "../identity-access/identity-access.module";
import { MenuCatalogValidator } from "./domain/menu-catalog.validator";
import { MenuCatalogController } from "./menu-catalog.controller";
import { MenuCatalogService } from "./menu-catalog.service";
import { InMemoryMenuCatalogRepository } from "./repository/in-memory-menu-catalog.repository";
import { MENU_CATALOG_REPOSITORY } from "./repository/menu-catalog.repository";

@Module({
  imports: [IdentityAccessModule],
  controllers: [MenuCatalogController],
  providers: [
    MenuCatalogValidator,
    MenuCatalogService,
    {
      provide: MENU_CATALOG_REPOSITORY,
      useClass: InMemoryMenuCatalogRepository,
    },
  ],
  exports: [MenuCatalogService],
})
export class MenuCatalogModule {}
