import { describe, expect, it } from "vitest";
import { getVisibleTabs } from "@/modules/navigation/tabs";

describe("getVisibleTabs", () => {
  it("returns only barista tabs for barista capabilities", () => {
    const tabs = getVisibleTabs(["orders", "availability"]);

    expect(tabs).toEqual([
      expect.objectContaining({ id: "orders", path: "/" }),
      expect.objectContaining({ id: "availability", path: "/availability" }),
    ]);
    expect(tabs).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: "menu" })]),
    );
  });

  it("returns all administrator tabs for administrator capabilities", () => {
    expect(
      getVisibleTabs(["orders", "availability", "menu", "users", "settings"]),
    ).toHaveLength(5);
  });

  it("binds menu tab visibility to menu capability", () => {
    expect(getVisibleTabs(["menu"])).toEqual([
      expect.objectContaining({ id: "menu", label: "Меню", path: "/menu" }),
    ]);
  });
});
