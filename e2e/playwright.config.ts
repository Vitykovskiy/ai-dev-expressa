import { defineConfig, devices } from "@playwright/test";

const chromiumExecutablePath =
  process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?.trim() || undefined;

export default defineConfig({
  testDir: ".",
  outputDir: process.env.PLAYWRIGHT_TEST_RESULTS_DIR ?? "test-results",
  reporter: [
    ["list"],
    [
      "html",
      {
        open: "never",
        outputFolder: process.env.PLAYWRIGHT_HTML_REPORT ?? "playwright-report",
      },
    ],
  ],
  use: {
    baseURL:
      process.env.E2E_BASE_URL ?? "https://expressa-e2e-test.vitykovskiy.ru",
    launchOptions: chromiumExecutablePath
      ? {
          executablePath: chromiumExecutablePath,
          args: ["--no-sandbox"],
        }
      : undefined,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
