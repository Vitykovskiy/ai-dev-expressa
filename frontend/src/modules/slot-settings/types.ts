export interface SlotSettingsSnapshot {
  readonly workingHoursOpen: string;
  readonly workingHoursClose: string;
  readonly slotCapacity: number;
}

export interface UpdateSlotSettingsPayload {
  readonly workingHoursOpen: string;
  readonly workingHoursClose: string;
  readonly slotCapacity: number;
}

export interface SlotSettingsFormDraft {
  workingHoursOpen: string;
  workingHoursClose: string;
  slotCapacity: string;
}

export interface SlotSettingsFieldErrors {
  workingHoursOpen: string | null;
  workingHoursClose: string | null;
  slotCapacity: string | null;
}

export interface SlotSettingsValidationResult {
  readonly valid: boolean;
  readonly payload: UpdateSlotSettingsPayload | null;
  readonly errors: SlotSettingsFieldErrors;
}

export type SlotSettingsErrorCode =
  | "invalid-working-hours"
  | "invalid-slot-capacity"
  | "administrator-role-required"
  | "slot-settings-request-failed";

export interface SlotSettingsState {
  loadStatus: "idle" | "loading" | "ready" | "error";
  saveStatus: "idle" | "saving" | "success" | "error";
  snapshot: SlotSettingsSnapshot | null;
  loadErrorCode: SlotSettingsErrorCode | null;
  saveErrorCode: SlotSettingsErrorCode | null;
}
