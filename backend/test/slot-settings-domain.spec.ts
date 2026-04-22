import "reflect-metadata";
import { describe, expect, it } from "vitest";
import { AvailableSlotsService } from "../src/slot-settings/available-slots.service";
import {
  InvalidSlotCapacityError,
  InvalidWorkingHoursError,
} from "../src/slot-settings/domain/slot-settings.errors";
import { SlotSettingsValidator } from "../src/slot-settings/domain/slot-settings.validator";

describe("SlotSettings domain", () => {
  const validator = new SlotSettingsValidator();
  const availableSlots = new AvailableSlotsService(validator);

  it("rejects working hours when close time is not later than open time", () => {
    expect(() =>
      validator.validateSnapshot({
        workingHoursOpen: "18:00",
        workingHoursClose: "18:00",
        slotCapacity: 5,
      }),
    ).toThrow(InvalidWorkingHoursError);
  });

  it("rejects slot capacity when it is not a positive integer", () => {
    expect(() =>
      validator.validateSnapshot({
        workingHoursOpen: "09:00",
        workingHoursClose: "20:00",
        slotCapacity: 0,
      }),
    ).toThrow(InvalidSlotCapacityError);
  });

  it("generates 10-minute available slots for the current day and skips full intervals", () => {
    const slots = availableSlots.generateForToday(
      {
        workingHoursOpen: "09:00",
        workingHoursClose: "09:30",
        slotCapacity: 2,
      },
      [
        { slotStart: "09:00", activeOrderCount: 2 },
        { slotStart: "09:10", activeOrderCount: 1 },
      ],
      new Date("2026-04-23T08:00:00.000Z"),
    );

    expect(slots).toEqual([
      {
        date: "2026-04-23",
        slotStart: "09:10",
        slotEnd: "09:20",
        capacityLimit: 2,
        activeOrderCount: 1,
      },
      {
        date: "2026-04-23",
        slotStart: "09:20",
        slotEnd: "09:30",
        capacityLimit: 2,
        activeOrderCount: 0,
      },
    ]);
  });
});
