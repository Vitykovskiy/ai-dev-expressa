import { Body, Controller, Get, Put, UseGuards } from "@nestjs/common";
import type { UpdateSlotSettingsRequestDto } from "@expressa/shared-types";

import { CurrentActor } from "../../common/auth/current-actor";
import { BackofficeAuthGuard } from "../../common/auth/backoffice-auth.guard";
import type { AuthenticatedActor } from "../auth-session/auth-session.service";
import { SlotSettingsService } from "./slot-settings.service";

@Controller("slot-settings")
@UseGuards(BackofficeAuthGuard)
export class SlotSettingsController {
  constructor(private readonly slotSettingsService: SlotSettingsService) {}

  @Get()
  getSettings(@CurrentActor() actor: AuthenticatedActor) {
    return this.slotSettingsService.getSettings(actor);
  }

  @Put()
  saveSettings(
    @CurrentActor() actor: AuthenticatedActor,
    @Body() request: UpdateSlotSettingsRequestDto
  ) {
    return this.slotSettingsService.saveSettings(actor, request);
  }
}

