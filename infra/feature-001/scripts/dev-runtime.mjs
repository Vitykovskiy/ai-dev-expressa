import {
  getFoundationRuntimeConfig,
  spawnNpm,
  stopChild,
  validateBackofficeRoot,
  validateFoundationHealthResponse,
  waitForExit,
  waitForHttp,
} from './shared.mjs';

const runtime = getFoundationRuntimeConfig();

const apiProcess = spawnNpm(['run', 'dev', '--workspace', '@expressa/api'], {
  envOverrides: runtime.api,
});

const backofficeProcess = spawnNpm(
  [
    'run',
    'dev',
    '--workspace',
    '@expressa/backoffice-web',
    '--',
    '--host',
    '127.0.0.1',
    '--port',
    '5173',
    '--strictPort',
  ],
  {
    envOverrides: runtime.backoffice,
  },
);

let shuttingDown = false;

async function shutdown() {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  await Promise.allSettled([
    stopChild(backofficeProcess),
    stopChild(apiProcess),
  ]);
}

process.once('SIGINT', () => {
  void shutdown();
});

process.once('SIGTERM', () => {
  void shutdown();
});

try {
  await waitForHttp(runtime.urls.apiHealth, validateFoundationHealthResponse);
  await waitForHttp(runtime.urls.backofficeOrigin, validateBackofficeRoot);

  console.log('FEATURE-001 runtime is ready');
  console.log(`Backoffice: ${runtime.urls.backofficeOrigin}`);
  console.log(`API health: ${runtime.urls.apiHealth}`);

  await Promise.race([
    waitForExit(apiProcess, 'FEATURE-001 api runtime'),
    waitForExit(backofficeProcess, 'FEATURE-001 backoffice runtime'),
  ]);
} finally {
  await shutdown();
}
