import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  SlotSettingsApiError,
  type SlotSettingsClient,
} from "@/modules/slot-settings/api";
import {
  resetSlotSettingsStore,
  setSlotSettingsApiForTests,
  useSlotSettingsStore,
} from "@/modules/slot-settings/store";
import type { SlotSettingsSnapshot } from "@/modules/slot-settings/types";

const defaultSnapshot: SlotSettingsSnapshot = {
  workingHoursOpen: "09:00",
  workingHoursClose: "20:00",
  slotCapacity: 5,
};

const updatedSnapshot: SlotSettingsSnapshot = {
  workingHoursOpen: "08:00",
  workingHoursClose: "18:00",
  slotCapacity: 6,
};

function createApiMock(
  overrides: Partial<SlotSettingsClient> = {},
): SlotSettingsClient {
  return {
    getSettings: vi.fn().mockResolvedValue(defaultSnapshot),
    updateSettings: vi.fn().mockResolvedValue(updatedSnapshot),
    ...overrides,
  };
}

describe("slot settings store", () => {
  beforeEach(() => {
    setSlotSettingsApiForTests(createApiMock());
  });

  it("loads and exposes current snapshot", async () => {
    const store = useSlotSettingsStore();

    await store.loadSettings();

    expect(store.state.loadStatus).toBe("ready");
    expect(store.state.snapshot).toEqual(defaultSnapshot);
  });

  it("applies snapshot after successful save", async () => {
    const api = createApiMock();
    setSlotSettingsApiForTests(api);
    const store = useSlotSettingsStore();

    await store.saveSettings(updatedSnapshot);

    expect(api.updateSettings).toHaveBeenCalledWith(updatedSnapshot);
    expect(store.state.snapshot).toEqual(updatedSnapshot);
    expect(store.state.saveStatus).toBe("success");
  });

  it("keeps backend validation code in save state", async () => {
    const error = new SlotSettingsApiError(
      "invalid-slot-capacity",
      400,
      "invalid-slot-capacity",
    );
    setSlotSettingsApiForTests(
      createApiMock({
        updateSettings: vi.fn().mockRejectedValue(error),
      }),
    );
    const store = useSlotSettingsStore();

    await expect(
      store.saveSettings({
        workingHoursOpen: "08:00",
        workingHoursClose: "18:00",
        slotCapacity: 0,
      }),
    ).rejects.toBe(error);
    expect(store.state.saveStatus).toBe("error");
    expect(store.state.saveErrorCode).toBe("invalid-slot-capacity");

    resetSlotSettingsStore();
  });
});
