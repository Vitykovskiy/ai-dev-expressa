import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import type { MenuCatalogSnapshot } from '@expressa/shared-types';
import { MenuCatalogError } from '../errors/menu-catalog.error';
import { InvalidDrinkSizeModelError } from '../../domain/errors/invalid-drink-size-model.error';
import { InvalidOptionGroupRuleError } from '../../domain/errors/invalid-option-group-rule.error';
import { type MenuCatalog, toMenuCatalogSnapshot } from '../../domain/models/menu-catalog';
import {
  normalizeMenuCatalog,
  validateMenuCatalog,
} from '../../domain/policies/menu-catalog.policy';
import { MenuCatalogRepositoryPort } from '../../domain/ports/menu-catalog.repository.port';

@Injectable()
export class MenuCatalogService {
  constructor(
    @Inject(MenuCatalogRepositoryPort)
    private readonly repository: MenuCatalogRepositoryPort,
  ) {}

  async getCatalog(): Promise<MenuCatalogSnapshot> {
    const snapshot = await this.repository.getSnapshot();
    return toMenuCatalogSnapshot(snapshot);
  }

  async saveCatalog(snapshot: MenuCatalogSnapshot): Promise<MenuCatalogSnapshot> {
    try {
      const normalized = normalizeMenuCatalog(snapshot);
      validateMenuCatalog(normalized);

      const saved = await this.repository.saveSnapshot(normalized as MenuCatalog);
      return toMenuCatalogSnapshot(saved);
    } catch (error) {
      if (error instanceof InvalidDrinkSizeModelError) {
        throw new MenuCatalogError(
          'invalid-drink-size-model',
          HttpStatus.UNPROCESSABLE_ENTITY,
          error.message,
        );
      }

      if (error instanceof InvalidOptionGroupRuleError) {
        throw new MenuCatalogError(
          'invalid-option-group-rule',
          HttpStatus.UNPROCESSABLE_ENTITY,
          error.message,
        );
      }

      throw error;
    }
  }
}
