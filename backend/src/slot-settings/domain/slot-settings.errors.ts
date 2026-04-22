import { BadRequestException } from "@nestjs/common";

export class InvalidWorkingHoursError extends BadRequestException {
  constructor() {
    super("invalid-working-hours");
  }
}

export class InvalidSlotCapacityError extends BadRequestException {
  constructor() {
    super("invalid-slot-capacity");
  }
}
