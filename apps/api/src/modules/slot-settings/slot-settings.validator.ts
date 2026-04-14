import { Injectable } from "@nestjs/common";
import type { SlotSettingsDto } from "@expressa/shared-types";

import { DomainError } from "../../common/errors/domain-error";

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

const toMinutes = (value: string): number => {
  const [hours, minutes] = value.split(":").map((part) => Number.parseInt(part, 10));
  return hours * 60 + minutes;
};

@Injectable()
export class SlotSettingsValidator {
  validate(settings: SlotSettingsDto): void {
    if (
      !timePattern.test(settings.workingHours.startTime) ||
      !timePattern.test(settings.workingHours.endTime) ||
      toMinutes(settings.workingHours.startTime) >= toMinutes(settings.workingHours.endTime)
    ) {
      throw new DomainError(
        "invalid-working-hours",
        400,
        "Working hours must be valid HH:mm range with start before end"
      );
    }

    if (!Number.isInteger(settings.slotCapacity) || settings.slotCapacity <= 0) {
      throw new DomainError(
        "invalid-slot-capacity",
        400,
        "Slot capacity must be a positive integer"
      );
    }
  }
}

