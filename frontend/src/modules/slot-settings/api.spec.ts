import { describe, expect, it, vi } from "vitest";
import {
  SlotSettingsApi,
  SlotSettingsApiError,
} from "@/modules/slot-settings/api";

const snapshot = {
  workingHoursOpen: "09:00",
  workingHoursClose: "20:00",
  slotCapacity: 5,
};

describe("SlotSettingsApi", () => {
  it("loads settings with backoffice auth headers", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(snapshot), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const api = new SlotSettingsApi({
      apiBaseUrl: "http://localhost:3000",
      initData: "signed-init-data",
      testTelegramId: "1001",
      fetchImpl,
    });

    await api.getSettings();

    expect(fetchImpl).toHaveBeenCalledWith(
      "http://localhost:3000/backoffice/settings/slot-settings",
      {
        headers: {
          "content-type": "application/json",
          "x-telegram-init-data": "signed-init-data",
          "x-test-telegram-id": "1001",
        },
      },
    );
  });

  it("puts full slot settings payload to contract endpoint", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(snapshot), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );
    const api = new SlotSettingsApi({ fetchImpl });

    await api.updateSettings({
      workingHoursOpen: "08:00",
      workingHoursClose: "18:00",
      slotCapacity: 6,
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      "/backoffice/settings/slot-settings",
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          workingHoursOpen: "08:00",
          workingHoursClose: "18:00",
          slotCapacity: 6,
        }),
      },
    );
  });

  it("maps backend validation errors", async () => {
    const api = new SlotSettingsApi({
      fetchImpl: vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "invalid-working-hours" }), {
          status: 400,
          headers: { "content-type": "application/json" },
        }),
      ),
    });

    await expect(
      api.updateSettings({
        workingHoursOpen: "18:00",
        workingHoursClose: "18:00",
        slotCapacity: 6,
      }),
    ).rejects.toEqual(
      expect.objectContaining<Partial<SlotSettingsApiError>>({
        status: 400,
        code: "invalid-working-hours",
      }),
    );
  });
});
