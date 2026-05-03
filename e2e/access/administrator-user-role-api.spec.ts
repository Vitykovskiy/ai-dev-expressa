import { expect, test } from "@playwright/test";

import {
  annotateScenarioIds,
  assignUserRole,
  expectJsonMessage,
  getDefaultAdministratorActor,
  getManagedUsers,
} from "./support/access-helpers";

test.describe("administrator user role API boundary", () => {
  test("F004-SC-006 invalid role rejected", async ({ request }, testInfo) => {
    annotateScenarioIds(testInfo, ["F004-SC-006"]);

    const administratorActor = await getDefaultAdministratorActor(request);
    const usersBefore = await getManagedUsers(
      request,
      administratorActor.telegramId,
    );
    const targetUser = usersBefore[0];

    expect(
      targetUser,
      "published test-e2e users list must contain a target user",
    ).toBeTruthy();

    const rolesBefore = [...targetUser.roles];
    const response = await assignUserRole(
      request,
      targetUser.userId,
      "chef",
      administratorActor.telegramId,
    );

    expect(response.status()).toBe(400);
    await expectJsonMessage(response, "role-not-assignable");

    const usersAfter = await getManagedUsers(
      request,
      administratorActor.telegramId,
    );
    const targetAfter = usersAfter.find(
      (user) => user.userId === targetUser.userId,
    );

    expect(targetAfter?.roles).toEqual(rolesBefore);
  });
});
