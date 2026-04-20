import { describe, expect, it } from "vitest";
import { getVisibleTabs } from "@/modules/navigation/tabs";

describe("getVisibleTabs", () => {
  it("returns only barista tabs for barista capabilities", () => {
    expect(getVisibleTabs(["orders", "availability"])).toEqual([
      expect.objectContaining({ id: "orders", path: "/" }),
      expect.objectContaining({ id: "availability", path: "/availability" }),
    ]);
  });

  it("returns all administrator tabs for administrator capabilities", () => {
    expect(
      getVisibleTabs(["orders", "availability", "menu", "users", "settings"]),
    ).toHaveLength(5);
  });
});
