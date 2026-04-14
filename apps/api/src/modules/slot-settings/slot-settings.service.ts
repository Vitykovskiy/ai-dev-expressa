import { Inject, Injectable } from "@nestjs/common";
import type {
  SlotSettingsDto,
  SlotSettingsResponseDto,
  UpdateSlotSettingsRequestDto
} from "@expressa/shared-types";

import { DomainError } from "../../common/errors/domain-error";
import type { AuthenticatedActor } from "../auth-session/auth-session.service";
import {
  SLOT_SETTINGS_REPOSITORY,
  type SlotSettingsRepository
} from "../persistence/persistence.types";
import { SlotSettingsMapper } from "./slot-settings.mapper";
import { SlotSettingsValidator } from "./slot-settings.validator";

const defaultSettings = (): SlotSettingsDto => ({
  workingHours: {
    startTime: "09:00",
    endTime: "20:00"
  },
  slotCapacity: 5
});

@Injectable()
export class SlotSettingsService {
  constructor(
    @Inject(SLOT_SETTINGS_REPOSITORY)
    private readonly slotSettingsRepository: SlotSettingsRepository,
    private readonly slotSettingsValidator: SlotSettingsValidator,
    private readonly slotSettingsMapper: SlotSettingsMapper
  ) {}

  async getSettings(actor: AuthenticatedActor): Promise<SlotSettingsResponseDto> {
    this.ensureAdministrator(actor);
    const settings = (await this.slotSettingsRepository.get()) ?? defaultSettings();
    return this.slotSettingsMapper.toResponse(settings);
  }

  async saveSettings(
    actor: AuthenticatedActor,
    request: UpdateSlotSettingsRequestDto
  ): Promise<SlotSettingsResponseDto> {
    this.ensureAdministrator(actor);
    this.slotSettingsValidator.validate(request.settings);
    const saved = await this.slotSettingsRepository.save(request.settings);
    return this.slotSettingsMapper.toResponse(saved);
  }

  private ensureAdministrator(actor: AuthenticatedActor): void {
    if (!actor.user.roles.includes("administrator")) {
      throw new DomainError(
        "administrator-role-required",
        403,
        "Administrator role is required to manage slot settings"
      );
    }
  }
}

