import type { MenuCatalogErrorReason, MenuCatalogErrorResponse } from '@expressa/shared-types';
import { ApplicationException } from '../../../../common/errors/application.exception';

export class MenuCatalogError extends ApplicationException {
  constructor(reason: MenuCatalogErrorReason, statusCode: number, message: string = reason) {
    const payload: MenuCatalogErrorResponse = {
      statusCode,
      reason,
      message,
    };

    super(statusCode, payload);
  }
}
