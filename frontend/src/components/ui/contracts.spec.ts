import { describe, expect, it } from "vitest";
import {
  APP_BUTTON_VARIANTS,
  APP_STATUS_BADGE_VARIANTS,
  resolveButtonVariant,
  resolveStatusBadgeVariant
} from "./contracts";

describe("ui contracts", () => {
  it("exposes stable app button variants", () => {
    expect(Object.keys(APP_BUTTON_VARIANTS)).toEqual([
      "primary",
      "secondary",
      "outlined",
      "destructive",
      "ghost",
      "tonal"
    ]);
    expect(resolveButtonVariant("primary")).toMatchObject({
      color: "primary",
      variant: "flat"
    });
    expect(resolveButtonVariant("outlined")).toMatchObject({
      variant: "outlined"
    });
  });

  it("exposes canonical status badge variants", () => {
    expect(Object.keys(APP_STATUS_BADGE_VARIANTS)).toEqual([
      "Created",
      "Confirmed",
      "Ready for pickup",
      "Rejected",
      "Closed"
    ]);
    expect(resolveStatusBadgeVariant("Confirmed")).toMatchObject({
      background: "var(--app-color-success-light)"
    });
  });
});
