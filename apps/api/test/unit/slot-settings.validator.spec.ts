import { SlotSettingsValidator } from "../../src/modules/slot-settings/slot-settings.validator";

describe("SlotSettingsValidator", () => {
  it("accepts valid working hours and positive capacity", () => {
    const validator = new SlotSettingsValidator();

    expect(() =>
      validator.validate({
        workingHours: {
          startTime: "09:00",
          endTime: "20:00"
        },
        slotCapacity: 5
      })
    ).not.toThrow();
  });

  it("rejects inverted working hours", () => {
    const validator = new SlotSettingsValidator();

    expect(() =>
      validator.validate({
        workingHours: {
          startTime: "20:00",
          endTime: "09:00"
        },
        slotCapacity: 5
      })
    ).toThrow("Working hours must be valid HH:mm range");
  });
});

