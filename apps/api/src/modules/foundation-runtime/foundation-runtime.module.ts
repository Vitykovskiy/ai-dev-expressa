import { Module } from '@nestjs/common';

import { FoundationRuntimeController } from './foundation-runtime.controller';
import { FoundationRuntimeService } from './foundation-runtime.service';

@Module({
  controllers: [FoundationRuntimeController],
  providers: [FoundationRuntimeService],
})
export class FoundationRuntimeModule {}
