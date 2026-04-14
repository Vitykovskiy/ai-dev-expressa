import { Injectable } from "@nestjs/common";
import type { MenuCatalogDto, MenuCatalogResponseDto } from "@expressa/shared-types";

@Injectable()
export class MenuCatalogMapper {
  toResponse(catalog: MenuCatalogDto): MenuCatalogResponseDto {
    return {
      catalog: structuredClone(catalog)
    };
  }
}

