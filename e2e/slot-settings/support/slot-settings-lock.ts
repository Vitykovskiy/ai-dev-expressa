import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const LOCK_DIR = path.join(
  process.cwd(),
  "test-results",
  ".slot-settings.lock",
);
const LOCK_RETRY_MS = 100;
const LOCK_TIMEOUT_MS = 30_000;

export async function acquireSlotSettingsLock(): Promise<() => Promise<void>> {
  const start = Date.now();

  while (true) {
    try {
      await mkdir(LOCK_DIR, { recursive: false });
      await writeFile(
        path.join(LOCK_DIR, "owner.json"),
        JSON.stringify({
          pid: process.pid,
          acquiredAt: new Date().toISOString(),
        }),
      );
      return async () => {
        await rm(LOCK_DIR, { force: true, recursive: true });
      };
    } catch (error) {
      if (!isAlreadyExistsError(error)) {
        throw error;
      }

      if (Date.now() - start > LOCK_TIMEOUT_MS) {
        throw new Error("Timed out waiting for slot settings e2e lock.");
      }

      await new Promise((resolve) => setTimeout(resolve, LOCK_RETRY_MS));
    }
  }
}

function isAlreadyExistsError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "EEXIST"
  );
}
