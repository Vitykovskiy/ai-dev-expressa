import { Injectable } from '@nestjs/common';
import type { FoundationHealthResponse } from '@expressa/shared-types' with {
  "resolution-mode": "import"
};

@Injectable()
export class FoundationRuntimeService {
  getHealth(): FoundationHealthResponse {
    return {
      status: 'ok',
      service: 'api',
    };
  }
}
