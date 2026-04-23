export interface SlotSettingsSnapshot {
  readonly workingHoursOpen: string;
  readonly workingHoursClose: string;
  readonly slotCapacity: number;
}

export interface AvailableSlot {
  readonly date: string;
  readonly slotStart: string;
  readonly slotEnd: string;
  readonly capacityLimit: number;
  readonly activeOrderCount: number;
}
