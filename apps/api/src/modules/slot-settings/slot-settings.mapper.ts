import { Injectable } from "@nestjs/common";
import type { SlotSettingsDto, SlotSettingsResponseDto } from "@expressa/shared-types";

@Injectable()
export class SlotSettingsMapper {
  toResponse(settings: SlotSettingsDto): SlotSettingsResponseDto {
    return {
      settings: structuredClone(settings)
    };
  }
}

