import { DynamicModule, Module } from '@nestjs/common';

import { AuthSessionModule } from '../modules/auth-session/auth-session.module';
import { FoundationRuntimeModule } from '../modules/foundation-runtime/foundation-runtime.module';
import { IdentityAccessModule } from '../modules/identity-access/identity-access.module';
import { type ApiRuntimeEnv } from '../shared/config/runtime-env';
import { RuntimeEnvModule } from '../shared/config/runtime-env.module';

@Module({})
export class AppModule {
  static register(runtimeEnv: ApiRuntimeEnv): DynamicModule {
    return {
      module: AppModule,
      imports: [
        RuntimeEnvModule.register(runtimeEnv),
        FoundationRuntimeModule,
        IdentityAccessModule,
        AuthSessionModule,
      ],
    };
  }
}
