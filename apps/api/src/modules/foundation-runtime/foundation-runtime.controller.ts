import { Controller, Get } from '@nestjs/common';
import type { FoundationHealthResponse } from '@expressa/shared-types' with {
  "resolution-mode": "import"
};

import { FoundationRuntimeService } from './foundation-runtime.service';

@Controller('api/foundation')
export class FoundationRuntimeController {
  constructor(
    private readonly foundationRuntimeService: FoundationRuntimeService,
  ) {}

  @Get('health')
  getHealth(): FoundationHealthResponse {
    return this.foundationRuntimeService.getHealth();
  }
}
