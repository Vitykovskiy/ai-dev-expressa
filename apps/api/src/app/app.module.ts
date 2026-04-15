import { Module } from '@nestjs/common';

import { FoundationRuntimeModule } from '../modules/foundation-runtime/foundation-runtime.module';

@Module({
  imports: [FoundationRuntimeModule],
})
export class AppModule {}
