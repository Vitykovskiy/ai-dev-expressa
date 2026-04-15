import {
  getFoundationRuntimeConfig,
  runNpm,
  spawnNpm,
  stopChild,
  validateBackofficeRoot,
  validateFoundationHealthResponse,
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

try {
  await waitForHttp(runtime.urls.apiHealth, validateFoundationHealthResponse);
  await waitForHttp(runtime.urls.backofficeOrigin, validateBackofficeRoot);

  await runNpm(
    [
      'run',
      'smoke',
      '--workspace',
      '@expressa/backoffice-web',
    ],
    'FEATURE-001 frontend smoke',
    {
      envOverrides: runtime.backoffice,
    },
  );
} finally {
  await Promise.allSettled([
    stopChild(backofficeProcess),
    stopChild(apiProcess),
  ]);
}
