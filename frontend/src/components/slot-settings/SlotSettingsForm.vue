<template>
  <div class="slot-settings-form">
    <ui-section-card
      title="Рабочие часы"
      body-class="slot-settings-form__section-body"
    >
      <div class="slot-settings-form__field-group">
        <ui-form-field
          label="Открытие"
          input-id="slot-settings-open"
          :error="errors.workingHoursOpen"
        >
          <v-text-field
            id="slot-settings-open"
            :model-value="modelValue.workingHoursOpen"
            class="slot-settings-form__input"
            type="time"
            variant="outlined"
            density="comfortable"
            hide-details
            :error="Boolean(errors.workingHoursOpen)"
            @update:model-value="
              updateField('workingHoursOpen', normalizeStringValue($event))
            "
          />
        </ui-form-field>

        <ui-form-field
          label="Закрытие"
          input-id="slot-settings-close"
          :error="errors.workingHoursClose"
        >
          <v-text-field
            id="slot-settings-close"
            :model-value="modelValue.workingHoursClose"
            class="slot-settings-form__input"
            type="time"
            variant="outlined"
            density="comfortable"
            hide-details
            :error="Boolean(errors.workingHoursClose)"
            @update:model-value="
              updateField('workingHoursClose', normalizeStringValue($event))
            "
          />
        </ui-form-field>
      </div>
    </ui-section-card>

    <ui-section-card
      title="Слоты"
      body-class="slot-settings-form__section-body"
    >
      <ui-form-field
        label="Вместимость слота (заказов)"
        input-id="slot-settings-capacity"
        hint="Сколько активных заказов помещается в один 10-минутный слот"
        :error="errors.slotCapacity"
      >
        <v-text-field
          id="slot-settings-capacity"
          :model-value="modelValue.slotCapacity"
          class="slot-settings-form__input"
          type="number"
          min="1"
          step="1"
          inputmode="numeric"
          variant="outlined"
          density="comfortable"
          hide-details
          :error="Boolean(errors.slotCapacity)"
          @update:model-value="
            updateField('slotCapacity', normalizeStringValue($event))
          "
        />
      </ui-form-field>
    </ui-section-card>

    <v-alert
      v-if="formError"
      class="slot-settings-form__alert"
      type="error"
      variant="tonal"
      density="comfortable"
    >
      {{ formError }}
    </v-alert>

    <div class="slot-settings-form__actions">
      <ui-button
        block
        :loading="isSaving"
        :disabled="isSubmitDisabled"
        @click="$emit('submit')"
      >
        Сохранить
      </ui-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import UiButton from "@/ui/UiButton.vue";
import UiFormField from "@/ui/UiFormField.vue";
import UiSectionCard from "@/ui/UiSectionCard.vue";
import type {
  SlotSettingsFieldErrors,
  SlotSettingsFormDraft,
} from "@/modules/slot-settings/types";

const props = defineProps<{
  modelValue: SlotSettingsFormDraft;
  errors: SlotSettingsFieldErrors;
  formError: string | null;
  isSaving: boolean;
  isSubmitDisabled: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: SlotSettingsFormDraft];
  submit: [];
}>();

function updateField(key: keyof SlotSettingsFormDraft, value: string): void {
  emit("update:modelValue", {
    ...props.modelValue,
    [key]: value,
  });
}

function normalizeStringValue(value: unknown): string {
  return typeof value === "string" ? value : "";
}
</script>

<style scoped lang="scss">
.slot-settings-form {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-md);
}

.slot-settings-form__field-group {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-md);
}

.slot-settings-form__section-body {
  display: flex;
  flex-direction: column;
  gap: var(--app-spacing-md);
}

.slot-settings-form__input {
  :deep(.v-field) {
    border-radius: var(--app-radius-md);
  }

  :deep(.v-field__outline) {
    --v-field-border-opacity: 1;

    color: var(--app-color-border);
  }

  :deep(.v-field.v-field--focused .v-field__outline) {
    color: var(--app-color-accent);
  }

  :deep(input) {
    color: var(--app-color-text-primary);
    font-size: 14px;
  }
}

.slot-settings-form__alert {
  border: 1px solid rgb(211 47 47 / 16%);
}

.slot-settings-form__actions {
  position: sticky;
  bottom: 0;
  z-index: 1;
  padding: var(--app-spacing-md);
  background: var(--app-color-background-primary);
  border-top: 1px solid var(--app-color-border);
}

@media (min-width: 960px) {
  .slot-settings-form__actions {
    margin-bottom: var(--app-spacing-lg);
    border: 1px solid var(--app-color-border);
    border-radius: var(--app-radius-lg);
  }
}
</style>
