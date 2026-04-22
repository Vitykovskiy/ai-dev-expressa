import { Inject, Injectable } from "@nestjs/common";
import {
  AvailableSlot,
  SLOT_INTERVAL_MINUTES,
  SlotOccupancy,
  SlotSettingsSnapshot,
} from "./domain/slot-settings.types";
import {
  formatTime,
  parseTime,
  SlotSettingsValidator,
} from "./domain/slot-settings.validator";

@Injectable()
export class AvailableSlotsService {
  constructor(
    @Inject(SlotSettingsValidator)
    private readonly validator: SlotSettingsValidator,
  ) {}

  generateForToday(
    settings: SlotSettingsSnapshot,
    occupancies: readonly SlotOccupancy[] = [],
    now: Date = new Date(),
  ): AvailableSlot[] {
    this.validator.validateSnapshot(settings);
    this.validator.validateOccupancies(occupancies);

    const date = now.toISOString().slice(0, 10);
    const occupancyMap = new Map(
      occupancies.map((occupancy) => [
        occupancy.slotStart,
        occupancy.activeOrderCount,
      ]),
    );
    const openMinutes = parseTime(settings.workingHoursOpen);
    const closeMinutes = parseTime(settings.workingHoursClose);
    const slots: AvailableSlot[] = [];

    for (
      let slotStartMinutes = openMinutes;
      slotStartMinutes + SLOT_INTERVAL_MINUTES <= closeMinutes;
      slotStartMinutes += SLOT_INTERVAL_MINUTES
    ) {
      const slotStart = formatTime(slotStartMinutes);
      const activeOrderCount = occupancyMap.get(slotStart) ?? 0;

      if (activeOrderCount >= settings.slotCapacity) {
        continue;
      }

      slots.push({
        date,
        slotStart,
        slotEnd: formatTime(slotStartMinutes + SLOT_INTERVAL_MINUTES),
        capacityLimit: settings.slotCapacity,
        activeOrderCount,
      });
    }

    return slots;
  }
}
