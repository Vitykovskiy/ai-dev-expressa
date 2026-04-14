import { Module } from "@nestjs/common";

import { AuthSessionModule } from "../auth-session/auth-session.module";
import { MenuCatalogController } from "./menu-catalog.controller";
import { MenuCatalogMapper } from "./menu-catalog.mapper";
import { MenuCatalogService } from "./menu-catalog.service";
import { MenuCatalogValidator } from "./menu-catalog.validator";

@Module({
  imports: [AuthSessionModule],
  controllers: [MenuCatalogController],
  providers: [MenuCatalogValidator, MenuCatalogMapper, MenuCatalogService]
})
export class MenuCatalogModule {}

