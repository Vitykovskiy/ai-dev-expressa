import { Injectable } from "@nestjs/common";
import { SlotSettingsSnapshot } from "../domain/slot-settings.types";
import { SlotSettingsRepository } from "./slot-settings.repository";

@Injectable()
export class InMemorySlotSettingsRepository implements SlotSettingsRepository {
  private snapshot: SlotSettingsSnapshot | null = null;

  async getSnapshot(): Promise<SlotSettingsSnapshot | null> {
    return cloneSnapshot(this.snapshot);
  }

  async saveSnapshot(
    snapshot: SlotSettingsSnapshot,
  ): Promise<SlotSettingsSnapshot> {
    this.snapshot = cloneSnapshot(snapshot);
    return cloneSnapshot(snapshot) as SlotSettingsSnapshot;
  }

  async clear(): Promise<void> {
    this.snapshot = null;
  }
}

function cloneSnapshot(
  snapshot: SlotSettingsSnapshot | null,
): SlotSettingsSnapshot | null {
  if (!snapshot) {
    return null;
  }

  return {
    workingHoursOpen: snapshot.workingHoursOpen,
    workingHoursClose: snapshot.workingHoursClose,
    slotCapacity: snapshot.slotCapacity,
  };
}
