import { Injectable } from "@nestjs/common";
import type { SlotSettingsDto } from "@expressa/shared-types";

import type { SlotSettingsRepository } from "../persistence.types";
import { PrismaService } from "./prisma.service";

@Injectable()
export class PrismaSlotSettingsRepository implements SlotSettingsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async get(): Promise<SlotSettingsDto | null> {
    const state = await this.prismaService.slotSettingsState.findUnique({
      where: { id: 1 }
    });

    if (!state) {
      return null;
    }

    return {
      workingHours: {
        startTime: state.startTime,
        endTime: state.endTime
      },
      slotCapacity: state.slotCapacity
    };
  }

  async save(settings: SlotSettingsDto): Promise<SlotSettingsDto> {
    await this.prismaService.slotSettingsState.upsert({
      where: { id: 1 },
      create: {
        id: 1,
        startTime: settings.workingHours.startTime,
        endTime: settings.workingHours.endTime,
        slotCapacity: settings.slotCapacity
      },
      update: {
        startTime: settings.workingHours.startTime,
        endTime: settings.workingHours.endTime,
        slotCapacity: settings.slotCapacity
      }
    });

    return structuredClone(settings);
  }
}

