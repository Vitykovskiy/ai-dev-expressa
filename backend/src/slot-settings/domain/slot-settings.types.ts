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

export interface SlotOccupancy {
  readonly slotStart: string;
  readonly activeOrderCount: number;
}

export const DEFAULT_SLOT_SETTINGS: SlotSettingsSnapshot = {
  workingHoursOpen: "09:00",
  workingHoursClose: "20:00",
  slotCapacity: 5,
};

export const SLOT_INTERVAL_MINUTES = 10;
