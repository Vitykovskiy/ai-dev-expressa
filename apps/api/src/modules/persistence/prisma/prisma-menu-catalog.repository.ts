import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import type { MenuCatalogDto } from "@expressa/shared-types";

import type { MenuCatalogRepository } from "../persistence.types";
import { PrismaService } from "./prisma.service";

const emptyCatalog = (): MenuCatalogDto => ({
  categories: [],
  items: [],
  optionGroups: []
});

@Injectable()
export class PrismaMenuCatalogRepository implements MenuCatalogRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async get(): Promise<MenuCatalogDto> {
    const state = await this.prismaService.menuCatalogState.findUnique({
      where: { id: 1 }
    });

    if (!state) {
      return emptyCatalog();
    }

    return structuredClone(state.snapshot as unknown as MenuCatalogDto);
  }

  async save(catalog: MenuCatalogDto): Promise<MenuCatalogDto> {
    await this.prismaService.menuCatalogState.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        snapshot: catalog as unknown as Prisma.InputJsonValue
      },
      update: {
        snapshot: catalog as unknown as Prisma.InputJsonValue
      }
    });

    return structuredClone(catalog);
  }
}
