import { SlotSettingsSnapshot } from "../domain/slot-settings.types";

export const SLOT_SETTINGS_REPOSITORY = Symbol("SLOT_SETTINGS_REPOSITORY");

export interface SlotSettingsRepository {
  getSnapshot(): Promise<SlotSettingsSnapshot | null>;
  saveSnapshot(snapshot: SlotSettingsSnapshot): Promise<SlotSettingsSnapshot>;
  clear(): Promise<void>;
}
