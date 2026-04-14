import { Inject, Injectable } from "@nestjs/common";
import type {
  MenuCatalogResponseDto,
  UpdateMenuCatalogRequestDto
} from "@expressa/shared-types";

import { DomainError } from "../../common/errors/domain-error";
import type { AuthenticatedActor } from "../auth-session/auth-session.service";
import {
  MENU_CATALOG_REPOSITORY,
  type MenuCatalogRepository
} from "../persistence/persistence.types";
import { MenuCatalogMapper } from "./menu-catalog.mapper";
import { MenuCatalogValidator } from "./menu-catalog.validator";

@Injectable()
export class MenuCatalogService {
  constructor(
    @Inject(MENU_CATALOG_REPOSITORY) private readonly menuCatalogRepository: MenuCatalogRepository,
    private readonly menuCatalogValidator: MenuCatalogValidator,
    private readonly menuCatalogMapper: MenuCatalogMapper
  ) {}

  async getCatalog(actor: AuthenticatedActor): Promise<MenuCatalogResponseDto> {
    this.ensureAdministrator(actor);
    const catalog = await this.menuCatalogRepository.get();
    return this.menuCatalogMapper.toResponse(catalog);
  }

  async saveCatalog(
    actor: AuthenticatedActor,
    request: UpdateMenuCatalogRequestDto
  ): Promise<MenuCatalogResponseDto> {
    this.ensureAdministrator(actor);
    this.menuCatalogValidator.validate(request.catalog);
    const saved = await this.menuCatalogRepository.save(request.catalog);
    return this.menuCatalogMapper.toResponse(saved);
  }

  private ensureAdministrator(actor: AuthenticatedActor): void {
    if (!actor.user.roles.includes("administrator")) {
      throw new DomainError(
        "administrator-role-required",
        403,
        "Administrator role is required to manage menu"
      );
    }
  }
}

