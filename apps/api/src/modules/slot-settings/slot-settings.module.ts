import { Module } from "@nestjs/common";

import { AuthSessionModule } from "../auth-session/auth-session.module";
import { SlotSettingsController } from "./slot-settings.controller";
import { SlotSettingsMapper } from "./slot-settings.mapper";
import { SlotSettingsService } from "./slot-settings.service";
import { SlotSettingsValidator } from "./slot-settings.validator";

@Module({
  imports: [AuthSessionModule],
  controllers: [SlotSettingsController],
  providers: [SlotSettingsValidator, SlotSettingsMapper, SlotSettingsService]
})
export class SlotSettingsModule {}
