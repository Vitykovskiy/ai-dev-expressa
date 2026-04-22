import { Module } from "@nestjs/common";
import { IdentityAccessModule } from "../identity-access/identity-access.module";
import { AvailableSlotsService } from "./available-slots.service";
import { CustomerSlotsController } from "./customer-slots.controller";
import { SlotSettingsValidator } from "./domain/slot-settings.validator";
import { SlotSettingsController } from "./slot-settings.controller";
import { SlotSettingsService } from "./slot-settings.service";
import { InMemorySlotSettingsRepository } from "./repository/in-memory-slot-settings.repository";
import { SLOT_SETTINGS_REPOSITORY } from "./repository/slot-settings.repository";

@Module({
  imports: [IdentityAccessModule],
  controllers: [SlotSettingsController, CustomerSlotsController],
  providers: [
    SlotSettingsValidator,
    AvailableSlotsService,
    SlotSettingsService,
    {
      provide: SLOT_SETTINGS_REPOSITORY,
      useClass: InMemorySlotSettingsRepository,
    },
  ],
  exports: [SlotSettingsService],
})
export class SlotSettingsModule {}
