import type {
  SlotSettingsFieldErrors,
  SlotSettingsFormDraft,
  SlotSettingsValidationResult,
} from "@/modules/slot-settings/types";

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const POSITIVE_INTEGER_PATTERN = /^[1-9]\d*$/;

export function createEmptySlotSettingsErrors(): SlotSettingsFieldErrors {
  return {
    workingHoursOpen: null,
    workingHoursClose: null,
    slotCapacity: null,
  };
}

export function validateSlotSettingsDraft(
  draft: SlotSettingsFormDraft,
): SlotSettingsValidationResult {
  const errors = createEmptySlotSettingsErrors();

  if (!draft.workingHoursOpen) {
    errors.workingHoursOpen = "Укажите время открытия.";
  } else if (!TIME_PATTERN.test(draft.workingHoursOpen)) {
    errors.workingHoursOpen = "Введите время в формате ЧЧ:ММ.";
  }

  if (!draft.workingHoursClose) {
    errors.workingHoursClose = "Укажите время закрытия.";
  } else if (!TIME_PATTERN.test(draft.workingHoursClose)) {
    errors.workingHoursClose = "Введите время в формате ЧЧ:ММ.";
  }

  if (!draft.slotCapacity.trim()) {
    errors.slotCapacity = "Укажите вместимость слота.";
  } else if (!POSITIVE_INTEGER_PATTERN.test(draft.slotCapacity.trim())) {
    errors.slotCapacity = "Введите целое число больше 0.";
  }

  if (
    !errors.workingHoursOpen &&
    !errors.workingHoursClose &&
    parseTime(draft.workingHoursClose) <= parseTime(draft.workingHoursOpen)
  ) {
    errors.workingHoursClose =
      "Время закрытия должно быть позже времени открытия.";
  }

  const valid = Object.values(errors).every((value) => value === null);
  return {
    valid,
    payload: valid
      ? {
          workingHoursOpen: draft.workingHoursOpen,
          workingHoursClose: draft.workingHoursClose,
          slotCapacity: Number.parseInt(draft.slotCapacity, 10),
        }
      : null,
    errors,
  };
}

function parseTime(value: string): number {
  const match = TIME_PATTERN.exec(value);
  if (!match) {
    return Number.NaN;
  }

  return Number(match[1]) * 60 + Number(match[2]);
}
