import { DynamicModule, Global, Module } from '@nestjs/common';

import {
  API_RUNTIME_ENV,
  type ApiRuntimeEnv,
} from './runtime-env';

@Global()
@Module({})
export class RuntimeEnvModule {
  static register(runtimeEnv: ApiRuntimeEnv): DynamicModule {
    return {
      module: RuntimeEnvModule,
      exports: [API_RUNTIME_ENV],
      providers: [
        {
          provide: API_RUNTIME_ENV,
          useValue: runtimeEnv,
        },
      ],
    };
  }
}
