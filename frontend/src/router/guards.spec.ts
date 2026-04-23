import { describe, expect, it } from "vitest";
import { resolveGuardDecision } from "@/router/guards";
import type { AuthenticatedActor } from "@/modules/auth/types";

const administrator: AuthenticatedActor = {
  userId: "1",
  telegramId: "1001",
  roles: ["administrator"],
  capabilities: ["orders", "availability", "menu", "users", "settings"],
};

const barista: AuthenticatedActor = {
  userId: "2",
  telegramId: "1002",
  roles: ["barista"],
  capabilities: ["orders", "availability"],
};

describe("resolveGuardDecision", () => {
  it("redirects unauthenticated access to entry-denied", () => {
    expect(
      resolveGuardDecision(
        {
          meta: { capability: "orders" },
        } as never,
        null,
      ),
    ).toEqual({ kind: "redirect", name: "entry-denied" });
  });

  it("allows administrator into administrator route", () => {
    expect(
      resolveGuardDecision(
        {
          meta: { capability: "users" },
        } as never,
        administrator,
      ),
    ).toEqual({ kind: "allow" });
  });

  it("redirects barista away from administrator route", () => {
    expect(
      resolveGuardDecision(
        {
          meta: { capability: "users" },
        } as never,
        barista,
      ),
    ).toEqual({ kind: "redirect", name: "forbidden" });
  });

  it("allows menu route only when actor has menu capability", () => {
    expect(
      resolveGuardDecision(
        {
          meta: { capability: "menu" },
        } as never,
        administrator,
      ),
    ).toEqual({ kind: "allow" });

    expect(
      resolveGuardDecision(
        {
          meta: { capability: "menu" },
        } as never,
        barista,
      ),
    ).toEqual({ kind: "redirect", name: "forbidden" });
  });
});
