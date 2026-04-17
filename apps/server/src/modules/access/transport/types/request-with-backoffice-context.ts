import type { BackofficeAccessContextResponse } from '@expressa/shared-types';
import type { Request } from 'express';

export type RequestWithBackofficeContext = Request & {
  backofficeContext?: BackofficeAccessContextResponse;
};
