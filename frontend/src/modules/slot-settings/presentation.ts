import type {
  SlotSettingsErrorCode,
  SlotSettingsFieldErrors,
  SlotSettingsFormDraft,
  SlotSettingsSnapshot,
} from "@/modules/slot-settings/types";
import { createEmptySlotSettingsErrors } from "@/modules/slot-settings/validation";

export function createDraftFromSnapshot(
  snapshot: SlotSettingsSnapshot,
): SlotSettingsFormDraft {
  return {
    workingHoursOpen: snapshot.workingHoursOpen,
    workingHoursClose: snapshot.workingHoursClose,
    slotCapacity: String(snapshot.slotCapacity),
  };
}

export function mergeSlotSettingsErrors(
  base: SlotSettingsFieldErrors,
  override: Partial<SlotSettingsFieldErrors>,
): SlotSettingsFieldErrors {
  return {
    workingHoursOpen: override.workingHoursOpen ?? base.workingHoursOpen,
    workingHoursClose: override.workingHoursClose ?? base.workingHoursClose,
    slotCapacity: override.slotCapacity ?? base.slotCapacity,
  };
}

export function mapSlotSettingsSaveError(code: SlotSettingsErrorCode | null): {
  readonly fieldErrors: SlotSettingsFieldErrors;
  readonly formError: string | null;
} {
  const fieldErrors = createEmptySlotSettingsErrors();

  switch (code) {
    case "invalid-working-hours":
      return {
        fieldErrors: {
          ...fieldErrors,
          workingHoursClose:
            "Время закрытия должно быть позже времени открытия.",
        },
        formError: null,
      };
    case "invalid-slot-capacity":
      return {
        fieldErrors: {
          ...fieldErrors,
          slotCapacity: "Введите целое число больше 0.",
        },
        formError: null,
      };
    case "administrator-role-required":
      return {
        fieldErrors,
        formError: "Доступ к настройкам слотов доступен только администратору.",
      };
    case "slot-settings-request-failed":
      return {
        fieldErrors,
        formError: "Не удалось сохранить настройки. Попробуйте ещё раз.",
      };
    default:
      return {
        fieldErrors,
        formError: null,
      };
  }
}

export function mapSlotSettingsLoadError(
  code: SlotSettingsErrorCode | null,
): string {
  if (code === "administrator-role-required") {
    return "Доступ к настройкам слотов доступен только администратору.";
  }

  return "Не удалось загрузить настройки. Попробуйте ещё раз.";
}

export const slotSettingsSuccessMessage = "Настройки сохранены";
