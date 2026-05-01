import { describe, expect, it } from "vitest";
import {
  isAssignableUserRole,
  validateAssignRole,
} from "@/modules/users/validation";

describe("user role assignment validation", () => {
  it("accepts barista and administrator", () => {
    expect(validateAssignRole("barista")).toEqual({
      valid: true,
      payload: { assignedRole: "barista" },
      message: null,
    });
    expect(validateAssignRole("administrator")).toEqual({
      valid: true,
      payload: { assignedRole: "administrator" },
      message: null,
    });
  });

  it("rejects roles outside FEATURE-004 assignable set", () => {
    const result = validateAssignRole("customer");

    expect(result.valid).toBe(false);
    expect(result.payload).toBeNull();
    expect(isAssignableUserRole("customer")).toBe(false);
  });
});
