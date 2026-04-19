import { describe, expect, it } from "vitest";
import {
  ConfigValidationError,
  loadAccessConfig
} from "../src/identity-access/config/access-config";

describe("loadAccessConfig", () => {
  it("requires ADMIN_TELEGRAM_ID", () => {
    expect(() => loadAccessConfig({ NODE_ENV: "test", DISABLE_TG_AUTH: "true" })).toThrow(
      ConfigValidationError
    );
  });

  it("rejects production test-mode bypass", () => {
    expect(() =>
      loadAccessConfig({
        NODE_ENV: "production",
        ADMIN_TELEGRAM_ID: "1001",
        DISABLE_TG_AUTH: "true"
      })
    ).toThrow("DISABLE_TG_AUTH=true is allowed only when NODE_ENV=test.");
  });

  it("allows test-mode bypass only in test environment", () => {
    expect(
      loadAccessConfig({
        NODE_ENV: "test",
        ADMIN_TELEGRAM_ID: "1001",
        DISABLE_TG_AUTH: "true"
      })
    ).toMatchObject({
      environment: "test",
      adminTelegramId: "1001",
      disableTelegramAuth: true
    });
  });

  it("requires service bot token when Telegram auth is enabled", () => {
    expect(() =>
      loadAccessConfig({
        NODE_ENV: "production",
        ADMIN_TELEGRAM_ID: "1001"
      })
    ).toThrow("SERVICE_TELEGRAM_BOT_TOKEN is required when Telegram auth is enabled.");
  });
});
