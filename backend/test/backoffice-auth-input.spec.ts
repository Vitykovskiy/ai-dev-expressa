import "reflect-metadata";
import { describe, expect, it } from "vitest";
import { getBackofficeAuthInputFromRequest } from "../src/identity-access/auth/backoffice-auth.input";

describe("getBackofficeAuthInputFromRequest", () => {
  it("reads canonical Telegram and test-mode headers", () => {
    const input = getBackofficeAuthInputFromRequest({
      headers: {
        "x-telegram-init-data": "telegram",
        "x-test-telegram-id": ["1001", "ignored"]
      }
    } as never);

    expect(input).toEqual({
      initData: "telegram",
      testTelegramId: "1001"
    });
  });
});
