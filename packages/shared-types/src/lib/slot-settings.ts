export interface WorkingHoursDto {
  startTime: string;
  endTime: string;
}

export interface SlotSettingsDto {
  workingHours: WorkingHoursDto;
  slotCapacity: number;
}

export interface SlotSettingsResponseDto {
  settings: SlotSettingsDto;
}

export interface UpdateSlotSettingsRequestDto {
  settings: SlotSettingsDto;
}

