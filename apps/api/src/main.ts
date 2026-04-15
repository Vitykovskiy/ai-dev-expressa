import 'reflect-metadata';

import { createApiApp } from './app/create-app';
import {
  getApiRuntimeEnv,
  loadApiRuntimeEnvFiles,
} from './shared/config/runtime-env';

async function bootstrap(): Promise<void> {
  loadApiRuntimeEnvFiles();
  const runtimeEnv = getApiRuntimeEnv();
  const app = await createApiApp({ runtimeEnv });

  await app.listen(runtimeEnv.port);
}

void bootstrap();
