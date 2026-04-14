import { Injectable } from "@nestjs/common";
import type { SlotSettingsDto } from "@expressa/shared-types";

import type { SlotSettingsRepository } from "../persistence.types";

@Injectable()
export class InMemorySlotSettingsRepository implements SlotSettingsRepository {
  private settings: SlotSettingsDto | null = null;

  async get(): Promise<SlotSettingsDto | null> {
    return this.settings ? structuredClone(this.settings) : null;
  }

  async save(settings: SlotSettingsDto): Promise<SlotSettingsDto> {
    this.settings = structuredClone(settings);
    return structuredClone(this.settings);
  }
}

