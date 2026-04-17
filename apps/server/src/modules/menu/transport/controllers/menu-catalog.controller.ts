import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import type {
  BackofficeMenuCatalogResponse,
  BackofficeUpdateMenuCatalogRequest,
} from '@expressa/shared-types';
import { AdministratorGuard } from '../../../access/transport/guards/administrator.guard';
import { BackofficeSessionGuard } from '../../../access/transport/guards/backoffice-session.guard';
import { MenuCatalogService } from '../../application/services/menu-catalog.service';
import { MenuCatalogDto } from '../dto/menu-catalog.dto';

@Controller('api/backoffice/menu/catalog')
@UseGuards(BackofficeSessionGuard, AdministratorGuard)
export class MenuCatalogController {
  constructor(private readonly menuCatalogService: MenuCatalogService) {}

  @Get()
  getCatalog(): Promise<BackofficeMenuCatalogResponse> {
    return this.menuCatalogService.getCatalog();
  }

  @Put()
  saveCatalog(
    @Body() request: MenuCatalogDto,
  ): Promise<BackofficeMenuCatalogResponse> {
    return this.menuCatalogService.saveCatalog(request as BackofficeUpdateMenuCatalogRequest);
  }
}
