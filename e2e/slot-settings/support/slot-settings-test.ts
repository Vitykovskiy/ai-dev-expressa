import { expect, test as base } from "@playwright/test";

import { acquireSlotSettingsLock } from "./slot-settings-lock";

export const test = base.extend<{ readonly slotSettingsLock: void }>({
  slotSettingsLock: [
    async ({}, use) => {
      const release = await acquireSlotSettingsLock();
      try {
        await use();
      } finally {
        await release();
      }
    },
    { auto: true },
  ],
});

export { expect };
