import { getTelegramInitData } from "@/modules/auth/telegram";
import {
  isErrorResponseBody,
  readJson,
  resolveApiUrl,
} from "@/modules/shared/http";
import { isRecord } from "@/modules/shared/type-guards";
import type {
  SlotSettingsErrorCode,
  SlotSettingsSnapshot,
  UpdateSlotSettingsPayload,
} from "@/modules/slot-settings/types";

export interface SlotSettingsApiOptions {
  readonly apiBaseUrl?: string;
  readonly testTelegramId?: string;
  readonly initData?: string;
  readonly fetchImpl?: typeof fetch;
}

export interface SlotSettingsClient {
  getSettings(): Promise<SlotSettingsSnapshot>;
  updateSettings(
    payload: UpdateSlotSettingsPayload,
  ): Promise<SlotSettingsSnapshot>;
}

export class SlotSettingsApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code: SlotSettingsErrorCode,
  ) {
    super(message);
    this.name = "SlotSettingsApiError";
  }
}

export class SlotSettingsApi implements SlotSettingsClient {
  constructor(private readonly options: SlotSettingsApiOptions = {}) {}

  async getSettings(): Promise<SlotSettingsSnapshot> {
    return this.request<SlotSettingsSnapshot>(
      "/backoffice/settings/slot-settings",
    );
  }

  async updateSettings(
    payload: UpdateSlotSettingsPayload,
  ): Promise<SlotSettingsSnapshot> {
    return this.request<SlotSettingsSnapshot>(
      "/backoffice/settings/slot-settings",
      {
        method: "PUT",
        body: JSON.stringify(payload),
      },
    );
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await (this.options.fetchImpl ?? fetch)(
      this.resolveUrl(path),
      {
        ...init,
        headers: {
          "content-type": "application/json",
          ...this.authHeaders(),
          ...init.headers,
        },
      },
    );

    const body = await readJson(response);
    if (!response.ok) {
      const code = readErrorCode(body);
      throw new SlotSettingsApiError(code, response.status, code);
    }

    if (!isSlotSettingsSnapshot(body)) {
      throw new SlotSettingsApiError(
        "slot-settings-request-failed",
        response.status,
        "slot-settings-request-failed",
      );
    }

    return body as T;
  }

  private resolveUrl(path: string): string {
    return resolveApiUrl(this.options.apiBaseUrl, path);
  }

  private authHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    const initData = this.options.initData ?? getTelegramInitData();
    if (initData) {
      headers["x-telegram-init-data"] = initData;
    }

    const testTelegramId = this.options.testTelegramId?.trim();
    if (testTelegramId) {
      headers["x-test-telegram-id"] = testTelegramId;
    }

    return headers;
  }
}

export function createSlotSettingsApi(): SlotSettingsApi {
  return new SlotSettingsApi({
    apiBaseUrl: import.meta.env.VITE_BACKOFFICE_API_BASE_URL,
    testTelegramId: import.meta.env.VITE_BACKOFFICE_TEST_TELEGRAM_ID,
  });
}

function readErrorCode(body: unknown): SlotSettingsErrorCode {
  if (isErrorResponseBody(body) && typeof body.message === "string") {
    return body.message as SlotSettingsErrorCode;
  }

  return "slot-settings-request-failed";
}

function isSlotSettingsSnapshot(value: unknown): value is SlotSettingsSnapshot {
  if (!isRecord(value)) {
    return false;
  }

  const candidate = value as Partial<
    Record<keyof SlotSettingsSnapshot, unknown>
  >;
  return (
    typeof candidate.workingHoursOpen === "string" &&
    typeof candidate.workingHoursClose === "string" &&
    typeof candidate.slotCapacity === "number"
  );
}
