import { Injectable } from "@nestjs/common";
import { SlotSettingsSnapshot, SlotOccupancy } from "./slot-settings.types";
import {
  InvalidSlotCapacityError,
  InvalidWorkingHoursError,
} from "./slot-settings.errors";

@Injectable()
export class SlotSettingsValidator {
  validateSnapshot(snapshot: SlotSettingsSnapshot): void {
    const openMinutes = parseTime(snapshot.workingHoursOpen);
    const closeMinutes = parseTime(snapshot.workingHoursClose);

    if (closeMinutes <= openMinutes) {
      throw new InvalidWorkingHoursError();
    }

    if (
      !Number.isInteger(snapshot.slotCapacity) ||
      snapshot.slotCapacity <= 0
    ) {
      throw new InvalidSlotCapacityError();
    }
  }

  validateOccupancies(occupancies: readonly SlotOccupancy[]): void {
    for (const occupancy of occupancies) {
      parseTime(occupancy.slotStart);
      if (
        !Number.isInteger(occupancy.activeOrderCount) ||
        occupancy.activeOrderCount < 0
      ) {
        throw new InvalidSlotCapacityError();
      }
    }
  }
}

export function parseTime(value: string): number {
  if (typeof value !== "string") {
    throw new InvalidWorkingHoursError();
  }

  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value);
  if (!match) {
    throw new InvalidWorkingHoursError();
  }

  const [, hours, minutes] = match;
  return Number(hours) * 60 + Number(minutes);
}

export function formatTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
