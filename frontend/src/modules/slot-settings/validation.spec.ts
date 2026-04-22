import { describe, expect, it } from "vitest";
import { validateSlotSettingsDraft } from "@/modules/slot-settings/validation";

describe("validateSlotSettingsDraft", () => {
  it("accepts valid working hours and positive integer capacity", () => {
    const result = validateSlotSettingsDraft({
      workingHoursOpen: "08:00",
      workingHoursClose: "18:00",
      slotCapacity: "6",
    });

    expect(result.valid).toBe(true);
    expect(result.payload).toEqual({
      workingHoursOpen: "08:00",
      workingHoursClose: "18:00",
      slotCapacity: 6,
    });
  });

  it("rejects non-increasing working hours", () => {
    const result = validateSlotSettingsDraft({
      workingHoursOpen: "18:00",
      workingHoursClose: "18:00",
      slotCapacity: "6",
    });

    expect(result.valid).toBe(false);
    expect(result.errors.workingHoursClose).toBe(
      "Время закрытия должно быть позже времени открытия.",
    );
  });

  it("rejects non-positive slot capacity", () => {
    const result = validateSlotSettingsDraft({
      workingHoursOpen: "08:00",
      workingHoursClose: "18:00",
      slotCapacity: "0",
    });

    expect(result.valid).toBe(false);
    expect(result.errors.slotCapacity).toBe("Введите целое число больше 0.");
  });
});
