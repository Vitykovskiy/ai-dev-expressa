import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import type { UpdateMenuCatalogRequestDto } from "@expressa/shared-types";

import { CurrentActor } from "../../common/auth/current-actor";
import { BackofficeAuthGuard } from "../../common/auth/backoffice-auth.guard";
import type { AuthenticatedActor } from "../auth-session/auth-session.service";
import { MenuCatalogService } from "./menu-catalog.service";

@Controller("menu")
@UseGuards(BackofficeAuthGuard)
export class MenuCatalogController {
  constructor(private readonly menuCatalogService: MenuCatalogService) {}

  @Get()
  getCatalog(@CurrentActor() actor: AuthenticatedActor) {
    return this.menuCatalogService.getCatalog(actor);
  }

  @Put()
  saveCatalog(
    @CurrentActor() actor: AuthenticatedActor,
    @Body() request: UpdateMenuCatalogRequestDto
  ) {
    return this.menuCatalogService.saveCatalog(actor, request);
  }
}

