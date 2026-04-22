import { Inject, Injectable } from "@nestjs/common";
import { AvailableSlotsService } from "./available-slots.service";
import {
  AvailableSlot,
  DEFAULT_SLOT_SETTINGS,
  SlotOccupancy,
  SlotSettingsSnapshot,
} from "./domain/slot-settings.types";
import { SlotSettingsValidator } from "./domain/slot-settings.validator";
import { UpdateSlotSettingsInput } from "./slot-settings.commands";
import {
  SLOT_SETTINGS_REPOSITORY,
  SlotSettingsRepository,
} from "./repository/slot-settings.repository";

@Injectable()
export class SlotSettingsService {
  constructor(
    @Inject(SLOT_SETTINGS_REPOSITORY)
    private readonly repository: SlotSettingsRepository,
    @Inject(SlotSettingsValidator)
    private readonly validator: SlotSettingsValidator,
    @Inject(AvailableSlotsService)
    private readonly availableSlots: AvailableSlotsService,
  ) {}

  async getSettings(): Promise<SlotSettingsSnapshot> {
    return (await this.repository.getSnapshot()) ?? DEFAULT_SLOT_SETTINGS;
  }

  async updateSettings(
    input: UpdateSlotSettingsInput,
  ): Promise<SlotSettingsSnapshot> {
    const current = await this.getSettings();
    const next: SlotSettingsSnapshot = {
      workingHoursOpen: input.workingHoursOpen ?? current.workingHoursOpen,
      workingHoursClose: input.workingHoursClose ?? current.workingHoursClose,
      slotCapacity: input.slotCapacity ?? current.slotCapacity,
    };

    this.validator.validateSnapshot(next);
    return this.repository.saveSnapshot(next);
  }

  async getAvailableSlots(
    occupancies: readonly SlotOccupancy[] = [],
    now?: Date,
  ): Promise<AvailableSlot[]> {
    return this.availableSlots.generateForToday(
      await this.getSettings(),
      occupancies,
      now,
    );
  }
}
