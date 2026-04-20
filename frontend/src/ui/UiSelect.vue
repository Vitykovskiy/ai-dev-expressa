<template>
  <v-select
    :id="id"
    v-model="model"
    class="app-input-control"
    :items="items"
    :item-title="itemTitle"
    :item-value="itemValue"
    :name="name"
    :placeholder="placeholder"
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
type UiSelectModel = string | number | null | undefined;

withDefaults(
  defineProps<{
    id?: string;
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    autofocus?: boolean;
    items?: readonly unknown[];
    itemTitle?: string;
    itemValue?: string;
  }>(),
  {
    id: undefined,
    name: undefined,
    placeholder: undefined,
    disabled: false,
    autofocus: false,
    items: () => [],
    itemTitle: undefined,
    itemValue: undefined,
  },
);

const model = defineModel<UiSelectModel>({ required: true });
</script>
