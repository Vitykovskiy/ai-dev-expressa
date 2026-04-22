import { Controller, Get, Inject } from "@nestjs/common";
import { AvailableSlot } from "./domain/slot-settings.types";
import { SlotSettingsService } from "./slot-settings.service";

@Controller("customer/slots")
export class CustomerSlotsController {
  constructor(
    @Inject(SlotSettingsService)
    private readonly slotSettings: SlotSettingsService,
  ) {}

  @Get()
  async getSlots(): Promise<AvailableSlot[]> {
    return this.slotSettings.getAvailableSlots();
  }
}
