import { Body, Controller, Get, Inject, Put, UseGuards } from "@nestjs/common";
import {
  BackofficeAuthGuard,
  RequireBackofficeCapability,
} from "../identity-access/auth/backoffice-auth.guard";
import { SlotSettingsSnapshot } from "./domain/slot-settings.types";
import { UpdateSlotSettingsInput } from "./slot-settings.commands";
import { SlotSettingsService } from "./slot-settings.service";

@Controller("backoffice/settings/slot-settings")
@UseGuards(BackofficeAuthGuard)
@RequireBackofficeCapability("settings")
export class SlotSettingsController {
  constructor(
    @Inject(SlotSettingsService)
    private readonly slotSettings: SlotSettingsService,
  ) {}

  @Get()
  async getSettings(): Promise<SlotSettingsSnapshot> {
    return this.slotSettings.getSettings();
  }

  @Put()
  async updateSettings(
    @Body() body: UpdateSlotSettingsInput,
  ): Promise<SlotSettingsSnapshot> {
    return this.slotSettings.updateSettings(body);
  }
}
