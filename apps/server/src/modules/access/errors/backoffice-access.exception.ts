import { HttpException } from '@nestjs/common';
import type {
  BackofficeAccessDeniedResponse,
  BackofficeAccessDenyReason,
} from '@expressa/shared-types';

export class BackofficeAccessException extends HttpException {
  constructor(reason: BackofficeAccessDenyReason, statusCode: number, message: string = reason) {
    const payload: BackofficeAccessDeniedResponse = {
      statusCode,
      reason,
      message,
    };

    super(payload, statusCode);
  }
}
