import type { Page } from '@playwright/test';

export async function injectTelegramWebApp(page: Page, initData: string): Promise<void> {
  await page.addInitScript(
    (payload) => {
      (window as Window & {
        Telegram?: {
          WebApp?: {
            expand?: () => void;
            initData?: string;
            ready?: () => void;
          };
        };
      }).Telegram = {
        WebApp: {
          initData: payload.initData,
          ready: () => undefined,
          expand: () => undefined,
        },
      };
    },
    { initData },
  );
}
