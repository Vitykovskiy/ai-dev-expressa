import { Inject, Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

import {
  API_RUNTIME_ENV,
  type ApiRuntimeEnv,
} from '../config/runtime-env';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(
    @Inject(API_RUNTIME_ENV) runtimeEnv: ApiRuntimeEnv,
  ) {
    super({
      adapter: new PrismaPg({
        connectionString: runtimeEnv.databaseUrl,
      }),
    });
  }
}
