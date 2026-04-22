<template>
  <section class="settings-view">
    <ui-top-bar title="Настройки" />

    <div class="settings-view__header">
      <h1 class="settings-view__title">Настройки</h1>
    </div>

    <div class="settings-view__body">
      <v-sheet
        v-if="isLoading"
        class="settings-view__loading-panel"
        rounded="lg"
        color="surface"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          :size="36"
          :width="4"
        />
        <span>Загружаем настройки</span>
      </v-sheet>

      <ui-section-card
        v-else-if="isLoadError"
        class="settings-view__status-card"
        title="Не удалось загрузить настройки"
      >
        <p class="settings-view__status-copy">{{ loadErrorMessage }}</p>
        <ui-button @click="reloadSettings">Повторить</ui-button>
      </ui-section-card>

      <slot-settings-form
        v-else
        v-model="draft"
        :errors="displayedErrors"
        :form-error="saveFeedback.formError"
        :is-saving="isSaving"
        :is-submit-disabled="isSubmitDisabled"
        @submit="submitSettings"
      />
    </div>

    <v-snackbar
      v-model="successToastOpen"
      location="top"
      color="success"
      :timeout="3000"
    >
      {{ slotSettingsSuccessMessage }}
    </v-snackbar>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import SlotSettingsForm from "@/components/slot-settings/SlotSettingsForm.vue";
import {
  createDraftFromSnapshot,
  mapSlotSettingsLoadError,
  mapSlotSettingsSaveError,
  mergeSlotSettingsErrors,
  slotSettingsSuccessMessage,
} from "@/modules/slot-settings/presentation";
import { useSlotSettingsStore } from "@/modules/slot-settings/store";
import type { SlotSettingsFormDraft } from "@/modules/slot-settings/types";
import { validateSlotSettingsDraft } from "@/modules/slot-settings/validation";
import UiButton from "@/ui/UiButton.vue";
import UiSectionCard from "@/ui/UiSectionCard.vue";
import UiTopBar from "@/ui/UiTopBar.vue";

const store = useSlotSettingsStore();
const draft = ref<SlotSettingsFormDraft>({
  workingHoursOpen: "",
  workingHoursClose: "",
  slotCapacity: "",
});
const submittedErrorCode = ref(store.state.saveErrorCode);
const successToastOpen = ref(false);

const snapshot = computed(() => store.state.snapshot);
const validation = computed(() => validateSlotSettingsDraft(draft.value));
const saveFeedback = computed(() =>
  mapSlotSettingsSaveError(submittedErrorCode.value),
);
const displayedErrors = computed(() =>
  mergeSlotSettingsErrors(
    validation.value.errors,
    saveFeedback.value.fieldErrors,
  ),
);
const isLoading = computed(
  () => store.state.loadStatus === "loading" && snapshot.value === null,
);
const isLoadError = computed(
  () => store.state.loadStatus === "error" && snapshot.value === null,
);
const isSaving = computed(() => store.state.saveStatus === "saving");
const isSubmitDisabled = computed(
  () => !validation.value.valid || isSaving.value || snapshot.value === null,
);
const loadErrorMessage = computed(() =>
  mapSlotSettingsLoadError(store.state.loadErrorCode),
);

onMounted(() => {
  void loadSettings();
});

watch(
  snapshot,
  (nextSnapshot) => {
    if (!nextSnapshot) {
      return;
    }

    draft.value = createDraftFromSnapshot(nextSnapshot);
  },
  { immediate: true },
);

watch(
  () => store.state.saveStatus,
  (status) => {
    if (status === "success") {
      successToastOpen.value = true;
      submittedErrorCode.value = null;
      store.resetSaveState();
    }
  },
);

watch(
  draft,
  () => {
    submittedErrorCode.value = null;
    store.resetSaveState();
  },
  { deep: true },
);

async function loadSettings(): Promise<void> {
  try {
    await store.loadSettings();
  } catch {
    // The view renders a retry state from the store error code.
  }
}

async function reloadSettings(): Promise<void> {
  await loadSettings();
}

async function submitSettings(): Promise<void> {
  if (!validation.value.valid || !validation.value.payload) {
    return;
  }

  submittedErrorCode.value = null;

  try {
    await store.saveSettings(validation.value.payload);
  } catch {
    submittedErrorCode.value = store.state.saveErrorCode;
  }
}
</script>

<style scoped lang="scss">
.settings-view {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: var(--app-color-background-secondary);
}

@media (min-width: 960px) {
  .settings-view {
    background: var(--app-color-background-primary);
  }
}

.settings-view__header {
  display: none;
}

@media (min-width: 960px) {
  .settings-view__header {
    display: block;
    padding: var(--app-spacing-lg) var(--app-spacing-lg) 0;
  }
}

.settings-view__title {
  margin: 0;
  color: var(--app-color-text-primary);
  font-size: 32px;
  line-height: 40px;
  font-weight: 700;
}

.settings-view__body {
  flex: 1;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: var(--app-spacing-md) var(--app-spacing-md) 80px;
}

@media (min-width: 960px) {
  .settings-view__body {
    padding: var(--app-spacing-lg);
  }
}

.settings-view__loading-panel {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  color: var(--app-color-text-secondary);
  font-size: 14px;
  border: 1px solid var(--app-color-border);
  box-shadow: none;
}

.settings-view__status-card {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-md);
}

.settings-view__status-copy {
  margin: 0 0 var(--app-spacing-md);
  color: var(--app-color-text-secondary);
  font-size: 14px;
  line-height: 22px;
}
</style>
