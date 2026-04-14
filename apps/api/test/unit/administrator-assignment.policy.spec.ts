import { AdministratorAssignmentPolicy } from "../../src/modules/identity-access/administrator-assignment.policy";

describe("AdministratorAssignmentPolicy", () => {
  it("allows bootstrap administrator to promote another administrator", () => {
    const policy = new AdministratorAssignmentPolicy({
      administratorPromotionMode: "bootstrap-only"
    } as never);

    expect(() =>
      policy.assertCanAssignRole(
        {
          userId: "1",
          telegramId: "100",
          roles: ["administrator"],
          blocked: false,
          isBootstrapAdministrator: true
        },
        "administrator"
      )
    ).not.toThrow();
  });

  it("rejects administrator promotion for non-bootstrap administrator in bootstrap-only mode", () => {
    const policy = new AdministratorAssignmentPolicy({
      administratorPromotionMode: "bootstrap-only"
    } as never);

    expect(() =>
      policy.assertCanAssignRole(
        {
          userId: "1",
          telegramId: "200",
          roles: ["administrator"],
          blocked: false,
          isBootstrapAdministrator: false
        },
        "administrator"
      )
    ).toThrow("Administrator promotion is restricted");
  });
});

