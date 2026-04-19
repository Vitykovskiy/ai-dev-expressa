import "reflect-metadata";
import { describe, expect, it } from "vitest";
import { toAuthenticatedActor } from "../src/identity-access/domain/authenticated-actor";
import { createUser } from "../src/identity-access/domain/user";

describe("toAuthenticatedActor", () => {
  it("maps backend roles to canonical backoffice capabilities", () => {
    const actor = toAuthenticatedActor(
      createUser({
        telegramId: "1001",
        roles: ["administrator", "barista"],
      }),
    );

    expect(actor).toMatchObject({
      telegramId: "1001",
      roles: ["administrator", "barista"],
      capabilities: ["orders", "availability", "menu", "users", "settings"],
    });
  });
});
