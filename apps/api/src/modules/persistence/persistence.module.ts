import { DynamicModule, Global, Module } from "@nestjs/common";

import { APP_CONFIG, type AppConfig } from "../../config/app-config";
import { InMemoryMenuCatalogRepository } from "./in-memory/in-memory-menu-catalog.repository";
import { InMemorySlotSettingsRepository } from "./in-memory/in-memory-slot-settings.repository";
import { InMemoryUserRepository } from "./in-memory/in-memory-user.repository";
import {
  MENU_CATALOG_REPOSITORY,
  SLOT_SETTINGS_REPOSITORY,
  USER_REPOSITORY
} from "./persistence.types";
import { PrismaMenuCatalogRepository } from "./prisma/prisma-menu-catalog.repository";
import { PrismaSlotSettingsRepository } from "./prisma/prisma-slot-settings.repository";
import { PrismaUserRepository } from "./prisma/prisma-user.repository";
import { PrismaService } from "./prisma/prisma.service";

@Global()
@Module({})
export class PersistenceModule {
  static register(): DynamicModule {
    return {
      module: PersistenceModule,
      providers: [
        PrismaService,
        InMemoryUserRepository,
        InMemoryMenuCatalogRepository,
        InMemorySlotSettingsRepository,
        PrismaUserRepository,
        PrismaMenuCatalogRepository,
        PrismaSlotSettingsRepository,
        {
          provide: USER_REPOSITORY,
          inject: [APP_CONFIG, InMemoryUserRepository, PrismaUserRepository],
          useFactory: (
            config: AppConfig,
            memoryRepository: InMemoryUserRepository,
            prismaRepository: PrismaUserRepository
          ) => (config.persistenceDriver === "memory" ? memoryRepository : prismaRepository)
        },
        {
          provide: MENU_CATALOG_REPOSITORY,
          inject: [APP_CONFIG, InMemoryMenuCatalogRepository, PrismaMenuCatalogRepository],
          useFactory: (
            config: AppConfig,
            memoryRepository: InMemoryMenuCatalogRepository,
            prismaRepository: PrismaMenuCatalogRepository
          ) => (config.persistenceDriver === "memory" ? memoryRepository : prismaRepository)
        },
        {
          provide: SLOT_SETTINGS_REPOSITORY,
          inject: [APP_CONFIG, InMemorySlotSettingsRepository, PrismaSlotSettingsRepository],
          useFactory: (
            config: AppConfig,
            memoryRepository: InMemorySlotSettingsRepository,
            prismaRepository: PrismaSlotSettingsRepository
          ) => (config.persistenceDriver === "memory" ? memoryRepository : prismaRepository)
        }
      ],
      exports: [USER_REPOSITORY, MENU_CATALOG_REPOSITORY, SLOT_SETTINGS_REPOSITORY]
    };
  }
}
