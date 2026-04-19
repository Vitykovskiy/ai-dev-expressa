import { describe, expect, it, vi } from "vitest";
import { bootstrapSession, SessionApiError } from "./session-api";

describe("bootstrapSession", () => {
  it("posts initData to the backend session endpoint", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          userId: "1",
          telegramId: "1001",
          roles: ["administrator"],
          capabilities: ["orders", "availability", "menu", "users", "settings"]
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" }
        }
      )
    );

    const actor = await bootstrapSession(
      { initData: "signed-init-data" },
      { apiBaseUrl: "http://localhost:3000", fetchImpl }
    );

    expect(fetchImpl).toHaveBeenCalledWith("http://localhost:3000/backoffice/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ initData: "signed-init-data" })
    });
    expect(actor.roles).toEqual(["administrator"]);
  });

  it("posts testTelegramId when telegram auth is bypassed on the server", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          userId: "1",
          telegramId: "1001",
          roles: ["administrator"],
          capabilities: ["orders", "availability", "menu", "users", "settings"]
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" }
        }
      )
    );

    await bootstrapSession({ testTelegramId: "1001" }, { fetchImpl });

    expect(fetchImpl).toHaveBeenCalledWith("/backoffice/auth/session", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ testTelegramId: "1001" })
    });
  });

  it("maps backend auth errors to SessionApiError", async () => {
    await expect(
      bootstrapSession(
        { initData: "bad" },
        {
          fetchImpl: vi.fn().mockResolvedValue(
            new Response(JSON.stringify({ message: "telegram-init-data-required" }), {
              status: 401,
              headers: { "content-type": "application/json" }
            })
          )
        }
      )
    ).rejects.toEqual(
      expect.objectContaining<Partial<SessionApiError>>({
        status: 401,
        code: "telegram-init-data-required"
      })
    );
  });
});
