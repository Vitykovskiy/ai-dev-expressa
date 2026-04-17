import { Module } from '@nestjs/common';
import { AccessModule } from '../access/access.module';
import { MenuCatalogService } from './application/services/menu-catalog.service';
import { MenuCatalogRepositoryPort } from './domain/ports/menu-catalog.repository.port';
import { InMemoryMenuCatalogRepository } from './infrastructure/persistence/in-memory-menu-catalog.repository';
import { MenuCatalogController } from './transport/controllers/menu-catalog.controller';

@Module({
  imports: [AccessModule],
  controllers: [MenuCatalogController],
  providers: [
    InMemoryMenuCatalogRepository,
    MenuCatalogService,
    {
      provide: MenuCatalogRepositoryPort,
      useExisting: InMemoryMenuCatalogRepository,
    },
  ],
})
export class MenuModule {}
