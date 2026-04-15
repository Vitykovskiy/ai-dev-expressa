import { INestApplication, LogLevel } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ApiRuntimeEnv } from '../shared/config/runtime-env';

export interface CreateApiAppOptions {
  logger?: LogLevel[];
  runtimeEnv: ApiRuntimeEnv;
}

export async function createApiApp(
  options: CreateApiAppOptions,
): Promise<INestApplication> {
  const app = await NestFactory.create(AppModule.register(options.runtimeEnv), {
    logger: options.logger ?? ['log', 'error', 'warn'],
  });

  app.enableCors({
    origin: options.runtimeEnv.corsAllowedOrigin,
  });

  return app;
}
