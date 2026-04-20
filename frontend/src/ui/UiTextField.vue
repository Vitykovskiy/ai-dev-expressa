<template>
  <v-text-field
    :id="id"
    v-model="model"
    class="app-input-control"
    :name="name"
    :placeholder="placeholder"
    :type="type"
    :min="min"
    :step="step"
    :disabled="disabled"
    :autofocus="autofocus"
    base-color="var(--app-color-border)"
    color="var(--app-color-accent)"
    bg-color="var(--app-color-background-primary)"
    :class="{
      'app-input-control--disabled': disabled,
    }"
    variant="outlined"
    density="comfortable"
    hide-details
  />
</template>

<script setup lang="ts">
type UiTextFieldModel = string | number | null | undefined;

withDefaults(
  defineProps<{
    id?: string;
    name?: string;
    placeholder?: string;
    type?: string;
    min?: string | number;
    step?: string | number;
    disabled?: boolean;
    autofocus?: boolean;
  }>(),
  {
    id: undefined,
    name: undefined,
    placeholder: undefined,
    type: "text",
    min: undefined,
    step: undefined,
    disabled: false,
    autofocus: false,
  },
);

const model = defineModel<UiTextFieldModel>({ required: true });
</script>
