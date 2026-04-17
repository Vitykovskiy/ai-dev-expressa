import type {
  BackofficeAccessDeniedResponse,
  BackofficeAccessDenyReason,
} from '@expressa/shared-types';
import { ApplicationException } from '../../../../common/errors/application.exception';

export class BackofficeAccessError extends ApplicationException {
  constructor(reason: BackofficeAccessDenyReason, statusCode: number, message: string = reason) {
    const payload: BackofficeAccessDeniedResponse = {
      statusCode,
      reason,
      message,
    };

    super(statusCode, payload);
  }
}
