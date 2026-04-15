import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const REPO_ROOT = fileURLToPath(new URL('../../../', import.meta.url));
const NPM_COMMAND = 'npm';
const DEFAULT_API_PORT = '3100';
const DEFAULT_BACKOFFICE_ORIGIN = 'http://127.0.0.1:5173';
const DEFAULT_ADMIN_TELEGRAM_ID = '1001';
const DEFAULT_DISABLE_TG_AUTH = 'true';
const DEFAULT_DATABASE_URL =
  'postgresql://expressa:expressa@127.0.0.1:5432/expressa?schema=public';
const DEFAULT_BACKOFFICE_BOT_TOKEN = '000000:foundation-placeholder';

function parsePort(rawValue) {
  const parsedValue = Number.parseInt(rawValue, 10);

  if (!Number.isInteger(parsedValue) || parsedValue <= 0) {
    throw new Error(`Invalid API_PORT value: ${rawValue}`);
  }

  return parsedValue;
}

export function getFoundationRuntimeConfig(env = process.env) {
  const apiPort = parsePort(env.API_PORT ?? DEFAULT_API_PORT);
  const backofficeOrigin = env.API_CORS_ALLOWED_ORIGIN ?? DEFAULT_BACKOFFICE_ORIGIN;
  const apiBaseUrl = env.VITE_API_BASE_URL ?? `http://127.0.0.1:${apiPort}`;

  return {
    api: {
      ADMIN_TELEGRAM_ID: env.ADMIN_TELEGRAM_ID ?? DEFAULT_ADMIN_TELEGRAM_ID,
      API_CORS_ALLOWED_ORIGIN: backofficeOrigin,
      API_PORT: String(apiPort),
      DATABASE_URL: env.DATABASE_URL ?? DEFAULT_DATABASE_URL,
      DISABLE_TG_AUTH: env.DISABLE_TG_AUTH ?? DEFAULT_DISABLE_TG_AUTH,
      TG_BACKOFFICE_BOT_TOKEN:
        env.TG_BACKOFFICE_BOT_TOKEN ?? DEFAULT_BACKOFFICE_BOT_TOKEN,
    },
    backoffice: {
      VITE_API_BASE_URL: apiBaseUrl,
    },
    urls: {
      apiBaseUrl,
      apiHealth: `${apiBaseUrl}/api/foundation/health`,
      backofficeOrigin,
    },
  };
}

export function spawnNpm(args, options = {}) {
  const spawnOptions = {
    cwd: REPO_ROOT,
    env: {
      ...process.env,
      ...(options.envOverrides ?? {}),
    },
    shell: false,
    stdio: options.stdio ?? 'inherit',
  };

  const child =
    process.platform === 'win32'
      ? spawn(
          process.env.ComSpec ?? 'cmd.exe',
          ['/d', '/s', '/c', [NPM_COMMAND, ...args].join(' ')],
          spawnOptions,
        )
      : spawn(NPM_COMMAND, args, spawnOptions);

  return child;
}

export function waitForExit(child, label) {
  return new Promise((resolve, reject) => {
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(
        new Error(
          `${label} exited with ${code ?? 'null'}${signal ? ` (signal ${signal})` : ''}`,
        ),
      );
    });
  });
}

export async function runNpm(args, label, options = {}) {
  const child = spawnNpm(args, options);
  await waitForExit(child, label);
}

export async function waitForHttp(url, validate, timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError = new Error(`Timed out waiting for ${url}`);

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);

      if (validate) {
        await validate(response);
      } else if (!response.ok) {
        throw new Error(`${url} returned ${response.status}`);
      }

      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });
    }
  }

  throw lastError;
}

export async function stopChild(child) {
  if (!child || child.exitCode !== null || child.killed) {
    return;
  }

  child.kill('SIGTERM');

  await new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      if (child.exitCode === null && !child.killed) {
        child.kill('SIGKILL');
      }
    }, 5_000);

    child.once('exit', () => {
      clearTimeout(timeoutId);
      resolve();
    });
  });
}

export async function validateFoundationHealthResponse(response) {
  if (!response.ok) {
    throw new Error(`Foundation health returned ${response.status}`);
  }

  const payload = await response.json();

  if (payload?.status !== 'ok' || payload?.service !== 'api') {
    throw new Error('Foundation health returned an unexpected payload');
  }
}

export async function validateBackofficeRoot(response) {
  if (!response.ok) {
    throw new Error(`Backoffice web returned ${response.status}`);
  }

  const html = await response.text();

  if (!html.includes('<div id="app"></div>')) {
    throw new Error('Backoffice web root did not return the Vite shell');
  }
}
