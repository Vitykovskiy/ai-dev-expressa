import { reactive, readonly } from "vue";
import {
  createSlotSettingsApi,
  SlotSettingsApiError,
  type SlotSettingsClient,
} from "@/modules/slot-settings/api";
import type {
  SlotSettingsErrorCode,
  SlotSettingsSnapshot,
  SlotSettingsState,
  UpdateSlotSettingsPayload,
} from "@/modules/slot-settings/types";

const state = reactive<SlotSettingsState>({
  loadStatus: "idle",
  saveStatus: "idle",
  snapshot: null,
  loadErrorCode: null,
  saveErrorCode: null,
});

let api: SlotSettingsClient = createSlotSettingsApi();
let pendingLoad: Promise<SlotSettingsSnapshot> | null = null;

export function useSlotSettingsStore() {
  return {
    state: readonly(state),
    loadSettings,
    saveSettings,
    resetSaveState,
  };
}

export function setSlotSettingsApiForTests(nextApi: SlotSettingsClient): void {
  api = nextApi;
  resetSlotSettingsStore();
}

export function resetSlotSettingsStore(): void {
  state.loadStatus = "idle";
  state.saveStatus = "idle";
  state.snapshot = null;
  state.loadErrorCode = null;
  state.saveErrorCode = null;
  pendingLoad = null;
}

export async function loadSettings(): Promise<SlotSettingsSnapshot> {
  if (state.loadStatus === "ready" && state.snapshot) {
    return state.snapshot;
  }

  if (pendingLoad) {
    return pendingLoad;
  }

  state.loadStatus = "loading";
  state.loadErrorCode = null;
  pendingLoad = api
    .getSettings()
    .then((snapshot) => {
      state.snapshot = snapshot;
      state.loadStatus = "ready";
      state.loadErrorCode = null;
      return snapshot;
    })
    .catch((error) => {
      state.loadStatus = "error";
      state.loadErrorCode = resolveErrorCode(error);
      throw error;
    })
    .finally(() => {
      pendingLoad = null;
    });

  return pendingLoad;
}

export async function saveSettings(
  payload: UpdateSlotSettingsPayload,
): Promise<SlotSettingsSnapshot> {
  state.saveStatus = "saving";
  state.saveErrorCode = null;

  try {
    const snapshot = await api.updateSettings(payload);
    state.snapshot = snapshot;
    state.loadStatus = "ready";
    state.loadErrorCode = null;
    state.saveStatus = "success";
    return snapshot;
  } catch (error) {
    state.saveStatus = "error";
    state.saveErrorCode = resolveErrorCode(error);
    throw error;
  }
}

export function resetSaveState(): void {
  state.saveStatus = "idle";
  state.saveErrorCode = null;
}

function resolveErrorCode(error: unknown): SlotSettingsErrorCode {
  return error instanceof SlotSettingsApiError
    ? error.code
    : "slot-settings-request-failed";
}
